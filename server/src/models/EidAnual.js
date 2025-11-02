import mongoose from 'mongoose';

const eidAnualSchema = new mongoose.Schema(
  {
    mahal_ID: {
      type: String,
      required: [true, 'Mahal ID is required'],
      trim: true,
      index: true,
      match: [/^\d+\/\d+$/, 'Mahal ID must be in format: number/number (e.g., 1/2)'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
      get: (v) => parseFloat(v).toFixed(2),
      set: (v) => parseFloat(v),
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['Eid ul Adha', 'Eid al-Fitr', 'Dua_Friday'],
        message: 'Invalid category',
      },
      index: true,
    },
    // Reference to member (optional)
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      index: true,
    },
    receiptNo: {
      type: String,
      trim: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque', 'Other'],
      default: 'Cash',
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    financialYear: {
      type: String,
      // Format: 2024-25
      index: true,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

// Indexes
eidAnualSchema.index({ date: -1 });
eidAnualSchema.index({ mahal_ID: 1, date: -1 });
eidAnualSchema.index({ category: 1, date: -1 });
eidAnualSchema.index({ financialYear: 1, category: 1 });
eidAnualSchema.index({ createdAt: -1 });

// Virtual for formatted amount
eidAnualSchema.virtual('formattedAmount').get(function () {
  return `₹${this.amount}`;
});

// Virtual for formatted date
eidAnualSchema.virtual('formattedDate').get(function () {
  return this.date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
});

// Pre-save hook to set financial year
eidAnualSchema.pre('save', function (next) {
  if (!this.financialYear) {
    const date = this.date || new Date();
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
eidAnualSchema.pre('save', async function (next) {
  if (!this.receiptNo && this.isNew) {
    try {
      const Counter = mongoose.model('Counter');
      const counter = await Counter.getNextSequence('eid_anual');
      const year = new Date().getFullYear();
      this.receiptNo = `EID-${year}-${counter.toString().padStart(6, '0')}`;
    } catch (error) {
      console.log('Counter model not available yet');
    }
  }
  next();
});

// Static method to find by Mahal ID
eidAnualSchema.statics.findByMahalId = function (mahalId, options = {}) {
  const query = { mahal_ID: mahalId, isActive: true };
  
  if (options.startDate || options.endDate) {
    query.date = {};
    if (options.startDate) query.date.$gte = options.startDate;
    if (options.endDate) query.date.$lte = options.endDate;
  }
  
  if (options.category) query.category = options.category;
  
  return this.find(query)
    .sort({ date: -1 })
    .populate('memberId', 'Fname Mid')
    .populate('collectedBy', 'username')
    .exec();
};

// Static method to get revenue by category
eidAnualSchema.statics.getRevenueByCategory = async function (options = {}) {
  const match = { isActive: true };
  
  if (options.startDate || options.endDate) {
    match.date = {};
    if (options.startDate) match.date.$gte = options.startDate;
    if (options.endDate) match.date.$lte = options.endDate;
  }
  
  if (options.financialYear) {
    match.financialYear = options.financialYear;
  }
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ]);
  
  return stats;
};

// Static method to get total revenue
eidAnualSchema.statics.getTotalRevenue = async function (options = {}) {
  const match = { isActive: true };
  
  if (options.startDate || options.endDate) {
    match.date = {};
    if (options.startDate) match.date.$gte = options.startDate;
    if (options.endDate) match.date.$lte = options.endDate;
  }
  
  if (options.category) match.category = options.category;
  if (options.financialYear) match.financialYear = options.financialYear;
  
  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalRecords: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
      },
    },
  ]);
  
  return result[0] || { totalRevenue: 0, totalRecords: 0, avgAmount: 0 };
};

const EidAnual = mongoose.model('EidAnual', eidAnualSchema);

export default EidAnual;
