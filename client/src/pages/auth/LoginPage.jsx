/**
 * Login Page
 * Aceternity-inspired minimal authentication
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import AuthLayout from '../../components/layout/AuthLayout';
import showToast from '../../components/common/Toast';
import useAuthStore from '../../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    memberId: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.memberId.trim()) {
      newErrors.memberId = 'Member ID is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const result = await login({
      memberId: formData.memberId,
      password: formData.password,
    });

    if (result.success) {
      showToast.success('Login successful!');
      if (result.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } else {
      showToast.error(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Member ID Input */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#1F2E2E] tracking-wide">
            Member ID
          </label>
          <div className="relative group">
            <input
              type="text"
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              placeholder="1/74 or ADMIN/001"
              autoComplete="username"
              autoFocus
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-[#1F2E2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] focus:shadow-lg focus:shadow-[#31757A]/20 transition-all duration-200 shadow-sm group-hover:border-gray-300"
            />
            {errors.memberId && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-600 mt-1"
              >
                {errors.memberId}
              </motion.p>
            )}
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2 mb-10">
          <label className="block text-sm font-bold text-[#1F2E2E] tracking-wide">
            Password
          </label>
          <div className="relative group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-[#1F2E2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] focus:shadow-lg focus:shadow-[#31757A]/20 transition-all duration-200 shadow-sm pr-12 group-hover:border-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#31757A] transition-all duration-200 hover:scale-110"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-600 mt-1"
              >
                {errors.password}
              </motion.p>
            )}
          </div>
        </div>

        {/* Forgot Password Link */}
        {/* <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-[#31757A] hover:text-[#41A4A7] font-semibold transition-colors duration-200 hover:underline"
          >
            Forgot password?
          </Link>
        </div> */}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative w-full py-4 rounded-xl font-bold text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all duration-200"
        >
          {/* Enhanced Button Background Gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-[#31757A] via-[#41A4A7] to-[#31757A] transition-all duration-300"></div>
          <div className="absolute inset-0 bg-linear-to-r from-[#41A4A7] via-[#31757A] to-[#41A4A7] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Button Content */}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LockClosedIcon className="h-5 w-5" />
                <span>Sign In</span>
              </>
            )}
          </span>
        </motion.button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-transparent text-gray-500 font-medium">
              Don't have an account?
            </span>
          </div>
        </div>

        {/* Register Link */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Link 
            to="/register" 
            className="block w-full py-4 rounded-xl font-bold text-[#31757A] border-2 border-[#31757A] hover:bg-[#E3F9F9] hover:border-[#41A4A7] transition-all duration-200 shadow-sm hover:shadow-lg text-center"
          >
            Create Account
          </Link>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default LoginPage;
