/**
 * Notice Controller
 * Handles notice board operations - Simplified version
 */

import Notice from '../models/Notice.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * @desc    Get all active (non-expired) notices
 * @route   GET /api/v1/notices
 * @access  Public
 */
export const getAllNotices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, includeExpired = 'false' } = req.query;

    // Build filter - only show non-expired notices by default
    const filter = {};
    
    if (includeExpired === 'false') {
      filter.expiryDate = { $gte: new Date() };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get notices
    const [notices, totalCount] = await Promise.all([
      Notice.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('author', 'username email')
        .lean(),
      Notice.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        notices,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalNotices: totalCount,
          noticesPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single notice by ID
 * @route   GET /api/v1/notices/:id
 * @access  Public
 */
export const getNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('author', 'username email');

    if (!notice) {
      return next(new AppError('Notice not found', 404));
    }

    res.status(200).json({
      success: true,
      data: notice
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new notice
 * @route   POST /api/v1/notices
 * @access  Private (Admin only)
 */
export const createNotice = async (req, res, next) => {
  try {
    const { title, content, expiryDate } = req.body;

    if (!title || !content || !expiryDate) {
      return next(new AppError('Please provide title, content, and expiry date', 400));
    }

    // Create notice with author from authenticated user
    const notice = await Notice.create({
      title,
      content,
      expiryDate: new Date(expiryDate),
      author: req.user.id || req.user._id
    });

    // Populate author details
    await notice.populate('author', 'username email');

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: notice
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update notice
 * @route   PUT /api/v1/notices/:id
 * @access  Private (Admin only)
 */
export const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return next(new AppError('Notice not found', 404));
    }

    const { title, content, expiryDate } = req.body;

    if (title !== undefined) notice.title = title;
    if (content !== undefined) notice.content = content;
    if (expiryDate !== undefined) notice.expiryDate = new Date(expiryDate);

    await notice.save();

    // Populate author details
    await notice.populate('author', 'username email');

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully',
      data: notice
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete notice
 * @route   DELETE /api/v1/notices/:id
 * @access  Private (Admin only)
 */
export const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return next(new AppError('Notice not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Increment notice view count
 * @route   POST /api/v1/notices/:id/view
 * @access  Public
 */
export const incrementViews = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!notice) {
      return next(new AppError('Notice not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { views: notice.views }
    });
  } catch (error) {
    next(error);
  }
};

