/**
 * Design System Constants
 * Islamic/Professional color palette from MERN Strategy
 */

// Theme Colors (Islamic/Professional)
export const COLORS = {
  // Primary Islamic Green
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#047857',  // Islamic Green (Main)
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Professional Blue
  accent: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#1e40af',  // Professional Blue (Main)
    700: '#1e3a8a',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Gold Accent
  gold: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',  // Accent Gold (Main)
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  success: {
    light: '#10b981',
    main: '#059669',
    dark: '#047857',
  },
  
  warning: {
    light: '#fbbf24',
    main: '#f59e0b',
    dark: '#d97706',
  },
  
  error: {
    light: '#f87171',
    main: '#ef4444',
    dark: '#dc2626',
  },
  
  info: {
    light: '#60a5fa',
    main: '#3b82f6',
    dark: '#2563eb',
  },
  
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
};

// Animation Variants (Framer Motion)
export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  
  slideDown: {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  
  slideLeft: {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  
  slideRight: {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  
  scale: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
  
  stagger: {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

// Transition Presets
export const TRANSITIONS = {
  default: { duration: 0.3, ease: 'easeInOut' },
  fast: { duration: 0.15, ease: 'easeInOut' },
  slow: { duration: 0.5, ease: 'easeInOut' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  bounce: { type: 'spring', stiffness: 400, damping: 10 },
};

// Account Types
export const ACCOUNT_TYPES = [
  { value: 'Dua_Friday', label: 'Dua Friday', icon: '🕌' },
  { value: 'Donation', label: 'Donation (സംഭാവന)', icon: '💰' },
  { value: 'Sunnath Fee', label: 'Sunnath Fee', icon: '👶' },
  { value: 'Marriage Fee', label: 'Marriage Fee', icon: '💍' },
  { value: 'Product Turnover', label: 'Product Turnover (ഉൽപ്പന്നങ്ങൾ)', icon: '📦' },
  { value: 'Rental_Basis', label: 'Rental Basis', icon: '🏠' },
  { value: 'Devotional Dedication', label: 'Devotional (കാണിക്ക)', icon: '🙏' },
  { value: 'Dead Fee', label: 'Dead Fee (മയ്യത്ത്)', icon: '🕊️' },
  { value: 'New Membership', label: 'New Membership', icon: '👥' },
  { value: 'Certificate Fee', label: 'Certificate Fee', icon: '📜' },
  { value: 'Eid ul Adha', label: 'Eid ul Adha', icon: '🐐' },
  { value: 'Eid al-Fitr', label: 'Eid al-Fitr', icon: '🌙' },
  { value: 'Madrassa', label: 'Madrassa', icon: '📚' },
  { value: 'Sadhu', label: 'Sadhu', icon: '🙏' },
  { value: 'Land', label: 'Land', icon: '🌾' },
  { value: 'Nercha', label: 'Nercha', icon: '✨' },
];

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male', icon: '👨' },
  { value: 'Female', label: 'Female', icon: '👩' },
  { value: 'Other', label: 'Other', icon: '🧑' },
];

// Relation Options
export const RELATION_OPTIONS = [
  { value: 'Head', label: 'Head of Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'Spouse', label: 'Spouse', icon: '💑' },
  { value: 'Son', label: 'Son', icon: '👦' },
  { value: 'Daughter', label: 'Daughter', icon: '👧' },
  { value: 'Father', label: 'Father', icon: '👴' },
  { value: 'Mother', label: 'Mother', icon: '👵' },
  { value: 'Brother', label: 'Brother', icon: '👨' },
  { value: 'Sister', label: 'Sister', icon: '👩' },
  { value: 'Grandfather', label: 'Grandfather', icon: '👴' },
  { value: 'Grandmother', label: 'Grandmother', icon: '👵' },
  { value: 'Other', label: 'Other', icon: '👤' },
];

// Marital Status
export const MARITAL_STATUS = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
];

// Education Levels
export const EDUCATION_LEVELS = [
  'Below 5th',
  '5th Standard',
  '8th Standard',
  'SSLC',
  'Plus Two',
  'Diploma',
  'Graduate',
  'Post Graduate',
  'Professional',
  'Others',
];

// Ration Card Types
export const RATION_CARD_TYPES = [
  { value: 'APL', label: 'APL (Above Poverty Line)' },
  { value: 'BPL', label: 'BPL (Below Poverty Line)' },
  { value: 'AAY', label: 'AAY (Antyodaya Anna Yojana)' },
  { value: 'None', label: 'None' },
];

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'Cash', label: 'Cash', icon: '💵' },
  { value: 'UPI', label: 'UPI', icon: '📱' },
  { value: 'Card', label: 'Card', icon: '💳' },
  { value: 'Bank Transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'Cheque', label: 'Cheque', icon: '📝' },
];

// Notice Priorities
export const NOTICE_PRIORITIES = [
  { value: 'urgent', label: 'Urgent', color: 'red' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'normal', label: 'Normal', color: 'blue' },
  { value: 'low', label: 'Low', color: 'gray' },
];

// Ward Options (1-10)
export const WARD_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: `Ward ${i + 1}`,
}));

// Dashboard Stats Icons
export const STAT_ICONS = {
  members: '👥',
  families: '👨‍👩‍👧‍👦',
  bills: '💰',
  revenue: '📊',
  notices: '📢',
  users: '🧑‍💼',
};

// Navigation Menu (Admin)
export const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Members', path: '/admin/members', icon: 'Users' },
  { label: 'Quick Pay', path: '/admin/quick-pay', icon: 'CreditCard' },
  { label: 'Bills', path: '/admin/bills', icon: 'Receipt' },
  { label: 'Notices', path: '/admin/notices', icon: 'Megaphone' },
  // { label: 'Reports', path: '/admin/reports', icon: 'BarChart3' },
  // { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
];

// Navigation Menu (User)
export const USER_NAV = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Profile', path: '/profile', icon: 'User' },
  { label: 'Family', path: '/family', icon: 'Users' },
  { label: 'Bills', path: '/bills', icon: 'Receipt' },
  // { label: 'Settings', path: '/settings', icon: 'Settings' },
];

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// App Info
export const APP_INFO = {
  name: 'KMJ Billing System',
  version: '2.0.0',
  organization: 'Kalloor Muslim JamaAth',
  address: 'Kalloor, Kerala',
  contact: '+91 98765 43210',
  email: 'info@kmj.org',
};
