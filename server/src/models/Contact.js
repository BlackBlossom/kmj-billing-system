/**
 * Contact Model
 * Schema for managing contact information with warranty files
 */

import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Remove spaces, +, -, ( ) and check if remaining digits are between 10-15
        const digits = v.replace(/[\s\+\-\(\)]/g, '');
        return /^\d{10,15}$/.test(digits);
      },
      message: 'Phone number must contain 10-15 digits'
    }
  },
  warrantyFiles: [{
    type: String, // Just store the URL
  }],
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

// Indexes for better query performance
contactSchema.index({ createdAt: -1 });
contactSchema.index({ name: 1 });
contactSchema.index({ phoneNumber: 1 });
contactSchema.index({ isDeleted: 1 });

// Text search index
contactSchema.index({ 
  name: 'text', 
  title: 'text', 
  phoneNumber: 'text'
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
