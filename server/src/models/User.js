import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { USER_ROLES } from '../utils/constants.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores and hyphens',
      ],
      // NO unique constraint - username not used in KMJ system
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      // NO validation or unique constraint for migration
      // Most users don't have email in the old system
    },
    password: {
      type: String,
      required: false, // Made optional for lenient migration
      // No default value - let it be undefined if not provided
      // NO minlength validation for migration
      select: false, // Don't return password by default
    },
    // KMJ-specific fields
    memberId: {
      type: String,
      required: false, // Made optional for lenient migration
      unique: true,
      sparse: true, // Allow multiple null/undefined, but duplicates of actual values fail
      trim: true,
      // No default value - let it be undefined if not provided
    },
    name: {
      type: String,
      required: false, // Made optional for lenient migration
      trim: true,
      // No default value - let it be undefined if not provided
    },
    phone: {
      type: String,
      trim: true,
    },
    aadhaar: {
      type: String,
      required: false, // Made optional for lenient migration
      trim: true,
      // No default value - let it be undefined if not provided
      // NO validation for migration - accept ANY format
    },
    ward: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(USER_ROLES),
        message: 'Invalid user role',
      },
      default: USER_ROLES.USER,
    },
    profile: {
      firstName: {
        type: String,
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters'],
      },
      lastName: {
        type: String,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters'],
      },
      phone: {
        type: String,
        trim: true,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
      },
      avatar: {
        url: String,
        publicId: String,
      },
      address: {
        street: String,
        ward: String,
        district: String,
        state: String,
        pincode: String,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
// Note: username and email are optional fields for KMJ system
// Only memberId is required for login (household-based authentication)
// userSchema.index({ email: 1 }, { unique: true, sparse: true }); // Commented out for migration
userSchema.index({ memberId: 1 }, { unique: true, sparse: true }); // Primary login identifier - sparse to allow nulls
// userSchema.index({ aadhaar: 1 }, { sparse: true }); // Commented out for migration - will be recreated after
userSchema.index({ isActive: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  if (this.name) {
    return this.name;
  }
  if (this.profile?.firstName && this.profile?.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.profile?.firstName || this.username || 'User';
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save hook to update passwordChangedAt
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  // Set passwordChangedAt to 1 second ago to ensure JWT is created after password change
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      email: this.email,
      role: this.role,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expire,
    }
  );
};

// Instance method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpire,
    }
  );
};

// Instance method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  // Generate random token
  const resetToken = require('crypto').randomBytes(32).toString('hex');

  // Hash token and set to passwordResetToken field
  this.passwordResetToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiry to 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Static method to find by credentials
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email, isActive: true }).select(
    '+password'
  );

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
