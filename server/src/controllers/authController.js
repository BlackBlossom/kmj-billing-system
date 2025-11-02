/**
 * Authentication Controller
 * Handles user registration, login, logout, password reset
 * Maintains compatibility with old PHP authentication system
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, Member, Counter } from '../models/index.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * Generate JWT token
 */
const generateToken = (userId, memberId, role) => {
  return jwt.sign(
    { id: userId, memberId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user (matches old PHP registration)
 * @access  Public
 */
export const register = asyncHandler(async (req, res, next) => {
  const { name, address, aadhaar, ward, houseNo, phone } = req.body;
  
  // Check if aadhaar already exists (old PHP check: SELECT * FROM register WHERE aadhaar=?)
  const existingUser = await User.findOne({ aadhaar });
  
  if (existingUser) {
    return next(new AppError('Aadhaar number already registered. Please login.', 400));
  }
  
  // Generate memberId (ward/houseNo format - matches old PHP: $userid = $ward . "/" . $houseno)
  const memberId = `${ward}/${houseNo}`;
  
  // Check if memberId already exists
  const existingMemberId = await User.findOne({ memberId });
  
  if (existingMemberId) {
    return next(new AppError(`Member ID ${memberId} already exists. Use a different house number.`, 400));
  }
  
  // Old PHP used aadhaar as password by default
  // We'll keep this for backward compatibility but hash it
  const hashedPassword = await bcrypt.hash(aadhaar, 10);
  
  // Create user
  const user = await User.create({
    memberId,
    name,
    email: `${memberId.replace('/', '_')}@kmj.local`, // Generated email
    phone,
    aadhaar,
    ward,
    address,
    password: hashedPassword,
    role: 'user', // Default role
    isActive: true
  });
  
  // Generate token
  const token = generateToken(user._id, user.memberId, user.role);
  const refreshToken = generateRefreshToken(user._id);
  
  // Send response (matching old PHP success behavior)
  res.status(201).json({
    success: true,
    message: 'Registration successful! You can now login with your Member ID and Aadhaar number.',
    data: {
      user: {
        id: user._id,
        memberId: user.memberId,
        name: user.name,
        ward: user.ward,
        role: user.role
      },
      token,
      refreshToken
    }
  });
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    User login (matches old PHP login)
 * @access  Public
 */
export const login = asyncHandler(async (req, res, next) => {
  const { memberId, password } = req.body;
  
  // Old PHP query: SELECT * FROM table_login WHERE kmjid=? AND password=?
  const user = await User.findOne({ memberId }).select('+password');
  
  if (!user) {
    return next(new AppError('Invalid Member ID or password.', 401));
  }
  
  // Check if account is active
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact admin.', 403));
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return next(new AppError('Invalid Member ID or password.', 401));
  }
  
  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  
  // Generate tokens
  const token = generateToken(user._id, user.memberId, user.role);
  const refreshToken = generateRefreshToken(user._id);
  
  // Send response with user data (matching old PHP session data)
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        memberId: user.memberId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        ward: user.ward,
        role: user.role,
        isActive: user.isActive,
        profileComplete: user.profileComplete,
        lastLogin: user.lastLogin
      },
      token,
      refreshToken
    }
  });
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    User logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res, next) => {
  // In JWT, logout is handled client-side by removing the token
  // But we can blacklist the token if needed (requires Redis or similar)
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh JWT token
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken: token } = req.body;
  
  if (!token) {
    return next(new AppError('Refresh token is required', 400));
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
    
    // Get user
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return next(new AppError('Invalid refresh token', 401));
    }
    
    // Generate new tokens
    const newToken = generateToken(user._id, user.memberId, user.role);
    const newRefreshToken = generateRefreshToken(user._id);
    
    res.status(200).json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
    
  } catch (error) {
    return next(new AppError('Invalid or expired refresh token', 401));
  }
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res, next) => {
  // User is already attached to req by verifyToken middleware
  const user = await User.findById(req.user._id).select('-password');
  
  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  // Get user with password
  const user = await User.findById(req.user._id).select('+password');
  
  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  
  if (!isPasswordValid) {
    return next(new AppError('Current password is incorrect', 401));
  }
  
  // Hash new password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Generate password reset token
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { memberId, aadhaar } = req.body;
  
  // Find user by memberId and aadhaar (security check)
  const user = await User.findOne({ memberId, aadhaar });
  
  if (!user) {
    return next(new AppError('No user found with that Member ID and Aadhaar combination', 404));
  }
  
  // Generate reset token (6-digit code)
  const resetToken = crypto.randomInt(100000, 999999).toString();
  
  // Hash token and save to database
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  await user.save({ validateBeforeSave: false });
  
  // In production, send SMS/email with resetToken
  // For now, return it in response (development only)
  res.status(200).json({
    success: true,
    message: 'Password reset code generated',
    data: {
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
      message: 'Please use this code to reset your password within 10 minutes'
    }
  });
});

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetToken, newPassword, memberId } = req.body;
  
  // Hash token
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Find user with valid reset token
  const user = await User.findOne({
    memberId,
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  
  if (!user) {
    return next(new AppError('Invalid or expired reset token', 400));
  }
  
  // Set new password
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  await user.save();
  
  // Generate new token
  const token = generateToken(user._id, user.memberId, user.role);
  
  res.status(200).json({
    success: true,
    message: 'Password reset successful',
    data: {
      token
    }
  });
});

/**
 * @route   POST /api/v1/auth/verify-member
 * @desc    Verify member ID and aadhaar before registration
 * @access  Public
 */
export const verifyMember = asyncHandler(async (req, res, next) => {
  const { memberId, aadhaar } = req.body;
  
  // Check if already registered
  const existingUser = await User.findOne({
    $or: [{ memberId }, { aadhaar }]
  });
  
  if (existingUser) {
    if (existingUser.memberId === memberId) {
      return next(new AppError('Member ID already registered', 400));
    }
    if (existingUser.aadhaar === aadhaar) {
      return next(new AppError('Aadhaar already registered', 400));
    }
  }
  
  res.status(200).json({
    success: true,
    message: 'Member ID and Aadhaar are available',
    data: {
      available: true
    }
  });
});
