/**
 * Bill Model
 * Collection: bills
 * 
 * Stores all billing and payment records
 */

export const BillSchema = {
  // Receipt Details
  receiptNo: 'number',              // Auto-increment receipt number
  billId: 'string',                 // Firestore document ID
  
  // Member Information
  memberId: 'string',               // Member ID
  memberName: 'string',             // Member name
  memberAddress: 'string',          // Member address
  
  // Payment Details
  amount: 'number',                 // Payment amount
  amountInWords: 'string',          // Amount in words
  currency: 'string',               // Currency code (INR)
  
  // Account Classification
  category: 'string',               // "Jamaath" | "Madrassa" | "Land" | "Nercha" | "Sadhu"
  accountType: 'string',            // Specific account type
  subcategory: 'string',            // Sub-category (optional)
  
  // Payment Status
  status: 'string',                 // "Paid" | "Pending" | "Cancelled"
  paymentMethod: 'string',          // "Cash" | "Card" | "UPI" | "Bank Transfer"
  transactionId: 'string',          // External transaction ID (optional)
  
  // Receipt Document
  receiptPdf: {
    url: 'string',                  // Firebase Storage URL
    generatedAt: 'timestamp',       // PDF generation timestamp
    downloadCount: 'number',        // Download counter
  },
  
  // Timestamps
  paymentDate: 'timestamp',         // Payment date
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  
  // Audit
  createdBy: 'string',              // UserId of admin
  updatedBy: 'string',              // UserId of last editor
  
  // Notes
  notes: 'string',                  // Optional notes
  
  // Metadata (for filtering)
  year: 'number',                   // Payment year
  month: 'number',                  // Payment month (1-12)
  financialYear: 'string',          // Financial year (e.g., "2024-25")
};

/**
 * Account Types by Category
 */
export const AccountTypes = {
  Jamaath: [
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
  ],
  Madrassa: [
    'Annual Fee',
    'Monthly Fee',
    'Madrassa Building',
    'Madrassa Others',
  ],
  Land: [
    'Land Purchase',
    'Land & Maintenance',
    'Building & Maintenance',
    'Land Others',
  ],
  Nercha: [
    'Ramadhan',
    '27_Ravu',
    'Meladhun Nabi',
    'Others',
  ],
  Sadhu: [
    'Sadhu Sahayam',
    'Building Maintenance',
    'General Expenses',
    'Others',
  ],
};

/**
 * Example Bill Document
 */
export const BillExample = {
  receiptNo: 425,
  billId: 'bill_abc123',
  memberId: '1/2',
  memberName: 'Abdul Basheer',
  memberAddress: 'Sheeja Manzil, Kalloor',
  amount: 201,
  amountInWords: 'Two Hundred One Rupees Only',
  currency: 'INR',
  category: 'Jamaath',
  accountType: 'Dua_Friday',
  subcategory: '',
  status: 'Paid',
  paymentMethod: 'Cash',
  transactionId: '',
  receiptPdf: {
    url: '',
    generatedAt: new Date(),
    downloadCount: 0,
  },
  paymentDate: new Date('2024-01-03'),
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'admin_uid',
  updatedBy: 'admin_uid',
  notes: '',
  year: 2024,
  month: 1,
  financialYear: '2023-24',
};

/**
 * Firestore Indexes Required:
 * - receiptNo (unique)
 * - memberId
 * - category
 * - accountType
 * - paymentDate
 * - status
 * - year
 * - month
 * 
 * Composite Indexes:
 * - memberId + paymentDate
 * - category + accountType + paymentDate
 * - year + month
 * - status + paymentDate
 */
