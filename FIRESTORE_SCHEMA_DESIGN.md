# 🗄️ Firestore Database Schema Design
## KMJ Billing System - React + Firebase

This document maps the current MySQL schema to the new Firestore schema.

---

## 📊 Schema Comparison

### Current MySQL (10 Tables)
1. `register` - Basic member registration
2. `table_login` - Authentication
3. `mtable` - Member census (25 fields)
4. `notice` - Notice board
5. `bill` - General billing
6. `eid_anual` - Festival contributions
7. `account_madrassa` - Madrassa accounts
8. `account_sadhu` - General accounts
9. `account_land` - Land accounts
10. `account_nercha` - Nercha offerings

### Proposed Firestore (7 Collections)
1. `users` - User authentication & basic info
2. `members` - Census data (replaces register + mtable)
3. `bills` - All billing records
4. `accounts` - Subcollections for specialized accounts
5. `notices` - Notice board
6. `counters` - Auto-increment helpers
7. `settings` - App configuration

---

## 🔄 Collection Details

### 1. Users Collection
```javascript
users/{userId}
{
  // Authentication & Profile
  uid: string,                    // Firebase Auth UID
  email: string,                  // Email (or generated)
  phone: string,                  // +919876543210
  memberId: string,               // "1/25" (Ward/HouseNo)
  
  // Personal Info
  name: string,                   // "Abdul Rahman"
  address: string,                // Full address
  ward: string,                   // "Kalloor Ward - 01"
  aadhaar: string,                // "123456789012" (encrypted)
  
  // System
  role: string,                   // "admin" | "user"
  isActive: boolean,              // true
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // Metadata
  lastLogin: timestamp,
  profileComplete: boolean,       // Has filled census
  
  // Preferences
  language: string,               // "en" | "ml"
  notifications: boolean          // true
}
```

**Indexes:**
- `memberId` (unique)
- `aadhaar` (unique)
- `phone`
- `role`

**Migration from MySQL:**
```sql
-- FROM: register table
register.kmjid → users.memberId
register.name → users.name
register.email → users.address (repurposed field)
register.phone → users.phone
register.aadhaar → users.aadhaar
register.ward → users.ward

-- FROM: table_login table
table_login.kmjid → users.memberId (join key)
table_login.role → users.role
```

---

### 2. Members Collection (Census Data)
```javascript
members/{memberId}
{
  // Reference
  userId: string,                 // users/{userId} reference
  memberId: string,               // "1/25" (for quick lookup)
  
  // Personal Information
  personalInfo: {
    fullName: string,             // "Abdul Rahman"
    dateOfBirth: timestamp,       // Date object
    age: number,                  // Calculated field
    gender: string,               // "Male" | "Female" | "Other"
    relation: string,             // "Father" | "Mother" | "Son" | "Daughter" | "Self"
    maritalStatus: string,        // "Single" | "Married" | "Divorced" | "Widow"
    healthStatus: string          // Health conditions or "Good"
  },
  
  // Contact Information
  contact: {
    address: string,              // Full residential address
    phone: string,                // Primary phone
    email: string,                // Optional
    mahalWard: string,            // "1"
    panchayath: {
      name: string,               // "Kalloor Panchayath"
      ward: string,               // Ward number
      district: string,           // "Thiruvananthapuram"
      areaType: string            // "Corporation" | "Municipality" | "Panchayath"
    }
  },
  
  // Education
  education: {
    general: string,              // "SSLC" | "Plus Two" | "Degree" | etc.
    madrassa: string              // Madrassa education level
  },
  
  // Occupation
  occupation: {
    designation: string,          // Job title
    employer: string              // Company/organization (optional)
  },
  
  // Government Documents
  government: {
    aadhaar: string,              // "123456789012" (encrypted)
    rationCard: string            // "APL" | "BPL" | "AAY"
  },
  
  // Property & Residence
  property: {
    landOwnership: boolean,       // true/false
    houseOwnership: boolean,      // true/false
    residentType: string,         // "Own" | "Rent" | "Other"
    memberSince: timestamp        // Year joined
  },
  
  // System
  isHead: boolean,                // true if head of household
  familyId: string,               // Group family members
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: string               // userId who created record
}
```

**Indexes:**
- `userId`
- `memberId`
- `personalInfo.dateOfBirth`
- `contact.mahalWard`
- `familyId`

**Composite Indexes:**
- `memberId` + `personalInfo.relation`
- `contact.mahalWard` + `createdAt`

**Migration from MySQL:**
```sql
-- FROM: mtable table
mtable.mid → members.memberId
mtable.name → members.personalInfo.fullName
mtable.dob → members.personalInfo.dateOfBirth
mtable.gender → members.personalInfo.gender
mtable.relation → members.personalInfo.relation
mtable.mstatus → members.personalInfo.maritalStatus
mtable.occ → members.occupation.designation
mtable.ration → members.government.rationCard
mtable.edu → members.education.general
mtable.medu → members.education.madrassa
mtable.aadhaar → members.government.aadhaar
mtable.phone → members.contact.phone
mtable.email → members.contact.email
mtable.health → members.personalInfo.healthStatus
mtable.myear → members.property.memberSince
mtable.pward → members.contact.panchayath.name
mtable.phouse → members.contact.panchayath.ward
mtable.dist → members.contact.panchayath.district
mtable.area → members.contact.panchayath.areaType
mtable.land → members.property.landOwnership
mtable.house → members.property.houseOwnership
mtable.resident → members.property.residentType
mtable.address → members.contact.address
mtable.mward → members.contact.mahalWard
```

---

### 3. Bills Collection
```javascript
bills/{billId}
{
  // Receipt Details
  receiptNo: number,              // Auto-increment (1, 2, 3...)
  billId: string,                 // Firestore document ID
  
  // Member Information
  memberId: string,               // "1/25"
  memberName: string,             // "Abdul Rahman"
  memberAddress: string,          // Full address
  
  // Payment Details
  amount: number,                 // 500.00
  amountInWords: string,          // "Five Hundred Rupees Only"
  currency: string,               // "INR"
  
  // Account Classification
  category: string,               // "Jamaath" | "Madrassa" | "Land" | "Nercha" | "Sadhu"
  accountType: string,            // "Donation" | "Marriage Fee" | etc.
  subcategory: string,            // Specific type (for specialized accounts)
  
  // Payment Status
  status: string,                 // "Paid" | "Pending" | "Cancelled"
  paymentMethod: string,          // "Cash" | "Card" | "UPI" | "Bank Transfer"
  transactionId: string,          // External transaction ID (if applicable)
  
  // Receipt Document
  receiptPdf: {
    url: string,                  // Firebase Storage URL
    generatedAt: timestamp,
    downloadCount: number
  },
  
  // Timestamps
  paymentDate: timestamp,         // When payment was made
  createdAt: timestamp,           // When record was created
  updatedAt: timestamp,
  
  // Audit
  createdBy: string,              // userId of admin who created
  updatedBy: string,              // userId of last editor
  
  // Notes
  notes: string,                  // Optional notes
  
  // Metadata
  year: number,                   // 2025 (for easy filtering)
  month: number,                  // 1-12
  financialYear: string           // "2024-25"
}
```

**Indexes:**
- `receiptNo` (unique)
- `memberId`
- `category`
- `accountType`
- `paymentDate`
- `status`
- `year`

**Composite Indexes:**
- `memberId` + `paymentDate`
- `category` + `accountType` + `paymentDate`
- `year` + `month`

**Migration from MySQL:**
```sql
-- FROM: bill table
bill.Sl_No → bills.receiptNo
bill.mahal_ID → bills.memberId
bill.id_name_address → bills.memberName + memberAddress (parse)
bill.amount → bills.amount
bill.type → bills.accountType
bill.Date_time → bills.paymentDate

-- FROM: eid_anual, account_madrassa, account_sadhu, account_land, account_nercha
-- All merged into bills collection with category field
```

---

### 4. Accounts Subcollections (Specialized)
```javascript
accounts/madrassa/records/{recordId}
accounts/land/records/{recordId}
accounts/nercha/records/{recordId}
accounts/sadhu/records/{recordId}
{
  // Same structure as bills collection
  // But with category-specific subcategory field
  
  subcategory: string,            // Madrassa: "Annual Fee" | "Monthly Fee" | "Building"
                                  // Land: "Purchase" | "Maintenance" | "Others"
                                  // Nercha: "Ramadhan" | "27 Ravu" | "Meladhun Nabi"
                                  // Sadhu: "Building Maintenance" | "General Expenses"
  
  // All other fields same as bills
  ...bills
}
```

**Purpose:** Quick category-specific queries without filtering entire bills collection.

**Alternative Design:** Could use a single `bills` collection with good indexing instead.

---

### 5. Notices Collection
```javascript
notices/{noticeId}
{
  // Content
  title: string,                  // "Eid ul-Fitr Prayer Timings"
  content: string,                // Full notice text (HTML or Markdown)
  summary: string,                // Short summary for cards
  
  // Priority & Display
  priority: string,               // "high" | "medium" | "low"
  isPinned: boolean,              // Show at top
  isPublished: boolean,           // Visible to public
  
  // Scheduling
  publishDate: timestamp,         // When to start showing
  expiryDate: timestamp,          // When to stop showing
  
  // Categorization
  category: string,               // "Event" | "Announcement" | "Alert"
  tags: array,                    // ["eid", "prayer", "timing"]
  
  // Attachments
  attachments: [
    {
      name: string,
      url: string,                // Firebase Storage
      type: string                // "image" | "pdf" | "doc"
    }
  ],
  
  // Engagement
  views: number,                  // View count
  
  // Audit
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: string,              // userId
  
  // Display Settings
  showOnHomepage: boolean,        // true
  showInDashboard: boolean        // true
}
```

**Indexes:**
- `isPublished`
- `publishDate`
- `expiryDate`
- `priority`
- `category`

**Composite Indexes:**
- `isPublished` + `publishDate`
- `category` + `publishDate`

**Migration from MySQL:**
```sql
-- FROM: notice table
notice.notice_text → notices.title
notice.notice_details → notices.content
```

---

### 6. Counters Collection
```javascript
counters/receipts
{
  count: number,                  // Current receipt number
  lastUpdated: timestamp
}

counters/members
{
  count: number,                  // Total members
  lastUpdated: timestamp
}
```

**Purpose:** Atomic counter increments using transactions.

**Usage:**
```javascript
const counterRef = db.collection('counters').doc('receipts');
const newReceiptNo = await db.runTransaction(async (t) => {
  const doc = await t.get(counterRef);
  const newCount = (doc.data()?.count || 0) + 1;
  t.update(counterRef, { count: newCount });
  return newCount;
});
```

---

### 7. Settings Collection
```javascript
settings/app
{
  // Organization Info
  organizationName: string,       // "Kalloor Muslim JamaAth"
  logo: string,                   // Storage URL
  address: string,
  phone: string,
  email: string,
  
  // Financial
  currency: string,               // "INR"
  financialYearStart: number,     // 4 (April)
  
  // Account Types Configuration
  accountTypes: {
    jamaath: [
      "Dua_Friday",
      "Donation",
      "Sunnath Fee",
      // ... all types
    ],
    madrassa: [
      "Annual Fee",
      "Monthly Fee",
      // ...
    ],
    // ... other categories
  },
  
  // Receipt Template
  receiptTemplate: {
    header: string,               // HTML template
    footer: string,
    showLogo: boolean,
    showAddress: boolean
  },
  
  // Features Toggle
  features: {
    onlinePayments: boolean,      // false (future)
    smsNotifications: boolean,    // false (future)
    whatsappIntegration: boolean  // false (future)
  },
  
  // System
  version: string,                // "2.0.0"
  lastUpdated: timestamp,
  updatedBy: string
}

settings/ward-configuration
{
  wards: [
    {
      id: string,                 // "1"
      name: string,               // "Kalloor Ward - 01"
      isActive: boolean
    }
    // ... more wards
  ]
}
```

---

## 🔐 Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper Functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return request.auth.token.role == 'admin';
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users Collection
    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Members Collection
    match /members/{memberId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                       (resource.data.userId == request.auth.uid || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Bills Collection
    match /bills/{billId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Accounts Subcollections
    match /accounts/{category}/records/{recordId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Notices Collection
    match /notices/{noticeId} {
      allow read: if true; // Public read
      allow write: if isAdmin();
    }
    
    // Counters Collection
    match /counters/{counterId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only via Cloud Functions
    }
    
    // Settings Collection
    match /settings/{settingId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

---

## 📈 Query Examples

### 1. Get All Family Members
```javascript
const familyMembers = await db.collection('members')
  .where('memberId', '==', '1/25')
  .orderBy('personalInfo.relation')
  .get();
```

### 2. Get Recent Bills
```javascript
const recentBills = await db.collection('bills')
  .orderBy('paymentDate', 'desc')
  .limit(5)
  .get();
```

### 3. Get Bills by Account Type
```javascript
const donationBills = await db.collection('bills')
  .where('accountType', '==', 'Donation')
  .where('year', '==', 2025)
  .orderBy('paymentDate', 'desc')
  .get();
```

### 4. Get Member's Payment History
```javascript
const memberBills = await db.collection('bills')
  .where('memberId', '==', '1/25')
  .orderBy('paymentDate', 'desc')
  .get();
```

### 5. Get Active Notices
```javascript
const now = new Date();
const activeNotices = await db.collection('notices')
  .where('isPublished', '==', true)
  .where('publishDate', '<=', now)
  .where('expiryDate', '>', now)
  .orderBy('priority')
  .orderBy('publishDate', 'desc')
  .get();
```

### 6. Get Monthly Collections
```javascript
const monthlyTotal = await db.collection('bills')
  .where('year', '==', 2025)
  .where('month', '==', 10)
  .where('status', '==', 'Paid')
  .get();

const total = monthlyTotal.docs.reduce((sum, doc) => 
  sum + doc.data().amount, 0);
```

### 7. Get Members by Ward
```javascript
const wardMembers = await db.collection('members')
  .where('contact.mahalWard', '==', '1')
  .orderBy('personalInfo.fullName')
  .get();
```

### 8. Search Members
```javascript
// Note: Firestore doesn't support full-text search natively
// Use Algolia or implement with array-contains for tags
const searchResults = await db.collection('members')
  .where('personalInfo.fullName', '>=', searchTerm)
  .where('personalInfo.fullName', '<=', searchTerm + '\uf8ff')
  .limit(20)
  .get();
```

---

## 🔄 Data Migration Script

```javascript
// migration.js
const admin = require('firebase-admin');
const mysql = require('mysql2/promise');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json')
});

const db = admin.firestore();
const auth = admin.auth();

// MySQL connection
const mysqlConn = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpassword',
  database: 'kmjdatabase'
});

// 1. Migrate Users
async function migrateUsers() {
  const [rows] = await mysqlConn.execute('SELECT * FROM register');
  
  for (const row of rows) {
    try {
      // Create Firebase Auth user
      const userRecord = await auth.createUser({
        uid: row.kmjid.replace('/', '_'), // "1/25" → "1_25"
        email: `${row.kmjid.replace('/', '_')}@kmj.local`,
        password: row.aadhaar, // Temporary - user should change
        displayName: row.name,
        phoneNumber: row.phone ? `+91${row.phone}` : null
      });
      
      // Create Firestore user doc
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: userRecord.email,
        phone: row.phone,
        memberId: row.kmjid,
        name: row.name,
        address: row.email, // Actually address in old system
        ward: row.ward,
        aadhaar: row.aadhaar,
        role: 'user',
        isActive: true,
        profileComplete: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Migrated user: ${row.kmjid}`);
    } catch (error) {
      console.error(`❌ Error migrating ${row.kmjid}:`, error.message);
    }
  }
}

// 2. Migrate Members (Census)
async function migrateMembers() {
  const [rows] = await mysqlConn.execute('SELECT * FROM mtable');
  
  for (const row of rows) {
    try {
      const memberId = row.mid;
      const userId = memberId.replace('/', '_');
      
      await db.collection('members').add({
        userId: userId,
        memberId: memberId,
        personalInfo: {
          fullName: row.name,
          dateOfBirth: row.dob ? admin.firestore.Timestamp.fromDate(new Date(row.dob)) : null,
          gender: row.gender,
          relation: row.relation,
          maritalStatus: row.mstatus,
          healthStatus: row.health || 'Good'
        },
        contact: {
          address: row.address,
          phone: row.phone,
          email: row.email,
          mahalWard: row.mward,
          panchayath: {
            name: row.pward,
            ward: row.phouse,
            district: row.dist,
            areaType: row.area
          }
        },
        education: {
          general: row.edu,
          madrassa: row.medu
        },
        occupation: {
          designation: row.occ
        },
        government: {
          aadhaar: row.aadhaar,
          rationCard: row.ration
        },
        property: {
          landOwnership: row.land === 'yes',
          houseOwnership: row.house === 'yes',
          residentType: row.resident,
          memberSince: row.myear ? admin.firestore.Timestamp.fromDate(new Date(row.myear)) : null
        },
        isHead: row.relation === 'Self',
        familyId: memberId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Migrated member: ${row.name} (${memberId})`);
    } catch (error) {
      console.error(`❌ Error migrating member:`, error.message);
    }
  }
}

// 3. Migrate Bills
async function migrateBills() {
  const [rows] = await mysqlConn.execute('SELECT * FROM bill');
  
  for (const row of rows) {
    try {
      // Parse name and address from combined field
      const [name, ...addressParts] = row.id_name_address.split(',');
      const address = addressParts.join(',').trim();
      
      const paymentDate = admin.firestore.Timestamp.fromDate(new Date(row.Date_time));
      
      await db.collection('bills').add({
        receiptNo: row.Sl_No,
        memberId: row.mahal_ID,
        memberName: name.trim(),
        memberAddress: address,
        amount: parseFloat(row.amount),
        amountInWords: '', // Will be generated later
        currency: 'INR',
        category: 'Jamaath',
        accountType: row.type,
        status: 'Paid',
        paymentMethod: 'Cash',
        paymentDate: paymentDate,
        year: paymentDate.toDate().getFullYear(),
        month: paymentDate.toDate().getMonth() + 1,
        createdAt: paymentDate
      });
      
      console.log(`✅ Migrated bill: Receipt #${row.Sl_No}`);
    } catch (error) {
      console.error(`❌ Error migrating bill:`, error.message);
    }
  }
}

// 4. Migrate Notices
async function migrateNotices() {
  const [rows] = await mysqlConn.execute('SELECT * FROM notice');
  
  for (const row of rows) {
    await db.collection('notices').add({
      title: row.notice_text,
      content: row.notice_details,
      summary: row.notice_text.substring(0, 100),
      priority: 'medium',
      isPinned: false,
      isPublished: true,
      publishDate: admin.firestore.FieldValue.serverTimestamp(),
      category: 'Announcement',
      showOnHomepage: true,
      views: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

// 5. Initialize Counters
async function initializeCounters() {
  const [billCount] = await mysqlConn.execute('SELECT MAX(Sl_No) as maxReceipt FROM bill');
  
  await db.collection('counters').doc('receipts').set({
    count: billCount[0].maxReceipt || 0,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  });
  
  const [memberCount] = await mysqlConn.execute('SELECT COUNT(*) as total FROM mtable');
  
  await db.collection('counters').doc('members').set({
    count: memberCount[0].total || 0,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  });
}

// Run Migration
async function runMigration() {
  console.log('🚀 Starting migration...\n');
  
  await migrateUsers();
  console.log('\n✅ Users migrated\n');
  
  await migrateMembers();
  console.log('\n✅ Members migrated\n');
  
  await migrateBills();
  console.log('\n✅ Bills migrated\n');
  
  await migrateNotices();
  console.log('\n✅ Notices migrated\n');
  
  await initializeCounters();
  console.log('\n✅ Counters initialized\n');
  
  console.log('🎉 Migration complete!');
  
  await mysqlConn.end();
  process.exit(0);
}

runMigration().catch(console.error);
```

---

## 📊 Performance Optimization

### 1. Indexing Strategy
```javascript
// Create indexes via Firebase Console or CLI

// Members
db.collection('members')
  .createIndex({ 'memberId': 1 });
db.collection('members')
  .createIndex({ 'contact.mahalWard': 1, 'createdAt': -1 });

// Bills
db.collection('bills')
  .createIndex({ 'receiptNo': 1 }); // Unique
db.collection('bills')
  .createIndex({ 'memberId': 1, 'paymentDate': -1 });
db.collection('bills')
  .createIndex({ 'category': 1, 'year': 1, 'month': 1 });
```

### 2. Denormalization
```javascript
// Store frequently accessed data redundantly
bills/{billId}
{
  memberId: "1/25",
  memberName: "Abdul Rahman",    // Denormalized from members
  memberAddress: "...",           // Denormalized from members
  // Avoid joins - all data in one doc
}
```

### 3. Pagination
```javascript
// Use cursor-based pagination
const firstPage = await db.collection('members')
  .orderBy('personalInfo.fullName')
  .limit(20)
  .get();

const lastDoc = firstPage.docs[firstPage.docs.length - 1];

const nextPage = await db.collection('members')
  .orderBy('personalInfo.fullName')
  .startAfter(lastDoc)
  .limit(20)
  .get();
```

### 4. Caching
```javascript
// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open
    } else if (err.code === 'unimplemented') {
      // Browser doesn't support
    }
  });
```

---

## 🎯 Summary

| Aspect | MySQL (Current) | Firestore (Proposed) |
|--------|----------------|---------------------|
| **Collections** | 10 tables | 7 collections |
| **Complexity** | Normalized, joins needed | Denormalized, no joins |
| **Scalability** | Vertical scaling | Automatic horizontal scaling |
| **Querying** | SQL | NoSQL (queries + filters) |
| **Real-time** | Polling required | Built-in listeners |
| **Security** | Application layer | Database rules |
| **Cost** | Server maintenance | Pay per operation |
| **Migration Effort** | Medium | Low (script provided) |

---

**Created:** October 22, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation
