/**
 * Bill Controller
 * Handles all billing and receipt operations
 * 
 * PHP Compatibility:
 * - Bill.php (quick pay system)
 * - bill_two.php (alternative billing)
 * - Bill_Print.php (receipt printing)
 * - Bill_accounts_two.php (account management)
 */

import Bill from '../models/Bill.js';
import Member from '../models/Member.js';
import User from '../models/User.js';
import Counter from '../models/Counter.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Account Types (matching old PHP system)
 */
const ACCOUNT_TYPES = [
  'Dua_Friday',
  'Donation',
  'Sunnath Fee',
  'Marriage Fee',
  'Product Turnover',
  'Rental_Basis',
  'Devotional Dedication',
  'Dead Fee',
  'New Membership',
  'Certificate Fee',
  'Eid ul Adha',
  'Eid al-Fitr',
  'Madrassa',
  'Sadhu',
  'Land',
  'Nercha'
];

/**
 * Helper: Get next receipt number
 */
const getNextReceiptNumber = async () => {
  const counter = await Counter.findByIdAndUpdate(
    'bills',
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence;
};

/**
 * Helper: Convert number to words (Indian system)
 */
const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';

  const numStr = Math.floor(num).toString();
  const decimal = Math.round((num - Math.floor(num)) * 100);
  
  let words = '';
  
  // Crores
  if (numStr.length > 7) {
    const crores = parseInt(numStr.slice(0, -7));
    words += convertHundreds(crores) + ' Crore ';
  }
  
  // Lakhs
  if (numStr.length > 5) {
    const lakhs = parseInt(numStr.slice(-7, -5) || 0);
    if (lakhs > 0) words += convertHundreds(lakhs) + ' Lakh ';
  }
  
  // Thousands
  if (numStr.length > 3) {
    const thousands = parseInt(numStr.slice(-5, -3) || 0);
    if (thousands > 0) words += convertHundreds(thousands) + ' Thousand ';
  }
  
  // Hundreds, tens, ones
  const remainder = parseInt(numStr.slice(-3));
  if (remainder > 0) {
    words += convertHundreds(remainder);
  }
  
  words = words.trim() + ' Rupees';
  
  if (decimal > 0) {
    words += ' and ' + convertHundreds(decimal) + ' Paise';
  }
  
  return words + ' Only';

  function convertHundreds(n) {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n >= 10) {
      str += teens[n - 10] + ' ';
      return str;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str;
  }
};

/**
 * @desc    Create new bill/payment
 * @route   POST /api/v1/bills
 * @access  Private (Admin or User for own bills)
 * 
 * Matches: PHP Bill.php (quick pay system)
 */
export const createBill = async (req, res, next) => {
  try {
    const {
      mahalId,
      amount,
      accountType,
      paymentMethod = 'Cash',
      notes = ''
    } = req.body;

    // Validate account type
    if (!ACCOUNT_TYPES.includes(accountType)) {
      return next(new AppError('Invalid account type', 400));
    }

    // Authorization: User can only create bills for their own family
    if (req.user.role !== 'admin' && mahalId !== req.user.memberId) {
      return next(new AppError('Not authorized to create bill for this member', 403));
    }

    // Get member details
    const member = await Member.findOne({ Mid: mahalId });
    if (!member) {
      return next(new AppError('Member not found', 404));
    }

    // Get user details
    const user = await User.findOne({ memberId: mahalId });
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Generate receipt number
    const receiptNo = await getNextReceiptNumber();

    // Create member address string (matches PHP format)
    const memberAddress = `${member.Fname}\n${member.Address || user.address}\nMahal ID: ${mahalId}\nPhone: ${member.Mobile || user.phone}`;

    // Create bill
    const bill = await Bill.create({
      receiptNo,
      mahalId,
      memberName: member.Fname,
      memberAddress,
      amount: parseFloat(amount),
      amountInWords: numberToWords(parseFloat(amount)),
      accountType,
      paymentMethod,
      notes,
      createdBy: req.user.memberId,
      createdByName: req.user.name
    });

    res.status(201).json({
      success: true,
      message: 'Amount Credited Successfully',
      data: bill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bills (paginated, filtered)
 * @route   GET /api/v1/bills
 * @access  Private (Admin sees all, User sees own)
 */
export const getAllBills = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      mahalId = '',
      accountType = '',
      startDate = '',
      endDate = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};

    // If user (not admin), only show their bills
    if (req.user.role !== 'admin') {
      filter.mahalId = req.user.memberId;
    }

    // Mahal ID filter
    if (mahalId) {
      filter.mahalId = mahalId;
    }

    // Account type filter
    if (accountType) {
      filter.accountType = accountType;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [bills, totalCount] = await Promise.all([
      Bill.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Bill.countDocuments(filter)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        bills,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBills: totalCount,
          billsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single bill by ID
 * @route   GET /api/v1/bills/:id
 * @access  Private (Admin or own bill)
 */
export const getBillById = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return next(new AppError('Bill not found', 404));
    }

    // Authorization: User can only view own bills
    if (req.user.role !== 'admin' && bill.mahalId !== req.user.memberId) {
      return next(new AppError('Not authorized to view this bill', 403));
    }

    res.status(200).json({
      success: true,
      data: bill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get bill by receipt number
 * @route   GET /api/v1/bills/receipt/:receiptNo
 * @access  Private
 * 
 * Matches: PHP functionality to search by receipt number
 */
export const getBillByReceiptNo = async (req, res, next) => {
  try {
    const bill = await Bill.findOne({ receiptNo: parseInt(req.params.receiptNo) });

    if (!bill) {
      return next(new AppError('Bill not found', 404));
    }

    // Authorization: User can only view own bills
    if (req.user.role !== 'admin' && bill.mahalId !== req.user.memberId) {
      return next(new AppError('Not authorized to view this bill', 403));
    }

    res.status(200).json({
      success: true,
      data: bill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get member's billing history
 * @route   GET /api/v1/bills/member/:mahalId
 * @access  Private (Admin or own bills)
 * 
 * Matches: PHP Bill_Print_5View.php (last 5 bills)
 */
export const getMemberBills = async (req, res, next) => {
  try {
    const { mahalId } = req.params;
    const { limit = 5, page = 1 } = req.query;

    // Authorization: User can only view own bills
    if (req.user.role !== 'admin' && mahalId !== req.user.memberId) {
      return next(new AppError('Not authorized to view these bills', 403));
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get recent bills for this member
    const [bills, totalCount] = await Promise.all([
      Bill.find({ mahalId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Bill.countDocuments({ mahalId })
    ]);

    // Calculate total amount paid
    const totalPaid = await Bill.aggregate([
      { $match: { mahalId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        bills,
        totalBills: totalCount,
        totalAmountPaid: totalPaid.length > 0 ? totalPaid[0].total : 0,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          billsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update bill (admin only, limited fields)
 * @route   PUT /api/v1/bills/:id
 * @access  Private (Admin only)
 */
export const updateBill = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return next(new AppError('Bill not found', 404));
    }

    // Only allow updating notes and payment method (preserve audit trail)
    const { notes, paymentMethod } = req.body;

    if (notes !== undefined) bill.notes = notes;
    if (paymentMethod) bill.paymentMethod = paymentMethod;

    await bill.save();

    res.status(200).json({
      success: true,
      message: 'Bill updated successfully',
      data: bill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete bill (admin only, soft delete)
 * @route   DELETE /api/v1/bills/:id
 * @access  Private (Admin only)
 */
export const deleteBill = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return next(new AppError('Bill not found', 404));
    }

    // Soft delete (preserve financial records)
    bill.isActive = false;
    bill.deletedBy = req.user.memberId;
    bill.deletedAt = new Date();
    await bill.save();

    res.status(200).json({
      success: true,
      message: 'Bill deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get billing statistics
 * @route   GET /api/v1/bills/stats
 * @access  Private (Admin only)
 * 
 * Provides analytics for admin dashboard
 */
export const getBillStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Total bills and revenue
    const totalStats = await Bill.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      {
        $group: {
          _id: null,
          totalBills: { $sum: 1 },
          totalRevenue: { $sum: '$amount' },
          avgBillAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Revenue by account type
    const revenueByAccount = await Bill.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      {
        $group: {
          _id: '$accountType',
          count: { $sum: 1 },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Revenue by month (last 12 months)
    const monthlyRevenue = await Bill.aggregate([
      {
        $match: {
          isActive: true,
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top paying members
    const topMembers = await Bill.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      {
        $group: {
          _id: '$mahalId',
          memberName: { $first: '$memberName' },
          totalPaid: { $sum: '$amount' },
          billCount: { $sum: 1 }
        }
      },
      { $sort: { totalPaid: -1 } },
      { $limit: 10 }
    ]);

    // Recent bills (last 10)
    const recentBills = await Bill.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('receiptNo mahalId memberName amount accountType createdAt')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        overview: totalStats[0] || { totalBills: 0, totalRevenue: 0, avgBillAmount: 0 },
        revenueByAccount,
        monthlyRevenue,
        topMembers,
        recentBills
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate receipt data (for PDF generation)
 * @route   GET /api/v1/bills/:id/receipt
 * @access  Private (Admin or own bill)
 * 
 * Matches: PHP Bill_Print.php format
 */
export const getReceiptData = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return next(new AppError('Bill not found', 404));
    }

    // Authorization: User can only view own bills
    if (req.user.role !== 'admin' && bill.mahalId !== req.user.memberId) {
      return next(new AppError('Not authorized to view this receipt', 403));
    }

    // Format receipt data (matching PHP Bill_Print.php)
    const receiptData = {
      organizationName: 'Kalloor Muslim JamaAth',
      organizationAddress: 'Kalloor, Kerala',
      receiptNo: bill.receiptNo,
      date: bill.createdAt.toLocaleDateString('en-IN'),
      time: bill.createdAt.toLocaleTimeString('en-IN'),
      mahalId: bill.mahalId,
      memberName: bill.memberName,
      memberAddress: bill.memberAddress,
      amount: bill.amount,
      amountInWords: bill.amountInWords,
      accountType: bill.accountType,
      paymentMethod: bill.paymentMethod,
      notes: bill.notes,
      createdBy: bill.createdByName
    };

    res.status(200).json({
      success: true,
      data: receiptData
    });
  } catch (error) {
    next(error);
  }
};

