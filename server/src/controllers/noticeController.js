/**
 * Notice Controller
 * Handles notice board operations
 * 
 * PHP Compatibility:
 * - index.php (notice board on homepage)
 * - Pageinfo.php (notice details page)
 */

import Notice from '../models/Notice.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * @desc    Get all active notices
 * @route   GET /api/v1/notices
 * @access  Public
 * 
 * Matches: PHP index.php notice display
 */
export const getAllNotices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, priority = '' } = req.query;

    // Build filter (only active notices)
    const filter = { isActive: true };

    if (priority) {
      filter.priority = priority;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get notices
    const [notices, totalCount] = await Promise.all([
      Notice.find(filter)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-isActive -updatedAt')
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
 * 
 * Matches: PHP Pageinfo.php
 */
export const getNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice || !notice.isActive) {
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
    const {
      title,
      content,
      priority = 'normal',
      expiresAt
    } = req.body;

    // Create notice
    const notice = await Notice.create({
      title,
      content,
      priority,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: req.user.memberId,
      createdByName: req.user.name
    });

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

    const { title, content, priority, expiresAt, isActive } = req.body;

    if (title !== undefined) notice.title = title;
    if (content !== undefined) notice.content = content;
    if (priority !== undefined) notice.priority = priority;
    if (expiresAt !== undefined) notice.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (isActive !== undefined) notice.isActive = isActive;

    await notice.save();

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
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return next(new AppError('Notice not found', 404));
    }

    // Soft delete
    notice.isActive = false;
    await notice.save();

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

