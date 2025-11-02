/**
 * Forgot Password Page - Light Theme
 * Password verification using Member ID and Aadhaar
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IdentificationIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import AuthLayout from '../../components/layout/AuthLayout';
import showToast from '../../components/common/Toast';
import { authAPI } from '../../services/api.service';
import { validateAadhaar } from '../../lib/utils';

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    memberId: '',
    aadhaar: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.memberId.trim()) {
      newErrors.memberId = 'Member ID is required';
    } else if (!/^\d+\/\d+$/.test(formData.memberId)) {
      newErrors.memberId = 'Member ID format should be ward/house (e.g., 1/74)';
    }

    if (!formData.aadhaar.trim()) {
      newErrors.aadhaar = 'Aadhaar number is required';
    } else if (!validateAadhaar(formData.aadhaar)) {
      newErrors.aadhaar = 'Aadhaar must be a valid 12-digit number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.forgotPassword({
        memberId: formData.memberId,
        aadhaar: formData.aadhaar,
      });
      
      setIsSubmitted(true);
      showToast.success(response.message || 'Credentials verified successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to verify credentials';
      showToast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Success Icon */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100"
            >
              <CheckCircleIcon className="h-12 w-12 text-emerald-600" />
            </motion.div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-neutral-900">
              Verification Complete!
            </h3>
            <p className="text-neutral-600">
              Your credentials have been verified successfully
            </p>
          </div>

          {/* Member Info */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-sm text-neutral-700 text-center">
              Member ID: <span className="font-bold text-emerald-700">{formData.memberId}</span>
            </p>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-neutral-700">
                <p className="font-medium text-neutral-900">Your Password:</p>
                <ul className="space-y-1.5 ml-4 list-disc">
                  <li>Your 12-digit Aadhaar number is your password</li>
                  <li>Use it to login to your account</li>
                  <li>Contact admin to update Aadhaar details</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back to Login Button */}
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 rounded-lg font-medium text-white bg-linear-to-r from-emerald-600 to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Login
            </motion.button>
          </Link>

          {/* Support Contact */}
          <p className="text-xs text-center text-neutral-500">
            Need help? Contact{' '}
            <a href="tel:+919876543210" className="text-emerald-600 hover:text-emerald-700 font-medium">
              +91 9876543210
            </a>
          </p>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-1 mb-2">
          <h2 className="text-xl font-bold text-neutral-900">
            Forgot Password?
          </h2>
          <p className="text-sm text-neutral-600">
            Verify your identity with Member ID and Aadhaar
          </p>
        </div>

        {/* Member ID Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Member ID
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <IdentificationIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              placeholder="1/74"
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>
          {errors.memberId && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600"
            >
              {errors.memberId}
            </motion.p>
          )}
          <p className="text-xs text-neutral-500">Format: ward/house (e.g., 1/74)</p>
        </div>

        {/* Aadhaar Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Aadhaar Number
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <LockClosedIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              placeholder="123456789012"
              maxLength={12}
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>
          {errors.aadhaar && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600"
            >
              {errors.aadhaar}
            </motion.p>
          )}
          <p className="text-xs text-neutral-500">Your 12-digit Aadhaar number</p>
        </div>

        {/* General Error */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <p className="text-sm text-red-700">{errors.general}</p>
          </motion.div>
        )}

        {/* Info Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <InformationCircleIcon className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-neutral-700">
              <p className="font-medium">Important:</p>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>Your Aadhaar number is your password</li>
                <li>This verification confirms your identity</li>
                <li>Contact admin to update Aadhaar details</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="relative w-full py-3 rounded-lg font-medium text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-emerald-700 transition-all duration-300"></div>
          <div className="absolute inset-0 bg-linear-to-r from-emerald-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify Credentials</span>
            )}
          </span>
        </motion.button>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Login
          </Link>
        </div>

        {/* Support Contact */}
        <p className="text-xs text-center text-neutral-500">
          Need assistance? Contact{' '}
          <a href="tel:+919876543210" className="text-emerald-600 hover:text-emerald-700 font-medium">
            +91 9876543210
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
