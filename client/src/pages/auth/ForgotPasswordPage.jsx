/**
 * Forgot Password Page - New Color Palette Design
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
    } else if (!/^(\d+\/\d+|ADMIN\/\d+)$/i.test(formData.memberId)) {
      newErrors.memberId = 'Member ID format should be ward/house (e.g., 1/74) or ADMIN/001';
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6 bg-white rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-2 border-[#E3F9F9]/50"
        >
          {/* Success Icon */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-[#E3F9F9] to-[#41A4A7]/20 shadow-lg"
            >
              <CheckCircleIcon className="h-14 w-14 text-[#31757A] drop-shadow-md" />
            </motion.div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-bold bg-linear-to-r from-[#1F2E2E] to-[#31757A] bg-clip-text text-transparent">
              Verification Complete!
            </h3>
            <p className="text-gray-500 font-medium">
              Your credentials have been verified successfully
            </p>
          </div>

          {/* Member Info */}
          <div className="bg-linear-to-br from-[#E3F9F9] to-white border-2 border-[#41A4A7]/30 rounded-2xl p-5 shadow-lg">
            <p className="text-base text-[#1F2E2E] text-center font-medium">
              Member ID: <span className="font-bold text-[#31757A] text-lg">{formData.memberId}</span>
            </p>
          </div>

          {/* Information Box */}
          <div className="bg-linear-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-5 space-y-3 shadow-md">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-bold text-[#1F2E2E]">Your Password:</p>
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
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full py-4 rounded-xl font-bold text-white overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#31757A] via-[#41A4A7] to-[#31757A] transition-all duration-300"></div>
              <div className="absolute inset-0 bg-linear-to-r from-[#41A4A7] via-[#31757A] to-[#41A4A7] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_50%)] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              
              <span className="relative z-10 flex items-center gap-2">
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Login
              </span>
            </motion.button>
          </Link>

          {/* Support Contact */}
          <p className="text-xs text-center text-gray-500">
            Need help? Contact{' '}
            <a href="tel:+917034829292" className="text-[#31757A] hover:text-[#41A4A7] font-semibold">
              +91 703 48 29292
            </a>
          </p>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Header */}
        <div className="text-center space-y-2 mb-4">
          <h2 className="text-2xl font-bold bg-linear-to-r from-[#1F2E2E] to-[#31757A] bg-clip-text text-transparent">
            Forgot Password?
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Verify your identity with Member ID and Aadhaar
          </p>
        </div>

        {/* Member ID Input */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1F2E2E] tracking-wide">
            Member ID
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#31757A] transition-colors">
              <IdentificationIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              placeholder="1/74 or ADMIN/001"
              autoFocus
              className={`w-full pl-11 pr-4 py-3.5 bg-white border-2 rounded-xl text-[#1F2E2E] placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm ${
                errors.memberId
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:ring-[#31757A] focus:border-[#31757A] focus:shadow-lg focus:shadow-[#31757A]/20 group-hover:border-gray-300'
              }`}
            />
          </div>
          {errors.memberId && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600 font-medium"
            >
              {errors.memberId}
            </motion.p>
          )}
          <p className="text-xs text-gray-500">Format: ward/house (e.g., 1/74) or ADMIN/001</p>
        </div>

        {/* Aadhaar Input */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1F2E2E] tracking-wide">
            Aadhaar Number
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#31757A] transition-colors">
              <LockClosedIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              placeholder="123456789012"
              maxLength={12}
              className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-[#1F2E2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] focus:shadow-lg focus:shadow-[#31757A]/20 transition-all duration-200 shadow-sm group-hover:border-gray-300"
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
          <p className="text-xs text-gray-500">Your 12-digit Aadhaar number</p>
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
            <div className="space-y-1 text-xs text-gray-700">
              <p className="font-semibold text-[#1F2E2E]">Important:</p>
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
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative w-full py-4 rounded-xl font-bold text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all duration-200"
        >
          <div className="absolute inset-0 bg-linear-to-r from-[#31757A] via-[#41A4A7] to-[#31757A] transition-all duration-300"></div>
          <div className="absolute inset-0 bg-linear-to-r from-[#41A4A7] via-[#31757A] to-[#41A4A7] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_50%)] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          
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
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#31757A] text-sm font-bold tracking-wide transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Login
          </Link>
        </div>

        {/* Support Contact */}
        <p className="text-xs text-center text-gray-500">
          Need assistance? Contact{' '}
          <a href="tel:+917034829292" className="text-[#31757A] hover:text-[#41A4A7] font-semibold">
            +91 703 48 29292
          </a>
        </p>
      </motion.form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
