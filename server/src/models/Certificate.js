/**
 * Certificate Model
 * Schema for generating certificates (Marriage, Death, Transfer)
 */

import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Certificate type is required'],
    enum: ['Marriage', 'Death', 'Transfer'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  certificateNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
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

// Generate certificate number before saving
certificateSchema.pre('save', async function(next) {
  if (!this.certificateNumber && this.isNew) {
    const year = new Date().getFullYear();
    const prefix = this.type.substring(0, 3).toUpperCase();
    const count = await mongoose.model('Certificate').countDocuments({ type: this.type });
    this.certificateNumber = `${prefix}/${year}/${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Index for better query performance
certificateSchema.index({ createdAt: -1 });
certificateSchema.index({ type: 1 });
certificateSchema.index({ certificateNumber: 1 });
certificateSchema.index({ isDeleted: 1 });

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
