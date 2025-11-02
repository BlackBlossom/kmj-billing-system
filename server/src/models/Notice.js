import mongoose from 'mongoose';
import { NOTICE_PRIORITY } from '../utils/constants.js';

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      enum: {
        values: [
          'General',
          'Event',
          'Announcement',
          'Madrassa',
          'Prayer Times',
          'Community',
          'Fundraising',
          'Emergency',
          'Maintenance',
          'Other',
        ],
        message: 'Invalid category',
      },
      default: 'General',
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: Object.values(NOTICE_PRIORITY),
        message: 'Invalid priority level',
      },
      default: NOTICE_PRIORITY.MEDIUM,
      index: true,
    },
    attachments: [
      {
        fileName: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        size: {
          type: Number, // in bytes
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        caption: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    targetAudience: {
      type: String,
      enum: ['All', 'Members Only', 'Specific Ward', 'Specific Group'],
      default: 'All',
    },
    specificWard: {
      type: String,
      trim: true,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    notificationSentAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
noticeSchema.index({ publishDate: -1 });
noticeSchema.index({ isActive: 1, publishDate: -1 });
noticeSchema.index({ isPinned: -1, publishDate: -1 });
noticeSchema.index({ category: 1, publishDate: -1 });
noticeSchema.index({ priority: 1, isActive: 1 });
noticeSchema.index({ expiryDate: 1 }, { sparse: true });
noticeSchema.index({ tags: 1 });
noticeSchema.index({ title: 'text', content: 'text' });
noticeSchema.index({ createdAt: -1 });

// Virtual for total likes
noticeSchema.virtual('likesCount').get(function () {
  return this.likes ? this.likes.length : 0;
});

// Virtual for total comments
noticeSchema.virtual('commentsCount').get(function () {
  return this.comments ? this.comments.length : 0;
});

// Virtual for total attachments
noticeSchema.virtual('attachmentsCount').get(function () {
  return this.attachments ? this.attachments.length : 0;
});

// Virtual to check if expired
noticeSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Virtual for formatted publish date
noticeSchema.virtual('formattedPublishDate').get(function () {
  return this.publishDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
});

// Pre-save hook to auto-deactivate expired notices
noticeSchema.pre('save', function (next) {
  if (this.expiryDate && new Date() > this.expiryDate) {
    this.isActive = false;
  }
  next();
});

// Static method to get active notices
noticeSchema.statics.getActiveNotices = function (options = {}) {
  const query = {
    isActive: true,
    publishDate: { $lte: new Date() },
    $or: [{ expiryDate: { $gte: new Date() } }, { expiryDate: null }],
  };

  if (options.category) query.category = options.category;
  if (options.priority) query.priority = options.priority;
  if (options.targetAudience) query.targetAudience = options.targetAudience;

  return this.find(query)
    .sort({ isPinned: -1, publishDate: -1 })
    .populate('author', 'username profile.firstName profile.lastName')
    .exec();
};

// Static method to get pinned notices
noticeSchema.statics.getPinnedNotices = function () {
  return this.find({
    isActive: true,
    isPinned: true,
    publishDate: { $lte: new Date() },
    $or: [{ expiryDate: { $gte: new Date() } }, { expiryDate: null }],
  })
    .sort({ publishDate: -1 })
    .populate('author', 'username profile.firstName profile.lastName')
    .limit(5)
    .exec();
};

// Static method to get notices by category
noticeSchema.statics.getByCategory = function (category) {
  return this.find({
    category,
    isActive: true,
    publishDate: { $lte: new Date() },
    $or: [{ expiryDate: { $gte: new Date() } }, { expiryDate: null }],
  })
    .sort({ publishDate: -1 })
    .populate('author', 'username profile.firstName profile.lastName')
    .exec();
};

// Static method to deactivate expired notices (for scheduled job)
noticeSchema.statics.deactivateExpired = async function () {
  const result = await this.updateMany(
    {
      isActive: true,
      expiryDate: { $lt: new Date() },
    },
    {
      $set: { isActive: false },
    }
  );
  return result;
};

// Instance method to increment views
noticeSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Instance method to add like
noticeSchema.methods.addLike = function (userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
  }
  return this.save();
};

// Instance method to remove like
noticeSchema.methods.removeLike = function (userId) {
  this.likes = this.likes.filter(
    (id) => id.toString() !== userId.toString()
  );
  return this.save();
};

// Instance method to add comment
noticeSchema.methods.addComment = function (userId, content) {
  this.comments.push({
    user: userId,
    content,
  });
  return this.save();
};

// Instance method to delete comment
noticeSchema.methods.deleteComment = function (commentId) {
  this.comments = this.comments.filter(
    (comment) => comment._id.toString() !== commentId.toString()
  );
  return this.save();
};

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
