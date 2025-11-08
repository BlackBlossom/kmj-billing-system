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
import Account from '../models/Account.js';
import EidAnual from '../models/EidAnual.js';
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
      paymentMethod = '',
      startDate = '',
      endDate = '',
      minAmount = '',
      maxAmount = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filters for each collection
    const buildFilters = (dateField, mahalIdField) => {
      const filter = {};

      // Mahal ID filter
      if (mahalId) {
        filter[mahalIdField] = mahalId;
      }

      // Payment method filter
      if (paymentMethod) {
        filter.paymentMethod = paymentMethod;
      }

      // Date range filter
      if (startDate || endDate) {
        filter[dateField] = {};
        if (startDate) filter[dateField].$gte = new Date(startDate);
        if (endDate) filter[dateField].$lte = new Date(endDate);
      }

      // Amount range filter
      if (minAmount || maxAmount) {
        filter.amount = {};
        if (minAmount) filter.amount.$gte = parseFloat(minAmount);
        if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
      }

      return filter;
    };

    // Fetch from all three collections
    const [billRecords, accountRecords, eidAnualRecords] = await Promise.all([
      // Bills collection
      Bill.find(buildFilters('createdAt', 'mahalId'))
        .populate('memberId', 'Fname Mid')
        .lean(),
      
      // Accounts collection (land, madrassa, nercha, sadhu)
      Account.find(buildFilters('Date', 'Mahal_Id'))
        .populate('memberId', 'Fname Mid')
        .lean(),
      
      // EidAnual collection
      EidAnual.find(buildFilters('date', 'mahal_ID'))
        .populate('memberId', 'Fname Mid')
        .lean()
    ]);

    console.log('Fetched records:', {
      bills: billRecords.length,
      accounts: accountRecords.length,
      eidAnual: eidAnualRecords.length
    });

    // Normalize all records to a common format
    const normalizeBill = (record, source) => ({
      _id: record._id,
      receiptNo: record.receiptNo || 'N/A',
      amount: record.amount,
      paymentMethod: record.paymentMethod || 'Cash',
      notes: record.notes,
      memberId: record.memberId,
      collectedBy: record.collectedBy,
      isActive: record.isActive,
      // Normalize date field
      createdAt: record.createdAt || record.date || record.Date,
      updatedAt: record.updatedAt,
      // Normalize Mahal ID field
      mahalId: record.mahalId || record.Mahal_Id || record.mahal_ID,
      // Normalize type/category field
      accountType: record.accountType || record.category,
      category: record.category,
      // Additional fields
      address: record.address,
      financialYear: record.financialYear,
      // Source collection for reference
      _source: source,
      // Account-specific fields
      ...(source === 'account' && {
        studentName: record.studentName,
        class: record.class,
        occasion: record.occasion,
        purpose: record.purpose
      })
    });

    // Combine all records
    const allBills = [
      ...billRecords.map(b => normalizeBill(b, 'bill')),
      ...accountRecords.map(a => normalizeBill(a, 'account')),
      ...eidAnualRecords.map(e => normalizeBill(e, 'eidanual'))
    ];

    // Filter by account type if specified
    const filteredBills = accountType 
      ? allBills.filter(b => 
          b.accountType?.toLowerCase() === accountType.toLowerCase() || 
          b.category?.toLowerCase() === accountType.toLowerCase()
        )
      : allBills;

    // Sort bills
    filteredBills.sort((a, b) => {
      const aVal = a[sortBy] || a.createdAt;
      const bVal = b[sortBy] || b.createdAt;
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Calculate pagination
    const totalCount = filteredBills.length;
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedBills = filteredBills.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        bills: paginatedBills,
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
    console.error('Error in getAllBills:', error);
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
    const { startDate, endDate, accountType } = req.query;

    // Build date filter
    const buildDateFilter = (dateField) => {
      const filter = {};
      if (startDate || endDate) {
        filter[dateField] = {};
        if (startDate) filter[dateField].$gte = new Date(startDate);
        if (endDate) filter[dateField].$lte = new Date(endDate);
      }
      return filter;
    };

    // Fetch stats from all three collections
    const [billStats, accountStats, eidAnualStats] = await Promise.all([
      Bill.aggregate([
        { $match: buildDateFilter('createdAt') },
        {
          $group: {
            _id: null,
            totalBills: { $sum: 1 },
            totalRevenue: { $sum: '$amount' },
            avgBillAmount: { $avg: '$amount' }
          }
        }
      ]),
      Account.aggregate([
        { $match: buildDateFilter('Date') },
        {
          $group: {
            _id: null,
            totalBills: { $sum: 1 },
            totalRevenue: { $sum: '$amount' },
            avgBillAmount: { $avg: '$amount' }
          }
        }
      ]),
      EidAnual.aggregate([
        { $match: buildDateFilter('date') },
        {
          $group: {
            _id: null,
            totalBills: { $sum: 1 },
            totalRevenue: { $sum: '$amount' },
            avgBillAmount: { $avg: '$amount' }
          }
        }
      ])
    ]);

    console.log('Stats from collections:', {
      billStats,
      accountStats,
      eidAnualStats
    });

    // Combine stats
    const combinedStats = {
      totalBills: 
        (billStats[0]?.totalBills || 0) + 
        (accountStats[0]?.totalBills || 0) + 
        (eidAnualStats[0]?.totalBills || 0),
      totalRevenue: 
        (billStats[0]?.totalRevenue || 0) + 
        (accountStats[0]?.totalRevenue || 0) + 
        (eidAnualStats[0]?.totalRevenue || 0),
      avgBillAmount: 
        ((billStats[0]?.avgBillAmount || 0) + 
         (accountStats[0]?.avgBillAmount || 0) + 
         (eidAnualStats[0]?.avgBillAmount || 0)) / 3
    };

    // Get revenue by account type from all collections
    const [billsByType, accountsByType, eidAnualByType] = await Promise.all([
      Bill.aggregate([
        { $match: buildDateFilter('createdAt') },
        {
          $group: {
            _id: '$accountType',
            count: { $sum: 1 },
            revenue: { $sum: '$amount' }
          }
        }
      ]),
      Account.aggregate([
        { $match: buildDateFilter('Date') },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            revenue: { $sum: '$amount' }
          }
        }
      ]),
      EidAnual.aggregate([
        { $match: buildDateFilter('date') },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            revenue: { $sum: '$amount' }
          }
        }
      ])
    ]);

    // Combine and merge revenue by type
    const revenueByAccountMap = new Map();
    
    [...billsByType, ...accountsByType, ...eidAnualByType].forEach(item => {
      if (item._id) {
        const existing = revenueByAccountMap.get(item._id) || { _id: item._id, count: 0, revenue: 0 };
        existing.count += item.count;
        existing.revenue += item.revenue;
        revenueByAccountMap.set(item._id, existing);
      }
    });

    const revenueByAccount = Array.from(revenueByAccountMap.values())
      .sort((a, b) => b.revenue - a.revenue);

    // Calculate today's and this month's collection
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [todayBills, todayAccounts, todayEidAnual] = await Promise.all([
      Bill.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, amount: { $sum: '$amount' } } }
      ]),
      Account.aggregate([
        { $match: { Date: { $gte: today } } },
        { $group: { _id: null, amount: { $sum: '$amount' } } }
      ]),
      EidAnual.aggregate([
        { $match: { date: { $gte: today } } },
        { $group: { _id: null, amount: { $sum: '$amount' } } }
      ])
    ]);

    const [monthBills, monthAccounts, monthEidAnual] = await Promise.all([
      Bill.aggregate([
        { $match: { createdAt: { $gte: firstDayOfMonth } } },
        { $group: { _id: null, amount: { $sum: '$amount' } } }
      ]),
      Account.aggregate([
        { $match: { Date: { $gte: firstDayOfMonth } } },
        { $group: { _id: null, amount: { $sum: '$amount' } } }
      ]),
      EidAnual.aggregate([
        { $match: { date: { $gte: firstDayOfMonth } } },
        { $group: { _id: null, amount: { $sum: '$amount' } } }
      ])
    ]);

    const todayAmount = 
      (todayBills[0]?.amount || 0) + 
      (todayAccounts[0]?.amount || 0) + 
      (todayEidAnual[0]?.amount || 0);

    const monthAmount = 
      (monthBills[0]?.amount || 0) + 
      (monthAccounts[0]?.amount || 0) + 
      (monthEidAnual[0]?.amount || 0);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          ...combinedStats,
          todayAmount,
          monthAmount
        },
        revenueByAccount
      }
    });
  } catch (error) {
    console.error('Error in getBillStats:', error);
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
    const billId = req.params.id;
    
    // Try to find in all three collections
    const [bill, account, eidAnual] = await Promise.all([
      Bill.findById(billId).populate('memberId', 'Fname Mid Address').lean(),
      Account.findById(billId).populate('memberId', 'Fname Mid Address').lean(),
      EidAnual.findById(billId).populate('memberId', 'Fname Mid Address').lean()
    ]);

    const record = bill || account || eidAnual;

    if (!record) {
      return next(new AppError('Bill/Receipt not found', 404));
    }

    // Normalize the data from different collections
    const mahalId = record.mahalId || record.Mahal_Id || record.mahal_ID;
    const memberName = record.memberId?.Fname || record.memberName || 'N/A';
    const memberAddress = record.memberId?.Address || record.address || 'N/A';
    const recordDate = record.createdAt || record.date || record.Date;
    const accountType = record.accountType || record.category;

    // Authorization: User can only view own bills
    if (req.user.role !== 'admin' && mahalId !== req.user.memberId) {
      return next(new AppError('Not authorized to view this receipt', 403));
    }

    // Convert amount to words (Indian numbering)
    const convertToWords = (num) => {
      const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      
      if ((num = num.toString()).length > 9) return 'Amount too large';
      const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return '';
      
      let str = '';
      str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Crore ' : '';
      str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Lakh ' : '';
      str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Thousand ' : '';
      str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' Hundred ' : '';
      str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' Only' : '';
      
      return str.trim();
    };

    const amountInWords = convertToWords(Math.floor(record.amount));

    // Format receipt data (matching PHP Bill_Print.php)
    const receiptData = {
      organizationName: 'Kalloor Muslim JamaAth',
      organizationAddress: 'Kalloor, Kerala',
      receiptNo: record.receiptNo || 'N/A',
      date: new Date(recordDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      time: new Date(recordDate).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      mahalId: mahalId,
      memberName: memberName,
      memberAddress: memberAddress,
      amount: record.amount,
      amountInWords: amountInWords,
      accountType: accountType,
      category: record.category,
      paymentMethod: record.paymentMethod || 'Cash',
      notes: record.notes || '',
      financialYear: record.financialYear,
      // Additional fields for different types
      ...(account && {
        studentName: account.studentName,
        class: account.class,
        occasion: account.occasion,
        purpose: account.purpose
      }),
      collectedBy: record.collectedBy,
      _source: bill ? 'bill' : account ? 'account' : 'eidanual'
    };

    res.status(200).json({
      success: true,
      data: receiptData
    });
  } catch (error) {
    console.error('Error in getReceiptData:', error);
    next(error);
  }
};

