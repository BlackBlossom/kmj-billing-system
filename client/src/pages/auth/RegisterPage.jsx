/**
 * Register Page - Light Theme
 * New user registration
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserIcon,
  LockClosedIcon,
  PhoneIcon,
  HomeIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import AuthLayout from '../../components/layout/AuthLayout';
import showToast from '../../components/common/Toast';
import useAuthStore from '../../store/authStore';
import { validatePhone, validateAadhaar } from '../../lib/utils';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    aadhaar: '',
    ward: '',
    houseNo: '',
    phone: '',
    agreeToTerms: false,
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    if (!formData.aadhaar.trim()) {
      newErrors.aadhaar = 'Aadhaar number is required';
    } else if (!validateAadhaar(formData.aadhaar)) {
      newErrors.aadhaar = 'Aadhaar must be exactly 12 digits';
    }

    if (!formData.ward.trim()) {
      newErrors.ward = 'Ward number is required';
    }

    if (!formData.houseNo.trim()) {
      newErrors.houseNo = 'House number is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits starting with 6-9';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const result = await register({
      name: formData.name,
      address: formData.address,
      aadhaar: formData.aadhaar,
      ward: formData.ward,
      houseNo: formData.houseNo,
      phone: formData.phone,
    });

    if (result.success) {
      showToast.success('Registration successful! Please login with your Member ID and Aadhaar.');
      navigate('/login');
    } else {
      showToast.error(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header */}
        <div className="text-center space-y-1 mb-2">
          <h2 className="text-xl font-bold text-neutral-900">
            Create Account
          </h2>
          <p className="text-sm text-neutral-600">
            Join our community today
          </p>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <UserIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ahmed Khan"
              autoFocus
              autoComplete="name"
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600"
            >
              {errors.name}
            </motion.p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <HomeIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House No 74, Kalloor Village, Kerala"
              autoComplete="street-address"
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>
          {errors.address && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600"
            >
              {errors.address}
            </motion.p>
          )}
          <p className="text-xs text-neutral-500">Complete residential address</p>
        </div>

        {/* Aadhaar */}
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
          <p className="text-xs text-neutral-500">12-digit Aadhaar number (will be used as password)</p>
        </div>

        {/* Ward and House Number */}
        <div className="grid grid-cols-2 gap-4">
          {/* Ward */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              Ward Number
            </label>
            <input
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              placeholder="1"
              className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm"
            />
            {errors.ward && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-600"
              >
                {errors.ward}
              </motion.p>
            )}
          </div>

          {/* House Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              House Number
            </label>
            <input
              type="text"
              name="houseNo"
              value={formData.houseNo}
              onChange={handleChange}
              placeholder="74"
              className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm"
            />
            {errors.houseNo && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-600"
              >
                {errors.houseNo}
              </motion.p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <PhoneIcon className="h-5 w-5" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              autoComplete="tel"
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>
          {errors.phone && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600"
            >
              {errors.phone}
            </motion.p>
          )}
          <p className="text-xs text-neutral-500">10-digit Indian mobile number</p>
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="w-4 h-4 mt-0.5 text-emerald-600 border-neutral-300 rounded focus:ring-emerald-500 focus:ring-2"
            />
            <span className="text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors">
              I agree to the{' '}
              <Link
                to="/terms"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeToTerms && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600 ml-7"
            >
              {errors.agreeToTerms}
            </motion.p>
          )}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </span>
        </motion.button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-neutral-500">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <Link to="/login">
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3 rounded-lg font-medium text-neutral-700 border-2 border-neutral-300 hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Sign In Instead
          </motion.button>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
