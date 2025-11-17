/**
 * Inventory Model
 * Schema for tracking inventory items (Engineering Department)
 */

import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    default: 'Engineering',
    enum: ['Engineering', 'Electrical', 'Plumbing', 'Others'],
  },
  count: {
    type: Number,
    required: [true, 'Count is required'],
    min: [0, 'Count cannot be negative'],
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required'],
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  attachmentUrl: {
    type: String,
    default: null,
  },
  warrantyUrl: {
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
inventorySchema.index({ createdAt: -1 });
inventorySchema.index({ department: 1 });
inventorySchema.index({ isDeleted: 1 });

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
