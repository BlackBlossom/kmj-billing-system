/**
 * Member Model (Census Data)
 * Collection: members
 * 
 * Stores comprehensive 25-field census information for family members
 */

export const MemberSchema = {
  // Reference
  userId: 'string',                 // Reference to users collection
  memberId: 'string',               // KMJ Member ID (Ward/HouseNo)
  
  // Personal Information
  personalInfo: {
    fullName: 'string',             // Full name
    dateOfBirth: 'timestamp',       // Date of birth
    age: 'number',                  // Calculated age
    gender: 'string',               // "Male" | "Female" | "Other"
    relation: 'string',             // Relationship to head
    maritalStatus: 'string',        // "Single" | "Married" | "Divorced" | "Widow" | "Widower"
    healthStatus: 'string',         // Health conditions or "Good"
  },
  
  // Contact Information
  contact: {
    address: 'string',              // Full residential address
    phone: 'string',                // Phone number
    email: 'string',                // Email (optional)
    mahalWard: 'string',            // Ward number
    panchayath: {
      name: 'string',               // Panchayath name
      ward: 'string',               // Panchayath ward
      district: 'string',           // District
      areaType: 'string',           // "Corporation" | "Municipality" | "Panchayath"
    },
  },
  
  // Education
  education: {
    general: 'string',              // General education level
    madrassa: 'string',             // Madrassa education level
  },
  
  // Occupation
  occupation: {
    designation: 'string',          // Job title/designation
    employer: 'string',             // Company/organization (optional)
  },
  
  // Government Documents
  government: {
    aadhaar: 'string',              // Aadhaar number (encrypted)
    rationCard: 'string',           // Ration card type
  },
  
  // Property & Residence
  property: {
    landOwnership: 'boolean',       // Owns land
    houseOwnership: 'boolean',      // Owns house
    residentType: 'string',         // "Own" | "Rent" | "Other"
    memberSince: 'timestamp',       // Member since date
  },
  
  // System
  isHead: 'boolean',                // Is head of household
  familyId: 'string',               // Family group ID
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  createdBy: 'string',              // UserId who created
};

/**
 * Example Member Document
 */
export const MemberExample = {
  userId: 'abc123xyz',
  memberId: '1/2',
  personalInfo: {
    fullName: 'Abdul Basheer',
    dateOfBirth: new Date('1945-08-10'),
    age: 80,
    gender: 'Male',
    relation: 'The Head of the Household',
    maritalStatus: 'Married',
    healthStatus: 'Good',
  },
  contact: {
    address: 'Sheeja Manzil, Kalloor',
    phone: '7909187497',
    email: '',
    mahalWard: '1',
    panchayath: {
      name: 'Pothencode',
      ward: '13',
      district: 'Trivandrum',
      areaType: 'Panchayath',
    },
  },
  education: {
    general: 'SSLC',
    madrassa: '3',
  },
  occupation: {
    designation: 'Retired',
    employer: '',
  },
  government: {
    aadhaar: '567931677049',
    rationCard: 'White',
  },
  property: {
    landOwnership: true,
    houseOwnership: true,
    residentType: 'Own',
    memberSince: new Date('2022-01-01'),
  },
  isHead: true,
  familyId: '1/2',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'abc123xyz',
};

/**
 * Firestore Indexes Required:
 * - memberId
 * - userId
 * - familyId
 * - personalInfo.dateOfBirth
 * - contact.mahalWard
 * - isHead
 * 
 * Composite Indexes:
 * - memberId + personalInfo.relation
 * - contact.mahalWard + createdAt
 * - familyId + isHead
 */
