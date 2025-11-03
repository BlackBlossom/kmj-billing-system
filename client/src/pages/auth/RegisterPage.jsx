/**
 * Register Page - New Color Palette Design
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
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Header */}
        <div className="text-center space-y-2 mb-4">
          <h2 className="text-2xl font-bold bg-linear-to-r from-[#1F2E2E] to-[#31757A] bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Join our community today
          </p>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1F2E2E] tracking-wide">
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#31757A] transition-colors">
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
              className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-[#1F2E2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] focus:shadow-lg focus:shadow-[#31757A]/20 transition-all duration-200 shadow-sm group-hover:border-gray-300"
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
          <label className="block text-sm font-bold text-[#1F2E2E] tracking-wide">
            Address
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#31757A] transition-colors">
              <HomeIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street"
              autoComplete="street-address"
              className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-[#1F2E2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] focus:shadow-lg focus:shadow-[#31757A]/20 transition-all duration-200 shadow-sm group-hover:border-gray-300"
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
          <p className="text-xs text-gray-500">Complete residential address</p>
        </div>

        {/* Aadhaar */}
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
          <p className="text-xs text-gray-500">12-digit Aadhaar number (will be used as password)</p>
        </div>

        {/* Ward and House Number */}
        <div className="grid grid-cols-2 gap-4">
          {/* Ward */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1F2E2E] tracking-wide">
              Ward Number
            </label>
            <div className="group">
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                placeholder="1"
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-[#1F2E2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] focus:shadow-lg focus:shadow-[#31757A]/20 transition-all duration-200 shadow-sm group-hover:border-gray-300"
              />
            </div>
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
            <label className="block text-sm font-bold text-[#1F2E2E] tracking-wide">
              House Number
            </label>
            <div className="group">
              <input
                type="text"
                name="houseNo"
                value={formData.houseNo}
                onChange={handleChange}
                placeholder="42"
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-[#1F2E2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] focus:shadow-lg focus:shadow-[#31757A]/20 transition-all duration-200 shadow-sm group-hover:border-gray-300"
              />
            </div>
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
          <label className="block text-sm font-bold text-[#1F2E2E] tracking-wide">
            Phone Number
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#31757A] transition-colors">
              <PhoneIcon className="h-5 w-5" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              autoComplete="tel"
              className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-[#1F2E2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] focus:shadow-lg focus:shadow-[#31757A]/20 transition-all duration-200 shadow-sm group-hover:border-gray-300"
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
          <p className="text-xs text-gray-500">10-digit Indian mobile number</p>
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="w-4 h-4 mt-0.5 text-[#31757A] border-gray-200 rounded focus:ring-[#31757A] focus:ring-2"
            />
            <span className="text-sm text-[#1F2E2E] group-hover:text-[#31757A] transition-colors">
              I agree to the{' '}
              <Link
                to="/terms"
                className="text-[#31757A] hover:text-[#41A4A7] font-semibold"
              >
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                className="text-[#31757A] hover:text-[#41A4A7] font-semibold"
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
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-gray-500 font-medium">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Link 
            to="/login" 
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-[#31757A] border-2 border-[#31757A] hover:bg-[#E3F9F9] hover:border-[#41A4A7] transition-all duration-200 shadow-sm hover:shadow-lg"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Sign In Instead
          </Link>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default RegisterPage;
