import mongoose from 'mongoose';

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
      maxlength: [10000, 'Content cannot exceed 10000 characters'], // Increased for rich text HTML
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
noticeSchema.index({ createdAt: -1 });
noticeSchema.index({ expiryDate: 1 });
noticeSchema.index({ title: 'text', content: 'text' });

// Virtual to check if expired
noticeSchema.virtual('isExpired').get(function () {
  return new Date() > this.expiryDate;
});

// Virtual for formatted publish date
noticeSchema.virtual('formattedPublishDate').get(function () {
  return this.createdAt.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
});

// Static method to get active (non-expired) notices
noticeSchema.statics.getActiveNotices = function (options = {}) {
  const query = {
    expiryDate: { $gte: new Date() },
  };

  return this.find(query)
    .sort({ createdAt: -1 })
    .populate('author', 'username profile.firstName profile.lastName')
    .exec();
};

// Static method to delete expired notices (for scheduled cleanup job)
noticeSchema.statics.deleteExpired = async function () {
  const result = await this.deleteMany({
    expiryDate: { $lt: new Date() },
  });
  return result;
};

// Instance method to increment views
noticeSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
