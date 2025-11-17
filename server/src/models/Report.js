/**
 * Report Model
 * Schema for logging complaints/repairs
 */

import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  problem: {
    type: String,
    required: [true, 'Problem description is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  inventoryItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for better query performance
reportSchema.index({ createdAt: -1 });
reportSchema.index({ status: 1 });
reportSchema.index({ isDeleted: 1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;
