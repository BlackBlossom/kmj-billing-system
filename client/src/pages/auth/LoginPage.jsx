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
        navigate('/dashboard');
      }
    } else {
      showToast.error(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Member ID Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Member ID
          </label>
          <div className="relative">
            <input
              type="text"
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              placeholder="1/74 or ADMIN/001"
              autoComplete="username"
              autoFocus
              className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm"
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
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
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
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="relative w-full py-3 rounded-lg font-medium text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {/* Button Background Gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-emerald-700 transition-all duration-300"></div>
          <div className="absolute inset-0 bg-linear-to-r from-emerald-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          
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
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-neutral-500">
              Don't have an account?
            </span>
          </div>
        </div>

        {/* Register Link */}
        <Link to="/register">
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3 rounded-lg font-medium text-neutral-700 border-2 border-neutral-300 hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200 shadow-sm"
          >
            Create Account
          </motion.button>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
