/**
 * Land Model
 * Schema for logging land details
 */

import mongoose from 'mongoose';

const landSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  area: {
    type: String,
    required: [true, 'Area/Place is required'],
    trim: true,
  },
  ward: {
    type: String,
    required: [true, 'Ward/Building No is required'],
    trim: true,
  },
  attachmentUrl: {
    type: String,
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for better query performance
landSchema.index({ createdAt: -1 });
landSchema.index({ ward: 1 });
landSchema.index({ isDeleted: 1 });

const Land = mongoose.model('Land', landSchema);

export default Land;
