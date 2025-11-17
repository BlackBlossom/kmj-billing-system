/**
 * Utility Functions
 * Inspired by shadcn/ui patterns
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx
 * Handles conditional classes and prevents conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency (Indian Rupees)
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date, format = 'dd MMM yyyy') {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format Member ID (Ward/House)
 */
export function formatMemberId(ward, house) {
  return `${ward}/${house}`;
}

/**
 * Get initials from name
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return '??';
  
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text
 */
export function truncate(text, length = 50) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Generate gradient background
 */
export function generateGradient(seed) {
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
  ];
  
  const index = seed ? seed.charCodeAt(0) % gradients.length : 0;
  return gradients[index];
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format phone number
 */
export function formatPhone(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{5})(\d{5})$/);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return phone;
}

/**
 * Validate Aadhaar number
 */
export function validateAadhaar(aadhaar) {
  return /^\d{12}$/.test(aadhaar);
}

/**
 * Validate phone number
 */
export function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

/**
 * Get status badge color
 */
export function getStatusColor(status) {
  const colors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  
  return colors[status] || colors.inactive;
}

/**
 * Get priority badge color
 */
export function getPriorityColor(priority) {
  const colors = {
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  };
  
  return colors[priority] || colors.normal;
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Get gender icon
 */
export function getGenderIcon(gender) {
  const icons = {
    Male: '👨',
    Female: '👩',
    Other: '🧑',
  };
  
  return icons[gender] || icons.Other;
}

/**
 * Get relation badge
 */
export function getRelationBadge(relation) {
  const badges = {
    Head: '👨‍👩‍👧‍👦',
    Spouse: '💑',
    Son: '👦',
    Daughter: '👧',
    Father: '👴',
    Mother: '👵',
  };
  
  return badges[relation] || '👤';
}
