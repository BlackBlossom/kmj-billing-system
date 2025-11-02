import mongoose from 'mongoose';
import { BILL_TYPES, PAYMENT_METHODS, BILL_STATUS } from '../utils/constants.js';

const billSchema = new mongoose.Schema(
  {
    receiptNo: {
      type: String,
      trim: true,
      // Will be auto-generated: BILL-2024-0001, BILL-2024-0002, etc.
    },
    Date_time: {
      type: Date,
      required: [true, 'Bill date is required'],
      default: Date.now,
    },
    mahal_ID: {
      type: String,
      required: [true, 'Mahal ID is required'],
      trim: true,
      match: [/^\d+\/\d+$/, 'Mahal ID must be in format: number/number (e.g., 1/2)'],
    },
    id_name_address: {
      type: String,
      required: [true, 'Name and address is required'],
      trim: true,
      maxlength: [500, 'Name and address cannot exceed 500 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
      get: (v) => parseFloat(v).toFixed(2),
      set: (v) => parseFloat(v),
    },
    type: {
      type: String,
      required: [true, 'Bill type is required'],
      enum: {
        values: Object.values(BILL_TYPES),
        message: 'Invalid bill type',
      },
    },
    paymentMethod: {
      type: String,
      enum: {
        values: Object.values(PAYMENT_METHODS),
        message: 'Invalid payment method',
      },
      default: PAYMENT_METHODS.CASH,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(BILL_STATUS),
        message: 'Invalid bill status',
      },
      default: BILL_STATUS.PAID,
    },
    // Reference to member (optional, for better data integrity)
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
    },
    financialYear: {
      type: String,
      // Format: 2024-25, 2023-24
    },
    // Additional fields
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    receipt: {
      url: String,
      publicId: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    voidedAt: Date,
    voidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    voidReason: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

// Indexes
// Indexes (consolidated without duplicates)
billSchema.index({ receiptNo: 1 }, { unique: true, sparse: true });
billSchema.index({ Date_time: -1 });
billSchema.index({ mahal_ID: 1, Date_time: -1 });
billSchema.index({ type: 1, Date_time: -1 });
billSchema.index({ financialYear: 1, type: 1 });
billSchema.index({ memberId: 1 });
billSchema.index({ status: 1 });
billSchema.index({ createdAt: -1 });

// Virtual for formatted amount
billSchema.virtual('formattedAmount').get(function () {
  return `₹${this.amount}`;
});

// Virtual for formatted date
billSchema.virtual('formattedDate').get(function () {
  return this.Date_time.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Virtual to check if voided
billSchema.virtual('isVoided').get(function () {
  return this.status === BILL_STATUS.VOIDED;
});

// Pre-save hook to set financial year
billSchema.pre('save', function (next) {
  if (!this.financialYear) {
    const date = this.Date_time || new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Financial year starts in April (month 3)
    if (month < 3) {
      this.financialYear = `${year - 1}-${year.toString().slice(-2)}`;
    } else {
      this.financialYear = `${year}-${(year + 1).toString().slice(-2)}`;
    }
  }
  next();
});

// Pre-save hook to generate receipt number if not provided
billSchema.pre('save', async function (next) {
  if (!this.receiptNo && this.isNew) {
    try {
      const Counter = mongoose.model('Counter');
      const counter = await Counter.getNextSequence('bill');
      const year = new Date().getFullYear();
      this.receiptNo = `BILL-${year}-${counter.toString().padStart(6, '0')}`;
    } catch (error) {
      // If counter model doesn't exist yet, skip
      console.log('Counter model not available yet');
    }
  }
  next();
});

// Static method to get bills by Mahal ID
billSchema.statics.findByMahalId = function (mahalId, options = {}) {
  const query = { mahal_ID: mahalId, isActive: true };
  
  if (options.startDate || options.endDate) {
    query.Date_time = {};
    if (options.startDate) query.Date_time.$gte = options.startDate;
    if (options.endDate) query.Date_time.$lte = options.endDate;
  }
  
  if (options.type) query.type = options.type;
  if (options.status) query.status = options.status;
  
  return this.find(query)
    .sort({ Date_time: -1 })
    .populate('memberId', 'Fname Mid')
    .populate('collectedBy', 'username')
    .exec();
};

// Static method to get bills by type
billSchema.statics.findByType = function (type, options = {}) {
  const query = { type, isActive: true };
  
  if (options.startDate || options.endDate) {
    query.Date_time = {};
    if (options.startDate) query.Date_time.$gte = options.startDate;
    if (options.endDate) query.Date_time.$lte = options.endDate;
  }
  
  return this.find(query)
    .sort({ Date_time: -1 })
    .populate('memberId', 'Fname Mid')
    .populate('collectedBy', 'username')
    .exec();
};

// Static method to get revenue statistics
billSchema.statics.getRevenueStats = async function (options = {}) {
  const match = { isActive: true, status: BILL_STATUS.PAID };
  
  if (options.startDate || options.endDate) {
    match.Date_time = {};
    if (options.startDate) match.Date_time.$gte = options.startDate;
    if (options.endDate) match.Date_time.$lte = options.endDate;
  }
  
  if (options.financialYear) {
    match.financialYear = options.financialYear;
  }
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ]);
  
  const overall = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalBills: { $sum: 1 },
        avgBillAmount: { $avg: '$amount' },
      },
    },
  ]);
  
  return {
    byType: stats,
    overall: overall[0] || { totalRevenue: 0, totalBills: 0, avgBillAmount: 0 },
  };
};

// Static method to get monthly revenue
billSchema.statics.getMonthlyRevenue = async function (year) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);
  
  const stats = await this.aggregate([
    {
      $match: {
        Date_time: { $gte: startDate, $lte: endDate },
        isActive: true,
        status: BILL_STATUS.PAID,
      },
    },
    {
      $group: {
        _id: { $month: '$Date_time' },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  
  // Fill in missing months with zero
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    revenue: 0,
    count: 0,
  }));
  
  stats.forEach((stat) => {
    monthlyData[stat._id - 1] = {
      month: stat._id,
      revenue: stat.revenue,
      count: stat.count,
    };
  });
  
  return monthlyData;
};

// Instance method to void bill
billSchema.methods.voidBill = function (userId, reason) {
  this.status = BILL_STATUS.VOIDED;
  this.voidedAt = new Date();
  this.voidedBy = userId;
  this.voidReason = reason;
  return this.save();
};

const Bill = mongoose.model('Bill', billSchema);

export default Bill;
