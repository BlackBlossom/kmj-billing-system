/**
 * User Model
 * Collection: users
 * 
 * Stores user authentication and basic profile information
 */

export const UserSchema = {
  // Authentication & Profile
  uid: 'string',                    // Firebase Auth UID (auto-generated)
  email: 'string',                  // Email address
  phone: 'string',                  // Phone number with country code (+91...)
  memberId: 'string',               // KMJ Member ID (Ward/HouseNo format: "1/2")
  
  // Personal Info
  name: 'string',                   // Full name
  address: 'string',                // Full residential address
  ward: 'string',                   // Mahal ward ("Kalloor Ward - 01")
  aadhaar: 'string',                // Aadhaar number (12 digits, encrypted)
  
  // System
  role: 'string',                   // "admin" | "user"
  isActive: 'boolean',              // Account status
  profileComplete: 'boolean',       // Has completed census form
  
  // Timestamps
  createdAt: 'timestamp',           // Account creation date
  updatedAt: 'timestamp',           // Last update date
  lastLogin: 'timestamp',           // Last login timestamp
  
  // Preferences
  language: 'string',               // "en" | "ml" | "ar"
  notifications: 'boolean',         // Enable/disable notifications
};

/**
 * Example User Document
 */
export const UserExample = {
  uid: 'abc123xyz',
  email: '1_2@kmj.local',
  phone: '+917909187497',
  memberId: '1/2',
  name: 'Abdul Basheer',
  address: 'Sheeja Manzil, Kalloor',
  ward: 'Kalloor Ward - 01',
  aadhaar: '567931677049',
  role: 'user',
  isActive: true,
  profileComplete: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLogin: new Date(),
  language: 'en',
  notifications: true,
};

/**
 * Firestore Indexes Required:
 * - memberId (unique)
 * - aadhaar (unique)
 * - phone
 * - role
 * - isActive
 */
