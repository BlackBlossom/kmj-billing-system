/**
 * Voucher Model
 * Schema for logging voucher entries
 */

import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [0, 'Cost cannot be negative'],
  },
  service: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['Jama_Ath', 'Madrassa', 'Sadhu Sahayam', 'Nercha', 'Land Purchase', 'Others'],
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
voucherSchema.index({ createdAt: -1 });
voucherSchema.index({ service: 1 });
voucherSchema.index({ isDeleted: 1 });

const Voucher = mongoose.model('Voucher', voucherSchema);

export default Voucher;
