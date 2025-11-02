import mongoose from 'mongoose';
import {
  GENDER,
  MARITAL_STATUS,
  RELATIONS,
  AREA_TYPES,
  RATION_CARD_TYPES,
} from '../utils/constants.js';

const memberSchema = new mongoose.Schema(
  {
    Mid: {
      type: String,
      required: false, // Made optional for lenient migration
      trim: true,
      default: '', // Default empty for legacy data
      // Lenient format for migration - accept various formats
      // Format: 1/2, 3/84, TEMP/NAME, etc.
    },
    Fname: {
      type: String,
      required: false, // Made optional for lenient migration
      trim: true,
      default: '', // Default empty for legacy data
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    Dob: {
      type: Date,
      required: false,
      default: () => new Date('1970-01-01'), // Default for legacy data without DOB
    },
    Gender: {
      type: String,
      required: false, // Made optional for lenient migration
      trim: true,
      default: 'Male',
    },
    Relation: {
      type: String,
      trim: true,
      default: '', // Allow empty for legacy data
    },
    Mstatus: {
      type: String,
      trim: true,
      default: '', // Allow empty for legacy data
    },
    Occupation: {
      type: String,
      trim: true,
      maxlength: [100, 'Occupation cannot exceed 100 characters'],
    },
    RC: {
      type: String,
      trim: true,
      // Accept any ration card value for migration compatibility
    },
    Education: {
      type: String,
      trim: true,
      maxlength: [100, 'Education cannot exceed 100 characters'],
    },
    Madrassa: {
      type: String,
      trim: true,
      maxlength: [50, 'Madrassa class cannot exceed 50 characters'],
    },
    Aadhaar: {
      type: String,
      trim: true,
      // NO validation for migration - accept ANY format
    },
    Mobile: {
      type: String,
      trim: true,
      // NO validation for migration - accept ANY format
    },
    Email: {
      type: String,
      trim: true,
      lowercase: true,
      // NO validation for migration - accept ANY format
    },
    Health: {
      type: String,
      trim: true,
      maxlength: [200, 'Health info cannot exceed 200 characters'],
      default: '---',
    },
    Myear: {
      type: String,
      trim: true,
      // NO validation for migration - accept ANY format (including "Before 1991")
    },
    // Address Information
    Pward: {
      type: String,
      trim: true,
      maxlength: [100, 'Ward name cannot exceed 100 characters'],
    },
    Phouse: {
      type: String,
      trim: true,
      maxlength: [50, 'House number cannot exceed 50 characters'],
    },
    District: {
      type: String,
      trim: true,
      maxlength: [100, 'District name cannot exceed 100 characters'],
    },
    Area: {
      type: String,
      trim: true,
      default: 'Panchayath',
    },
    Land: {
      type: String,
      enum: ['Yes', 'No', ''],
      default: '',
    },
    House: {
      type: String,
      enum: ['Yes', 'No', ''],
      default: '',
    },
    Resident: {
      type: String,
      trim: true,
      maxlength: [50, 'Resident type cannot exceed 50 characters'],
      // Own, Rent, etc.
    },
    Address: {
      type: String,
      required: false, // Not required during migration
      trim: true,
      default: '',
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
    Mward: {
      type: String,
      required: false, // Not required during migration
      trim: true,
      default: '',
      maxlength: [100, 'Mosque ward cannot exceed 100 characters'],
    },
    // Additional fields for system use
    profileImage: {
      url: String,
      publicId: String,
    },
    documents: [
      {
        type: {
          type: String,
          enum: ['aadhaar', 'ration_card', 'other'],
        },
        url: String,
        publicId: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
memberSchema.index({ Mid: 1 });
memberSchema.index({ Fname: 'text', Address: 'text' }); // Text search
memberSchema.index({ Mward: 1, Mid: 1 });
memberSchema.index({ Aadhaar: 1 }, { sparse: true });
memberSchema.index({ Mobile: 1 }, { sparse: true });
memberSchema.index({ isActive: 1 });
memberSchema.index({ createdAt: -1 });

// Virtual for age calculation
memberSchema.virtual('age').get(function () {
  if (!this.Dob) return null;
  const today = new Date();
  const birthDate = new Date(this.Dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for formatted DOB
memberSchema.virtual('formattedDob').get(function () {
  if (!this.Dob) return null;
  return this.Dob.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
});

// Virtual to check if member is head of household
memberSchema.virtual('isHouseHead').get(function () {
  return this.Relation === RELATIONS.HEAD;
});

// Pre-save hook to normalize data
memberSchema.pre('save', function (next) {
  // Normalize Aadhaar (convert '00' to empty string)
  if (this.Aadhaar && /^0+$/.test(this.Aadhaar)) {
    this.Aadhaar = '';
  }

  // Normalize empty strings
  if (this.Mobile === '') this.Mobile = undefined;
  if (this.Email === '') this.Email = undefined;
  if (this.Health === '') this.Health = '---';

  next();
});

// Static method to find by Mahal ID
memberSchema.statics.findByMahalId = function (mahalId) {
  return this.find({ Mid: mahalId, isActive: true }).sort({ Relation: 1 });
};

// Static method to find household members
memberSchema.statics.findHousehold = function (mahalId) {
  return this.find({ Mid: mahalId, isActive: true })
    .sort({ Relation: 1, Dob: 1 })
    .exec();
};

// Static method to find by ward
memberSchema.statics.findByWard = function (ward) {
  return this.find({ Mward: ward, isActive: true })
    .sort({ Mid: 1, Relation: 1 })
    .exec();
};

// Static method to get statistics
memberSchema.statics.getStatistics = async function () {
  const stats = await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalMembers: { $sum: 1 },
        totalHouseholds: { $addToSet: '$Mid' },
        maleCount: {
          $sum: { $cond: [{ $eq: ['$Gender', GENDER.MALE] }, 1, 0] },
        },
        femaleCount: {
          $sum: { $cond: [{ $eq: ['$Gender', GENDER.FEMALE] }, 1, 0] },
        },
        marriedCount: {
          $sum: { $cond: [{ $eq: ['$Mstatus', MARITAL_STATUS.MARRIED] }, 1, 0] },
        },
        singleCount: {
          $sum: { $cond: [{ $eq: ['$Mstatus', MARITAL_STATUS.SINGLE] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalMembers: 1,
        totalHouseholds: { $size: '$totalHouseholds' },
        maleCount: 1,
        femaleCount: 1,
        marriedCount: 1,
        singleCount: 1,
      },
    },
  ]);

  return stats[0] || {
    totalMembers: 0,
    totalHouseholds: 0,
    maleCount: 0,
    femaleCount: 0,
    marriedCount: 0,
    singleCount: 0,
  };
};

// Instance method to get family members
memberSchema.methods.getFamilyMembers = function () {
  return this.constructor.findByMahalId(this.Mid);
};

const Member = mongoose.model('Member', memberSchema);

export default Member;
