import mongoose from 'mongoose';
import {
  ACCOUNT_CATEGORIES_LAND,
  ACCOUNT_CATEGORIES_MADRASSA,
  ACCOUNT_CATEGORIES_NERCHA,
  ACCOUNT_CATEGORIES_SADHU,
} from '../utils/constants.js';

// Base schema for all account types
const accountBaseSchema = new mongoose.Schema(
  {
    Mahal_Id: {
      type: String,
      required: [true, 'Mahal ID is required'],
      trim: true,
      index: true,
      match: [/^\d+\/\d+$/, 'Mahal ID must be in format: number/number (e.g., 1/2)'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
      get: (v) => parseFloat(v).toFixed(2),
      set: (v) => parseFloat(v),
    },
    Date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    // Account type discriminator
    accountType: {
      type: String,
      required: true,
      enum: ['land', 'madrassa', 'nercha', 'sadhu'],
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
    discriminatorKey: 'accountType',
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

// Indexes
accountBaseSchema.index({ Date: -1 });
accountBaseSchema.index({ Mahal_Id: 1, Date: -1 });
accountBaseSchema.index({ accountType: 1, category: 1, Date: -1 });
accountBaseSchema.index({ financialYear: 1, accountType: 1 });
accountBaseSchema.index({ createdAt: -1 });

// Virtual for formatted amount
accountBaseSchema.virtual('formattedAmount').get(function () {
  return `₹${this.amount}`;
});

// Virtual for formatted date
accountBaseSchema.virtual('formattedDate').get(function () {
  return this.Date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
});

// Pre-save hook to set financial year
accountBaseSchema.pre('save', function (next) {
  if (!this.financialYear) {
    const date = this.Date || new Date();
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
accountBaseSchema.pre('save', async function (next) {
  if (!this.receiptNo && this.isNew) {
    try {
      const Counter = mongoose.model('Counter');
      const sequenceName = `account_${this.accountType}`;
      const counter = await Counter.getNextSequence(sequenceName);
      const year = new Date().getFullYear();
      const typeCode = this.accountType.toUpperCase().substring(0, 3);
      this.receiptNo = `${typeCode}-${year}-${counter.toString().padStart(6, '0')}`;
    } catch (error) {
      console.log('Counter model not available yet');
    }
  }
  next();
});

// Static method to get by Mahal ID
accountBaseSchema.statics.findByMahalId = function (mahalId, options = {}) {
  const query = { Mahal_Id: mahalId, isActive: true };
  
  if (options.startDate || options.endDate) {
    query.Date = {};
    if (options.startDate) query.Date.$gte = options.startDate;
    if (options.endDate) query.Date.$lte = options.endDate;
  }
  
  if (options.category) query.category = options.category;
  
  return this.find(query)
    .sort({ Date: -1 })
    .populate('memberId', 'Fname Mid')
    .populate('collectedBy', 'username')
    .exec();
};

// Static method to get revenue by category
accountBaseSchema.statics.getRevenueByCategory = async function (options = {}) {
  const match = { isActive: true };
  
  if (options.startDate || options.endDate) {
    match.Date = {};
    if (options.startDate) match.Date.$gte = options.startDate;
    if (options.endDate) match.Date.$lte = options.endDate;
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

// Base Account model
const Account = mongoose.model('Account', accountBaseSchema);

// Land Account Discriminator
const AccountLand = Account.discriminator(
  'land',
  new mongoose.Schema({
    category: {
      type: String,
      required: true,
      enum: {
        values: Object.values(ACCOUNT_CATEGORIES_LAND),
        message: 'Invalid land account category',
      },
    },
  })
);

// Madrassa Account Discriminator
const AccountMadrassa = Account.discriminator(
  'madrassa',
  new mongoose.Schema({
    category: {
      type: String,
      required: true,
      enum: {
        values: Object.values(ACCOUNT_CATEGORIES_MADRASSA),
        message: 'Invalid madrassa account category',
      },
    },
    studentName: {
      type: String,
      trim: true,
      maxlength: [100, 'Student name cannot exceed 100 characters'],
    },
    class: {
      type: String,
      trim: true,
      maxlength: [50, 'Class cannot exceed 50 characters'],
    },
  })
);

// Nercha Account Discriminator
const AccountNercha = Account.discriminator(
  'nercha',
  new mongoose.Schema({
    category: {
      type: String,
      required: true,
      enum: {
        values: Object.values(ACCOUNT_CATEGORIES_NERCHA),
        message: 'Invalid nercha account category',
      },
    },
    occasion: {
      type: String,
      trim: true,
      maxlength: [200, 'Occasion cannot exceed 200 characters'],
    },
  })
);

// Sadhu Account Discriminator
const AccountSadhu = Account.discriminator(
  'sadhu',
  new mongoose.Schema({
    category: {
      type: String,
      required: true,
      enum: {
        values: Object.values(ACCOUNT_CATEGORIES_SADHU),
        message: 'Invalid sadhu account category',
      },
    },
    purpose: {
      type: String,
      trim: true,
      maxlength: [200, 'Purpose cannot exceed 200 characters'],
    },
  })
);

export { Account, AccountLand, AccountMadrassa, AccountNercha, AccountSadhu };
export default Account;
