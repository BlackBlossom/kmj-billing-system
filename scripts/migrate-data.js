/**
 * Firebase Data Migration Script
 * 
 * This script migrates data from MySQL dump (kmjdatabase.sql) to Firestore
 * 
 * Prerequisites:
 * 1. Node.js installed
 * 2. Firebase Admin SDK service account key downloaded
 * 3. MySQL data exported to kmjdatabase.sql
 * 
 * Usage:
 * node scripts/migrate-data.js
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { parse } from 'date-fns';

// Initialize Firebase Admin SDK
// Download your service account key from Firebase Console
// Place it in the scripts folder as serviceAccountKey.json
const serviceAccount = JSON.parse(
  readFileSync('./scripts/serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

// ============================================
// PARSE SQL DATA
// ============================================

/**
 * Parse INSERT statements from SQL file
 */
function parseSQLInserts(sqlContent, tableName) {
  const regex = new RegExp(
    `INSERT INTO \`${tableName}\`[^(]*\\(([^)]*)\\)\\s*VALUES\\s*\\(([^;]*)\\);`,
    'gi'
  );
  
  const records = [];
  let match;
  
  while ((match = regex.exec(sqlContent)) !== null) {
    const columns = match[1].split(',').map(c => c.trim().replace(/`/g, ''));
    const valuesStr = match[2];
    
    // Split values by '),(' to handle multiple rows
    const valueRows = valuesStr.split('),(');
    
    valueRows.forEach(row => {
      const values = row
        .replace(/^\(|\)$/g, '')
        .split("','")
        .map(v => v.replace(/^'|'$/g, '').trim());
      
      const record = {};
      columns.forEach((col, idx) => {
        record[col] = values[idx] || null;
      });
      
      records.push(record);
    });
  }
  
  return records;
}

// ============================================
// MIGRATION FUNCTIONS
// ============================================

/**
 * 1. Migrate Users from register table
 */
async function migrateUsers(sqlData) {
  console.log('\n📊 Migrating Users...');
  
  const registerData = parseSQLInserts(sqlData, 'register');
  const loginData = parseSQLInserts(sqlData, 'table_login');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const user of registerData) {
    try {
      const memberId = user.kmjid;
      const uid = memberId.replace('/', '_'); // "1/2" → "1_2"
      
      // Find corresponding login data
      const loginInfo = loginData.find(l => l.kmjid === memberId);
      const role = loginInfo?.role || 'user';
      
      // Create Firebase Auth user
      try {
        await auth.createUser({
          uid: uid,
          email: `${uid}@kmj.local`,
          password: user.aadhaar || 'password123', // Temporary password
          displayName: user.name,
          phoneNumber: user.phone ? `+91${user.phone}` : undefined
        });
      } catch (authError) {
        if (authError.code !== 'auth/uid-already-exists') {
          throw authError;
        }
      }
      
      // Create Firestore user document
      await db.collection('users').doc(uid).set({
        uid: uid,
        email: `${uid}@kmj.local`,
        phone: user.phone || '',
        memberId: memberId,
        name: user.name || '',
        address: user.email || '', // 'email' field actually contains address
        ward: user.ward || '',
        aadhaar: user.aadhaar || '',
        role: role,
        isActive: true,
        profileComplete: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: null,
        language: 'en',
        notifications: true
      });
      
      // Set custom claims for role
      await auth.setCustomUserClaims(uid, { role: role });
      
      successCount++;
      console.log(`✅ Migrated user: ${memberId} (${user.name})`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Error migrating user ${user.kmjid}:`, error.message);
    }
  }
  
  console.log(`\n✅ Users: ${successCount} migrated, ${errorCount} errors`);
}

/**
 * 2. Migrate Members from mtable
 */
async function migrateMembers(sqlData) {
  console.log('\n📊 Migrating Members (Census Data)...');
  
  const mtableData = parseSQLInserts(sqlData, 'mtable');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const member of mtableData) {
    try {
      const memberId = member.Mid;
      const userId = memberId.replace('/', '_');
      
      // Parse date of birth
      let dob = null;
      if (member.Dob && member.Dob !== '0000-00-00') {
        try {
          dob = admin.firestore.Timestamp.fromDate(new Date(member.Dob));
        } catch (e) {
          console.warn(`Invalid DOB for ${member.Fname}: ${member.Dob}`);
        }
      }
      
      // Calculate age
      let age = 0;
      if (dob) {
        const today = new Date();
        const birthDate = dob.toDate();
        age = today.getFullYear() - birthDate.getFullYear();
      }
      
      // Parse member since year
      let memberSince = null;
      if (member.Myear && member.Myear !== '0000') {
        memberSince = admin.firestore.Timestamp.fromDate(new Date(`${member.Myear}-01-01`));
      }
      
      await db.collection('members').add({
        userId: userId,
        memberId: memberId,
        personalInfo: {
          fullName: member.Fname || '',
          dateOfBirth: dob,
          age: age,
          gender: member.Gender || 'Male',
          relation: member.Relation || '',
          maritalStatus: member.Mstatus || '',
          healthStatus: member.Health || 'Good'
        },
        contact: {
          address: member.Address || '',
          phone: member.Mobile || '',
          email: member.Email || '',
          mahalWard: member.Mward || '',
          panchayath: {
            name: member.Pward || '',
            ward: member.Phouse || '',
            district: member.District || '',
            areaType: member.Area || ''
          }
        },
        education: {
          general: member.Education || '',
          madrassa: member.Madrassa || ''
        },
        occupation: {
          designation: member.Occupation || '',
          employer: ''
        },
        government: {
          aadhaar: member.Aadhaar || '',
          rationCard: member.RC || ''
        },
        property: {
          landOwnership: member.Land === 'Yes',
          houseOwnership: member.House === 'Yes',
          residentType: member.Resident || '',
          memberSince: memberSince
        },
        isHead: member.Relation === 'The Head of the Household',
        familyId: memberId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: userId
      });
      
      successCount++;
      console.log(`✅ Migrated member: ${member.Fname} (${memberId})`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Error migrating member ${member.Mid}:`, error.message);
    }
  }
  
  console.log(`\n✅ Members: ${successCount} migrated, ${errorCount} errors`);
}

/**
 * 3. Migrate Bills
 */
async function migrateBills(sqlData) {
  console.log('\n📊 Migrating Bills...');
  
  const billData = parseSQLInserts(sqlData, 'bill');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const bill of billData) {
    try {
      // Parse date
      const paymentDate = admin.firestore.Timestamp.fromDate(
        new Date(bill.Date_time)
      );
      const date = paymentDate.toDate();
      
      // Parse name and address from combined field
      const [name, ...addressParts] = bill.id_name_address.split(',');
      const address = addressParts.join(',').trim();
      
      await db.collection('bills').add({
        receiptNo: parseInt(bill.Sl_No),
        memberId: bill.mahal_ID,
        memberName: name.trim(),
        memberAddress: address,
        amount: parseFloat(bill.amount),
        amountInWords: '', // Will be generated via Cloud Function
        currency: 'INR',
        category: 'Jamaath',
        accountType: bill.type,
        subcategory: '',
        status: 'Paid',
        paymentMethod: 'Cash',
        transactionId: '',
        receiptPdf: {
          url: '',
          generatedAt: null,
          downloadCount: 0
        },
        paymentDate: paymentDate,
        createdAt: paymentDate,
        updatedAt: paymentDate,
        createdBy: 'admin',
        updatedBy: 'admin',
        notes: '',
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        financialYear: `${date.getFullYear()}-${(date.getFullYear() + 1).toString().slice(2)}`
      });
      
      successCount++;
      console.log(`✅ Migrated bill: Receipt #${bill.Sl_No}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Error migrating bill ${bill.Sl_No}:`, error.message);
    }
  }
  
  console.log(`\n✅ Bills: ${successCount} migrated, ${errorCount} errors`);
}

/**
 * 4. Migrate Account-specific bills
 */
async function migrateAccountBills(sqlData, tableName, category) {
  console.log(`\n📊 Migrating ${category} Account Bills...`);
  
  const accountData = parseSQLInserts(sqlData, tableName);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const record of accountData) {
    try {
      // Parse date (different format in account tables)
      let paymentDate;
      try {
        paymentDate = admin.firestore.Timestamp.fromDate(
          parse(record.Date, 'dd-MM-yyyy hh:mm:ss a', new Date())
        );
      } catch (e) {
        paymentDate = admin.firestore.Timestamp.fromDate(new Date());
      }
      
      const date = paymentDate.toDate();
      
      await db.collection('bills').add({
        receiptNo: parseInt(record.SL_NO),
        memberId: record.Mahal_Id || record.mahal_ID,
        memberName: record.address?.split(',')[0] || '',
        memberAddress: record.address || '',
        amount: parseFloat(record.amount),
        amountInWords: '',
        currency: 'INR',
        category: category,
        accountType: record.category,
        subcategory: record.category,
        status: 'Paid',
        paymentMethod: 'Cash',
        transactionId: '',
        receiptPdf: {
          url: '',
          generatedAt: null,
          downloadCount: 0
        },
        paymentDate: paymentDate,
        createdAt: paymentDate,
        updatedAt: paymentDate,
        createdBy: 'admin',
        updatedBy: 'admin',
        notes: '',
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        financialYear: `${date.getFullYear()}-${(date.getFullYear() + 1).toString().slice(2)}`
      });
      
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`❌ Error migrating ${category} bill:`, error.message);
    }
  }
  
  console.log(`\n✅ ${category}: ${successCount} migrated, ${errorCount} errors`);
}

/**
 * 5. Initialize Counters
 */
async function initializeCounters(sqlData) {
  console.log('\n📊 Initializing Counters...');
  
  const billData = parseSQLInserts(sqlData, 'bill');
  const mtableData = parseSQLInserts(sqlData, 'mtable');
  
  const maxReceiptNo = Math.max(...billData.map(b => parseInt(b.Sl_No) || 0));
  const totalMembers = mtableData.length;
  
  await db.collection('counters').doc('receipts').set({
    count: maxReceiptNo,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  });
  
  await db.collection('counters').doc('members').set({
    count: totalMembers,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  });
  
  console.log(`✅ Receipt counter: ${maxReceiptNo}`);
  console.log(`✅ Member counter: ${totalMembers}`);
}

/**
 * 6. Create default settings
 */
async function createSettings() {
  console.log('\n📊 Creating Default Settings...');
  
  await db.collection('settings').doc('app').set({
    organizationName: 'Kalloor Muslim JamaAth',
    logo: '',
    address: 'Kalloor, Manjamala P.O, Trivandrum, Kerala',
    phone: '+919876543210',
    email: 'info@kmjkalloor.org',
    currency: 'INR',
    financialYearStart: 4,
    accountTypes: {
      jamaath: [
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
        'Eid al-Fitr'
      ],
      madrassa: ['Annual Fee', 'Monthly Fee', 'Madrassa Building', 'Madrassa Others'],
      land: ['Land Purchase', 'Land & Maintenance', 'Building & Maintenance'],
      nercha: ['Ramadhan', '27_Ravu', 'Meladhun Nabi', 'Others'],
      sadhu: ['Sadhu Sahayam', 'Building Maintenance', 'General Expenses', 'Others']
    },
    receiptTemplate: {
      header: '<h1>Kalloor Muslim JamaAth</h1>',
      footer: '<p>Thank you for your contribution</p>',
      showLogo: true,
      showAddress: true
    },
    features: {
      onlinePayments: false,
      smsNotifications: false,
      whatsappIntegration: false
    },
    version: '2.0.0',
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: 'admin'
  });
  
  console.log('✅ Settings created');
}

// ============================================
// MAIN MIGRATION
// ============================================

async function runMigration() {
  try {
    console.log('🚀 Starting Firebase Data Migration...\n');
    console.log('Reading SQL file...');
    
    const sqlData = readFileSync('./kmjdatabase.sql', 'utf8');
    
    // Run migrations in order
    await migrateUsers(sqlData);
    await migrateMembers(sqlData);
    await migrateBills(sqlData);
    await migrateAccountBills(sqlData, 'account_madrassa', 'Madrassa');
    await migrateAccountBills(sqlData, 'account_land', 'Land');
    await migrateAccountBills(sqlData, 'account_nercha', 'Nercha');
    await migrateAccountBills(sqlData, 'account_sadhu', 'Sadhu');
    await initializeCounters(sqlData);
    await createSettings();
    
    console.log('\n\n🎉 Migration Complete!\n');
    console.log('Next steps:');
    console.log('1. Deploy Firestore rules: firebase deploy --only firestore:rules');
    console.log('2. Deploy Firestore indexes: firebase deploy --only firestore:indexes');
    console.log('3. Test the application');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
runMigration();
