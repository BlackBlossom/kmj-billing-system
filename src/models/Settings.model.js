/**
 * Settings Model
 * Collection: settings
 * 
 * Stores application configuration and settings
 */

export const SettingsSchema = {
  // Organization Info
  organizationName: 'string',
  logo: 'string',                   // Storage URL
  address: 'string',
  phone: 'string',
  email: 'string',
  
  // Financial
  currency: 'string',               // "INR"
  financialYearStart: 'number',     // Month number (1-12)
  
  // Account Types Configuration
  accountTypes: {
    jamaath: 'array',
    madrassa: 'array',
    land: 'array',
    nercha: 'array',
    sadhu: 'array',
  },
  
  // Receipt Template
  receiptTemplate: {
    header: 'string',               // HTML template
    footer: 'string',
    showLogo: 'boolean',
    showAddress: 'boolean',
  },
  
  // Features Toggle
  features: {
    onlinePayments: 'boolean',
    smsNotifications: 'boolean',
    whatsappIntegration: 'boolean',
  },
  
  // System
  version: 'string',
  lastUpdated: 'timestamp',
  updatedBy: 'string',
};

/**
 * Ward Configuration
 */
export const WardConfigSchema = {
  wards: [
    {
      id: 'string',
      name: 'string',
      isActive: 'boolean',
    },
  ],
};

/**
 * Example Settings Document
 */
export const SettingsExample = {
  organizationName: 'Kalloor Muslim JamaAth',
  logo: '',
  address: 'Kalloor, Manjamala P.O, Trivandrum',
  phone: '+919876543210',
  email: 'info@kmjkalloor.org',
  currency: 'INR',
  financialYearStart: 4, // April
  accountTypes: {
    jamaath: ['Dua_Friday', 'Donation', 'Marriage Fee'],
    madrassa: ['Annual Fee', 'Monthly Fee'],
    land: ['Land Maintenance'],
    nercha: ['Ramadhan', '27 Ravu'],
    sadhu: ['Building Maintenance'],
  },
  receiptTemplate: {
    header: '<h1>Kalloor Muslim JamaAth</h1>',
    footer: '<p>Thank you for your contribution</p>',
    showLogo: true,
    showAddress: true,
  },
  features: {
    onlinePayments: false,
    smsNotifications: false,
    whatsappIntegration: false,
  },
  version: '2.0.0',
  lastUpdated: new Date(),
  updatedBy: 'admin_uid',
};
