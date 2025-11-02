/**
 * Toast Notification Configuration
 * React Hot Toast setup
 */

import toast, { Toaster } from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

// Toast configuration
export const toastConfig = {
  duration: 4000,
  position: 'top-right',
  
  // Styling
  style: {
    background: '#fff',
    color: '#374151',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  
  // Icon themes
  success: {
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
};

// Custom toast functions
export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      ...options,
      icon: <CheckCircleIcon className="h-5 w-5 text-success-600" />,
    });
  },
  
  error: (message, options = {}) => {
    toast.error(message, {
      ...options,
      icon: <XCircleIcon className="h-5 w-5 text-red-600" />,
    });
  },
  
  info: (message, options = {}) => {
    toast(message, {
      ...options,
      icon: <InformationCircleIcon className="h-5 w-5 text-blue-600" />,
    });
  },
  
  warning: (message, options = {}) => {
    toast(message, {
      ...options,
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />,
    });
  },
  
  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong',
    });
  },
};

// Toast Container Component
export const ToastContainer = () => {
  return <Toaster position={toastConfig.position} toastOptions={toastConfig} />;
};

export default showToast;
