/**
 * User Profile Page
 * View and edit user profile information
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  IdentificationIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Avatar, Badge } from '../../components/common';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import userService from '../../services/userService';

const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    ward: '',
    aadhaar: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      
      if (response.success) {
        const profileData = response.data.user;
        setUserData(profileData);
        setFormData({
          name: profileData.name || '',
          phone: profileData.phone || '',
          email: profileData.email || '',
          address: profileData.address || '',
          ward: profileData.ward || '',
          aadhaar: profileData.aadhaar || '',
        });
        // Update auth store with fresh data
        setUser(profileData);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error(error.message || 'Failed to load profile');
      // Fallback to stored user data
      if (user) {
        setUserData(user);
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          email: user.email || '',
          address: user.address || '',
          ward: user.ward || '',
          aadhaar: user.aadhaar || '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Axios interceptor already unwraps response.data
      const response = await userService.updateProfile(formData);
      if (response.success) {
        toast.success(response.message || 'Profile updated successfully!');
        setIsEditing(false);
        // Refresh profile data
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to current user data
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        email: userData.email || '',
        address: userData.address || '',
        ward: userData.ward || '',
        aadhaar: userData.aadhaar || '',
      });
    }
  };

  const InfoField = ({ icon: Icon, label, value, name }) => {
    if (isEditing) {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-colors"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <div className="p-2 rounded-lg bg-white">
          <Icon className="h-5 w-5 text-[#31757A]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-base font-semibold text-[#1F2E2E] truncate">
            {value || 'Not provided'}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#31757A]"></div>
        </div>
      </AdminLayout>
    );
  }

  const displayData = userData || user;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="p-1.5 sm:p-2 rounded-xl bg-linear-to-br from-[#31757A] to-[#41A4A7]">
            <UserCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#31757A] to-[#41A4A7] bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          View and manage your personal information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar
                  name={displayData?.name}
                  src={displayData?.avatar}
                  size="2xl"
                  className="ring-2 sm:ring-4 ring-[#E3F9F9] shadow-lg mb-3 sm:mb-4"
                />
                <h2 className="text-lg sm:text-xl font-bold text-[#1F2E2E] mb-1">
                  {displayData?.name || 'Member Name'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  Member ID: <span className="font-semibold text-[#31757A]">{displayData?.memberId || 'N/A'}</span>
                </p>
                <Badge className="bg-green-100 text-green-700 mb-4">
                  Active Member
                </Badge>

                <div className="w-full pt-4 border-t border-gray-100">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Ward</span>
                      <span className="font-semibold text-[#1F2E2E]">{displayData?.ward || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Role</span>
                      <span className="font-semibold text-[#1F2E2E] capitalize">{displayData?.role || 'User'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-semibold text-[#1F2E2E]">
                        {displayData?.createdAt ? new Date(displayData.createdAt).getFullYear() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Information Card */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1F2E2E] mb-1">
                    Personal Information
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {isEditing ? 'Update your personal details' : 'Your contact and identification information'}
                  </p>
                </div>
                {!isEditing && (
                  <Button
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="bg-[#31757A] hover:bg-[#41A4A7]"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <InfoField
                  icon={UserCircleIcon}
                  label="Full Name"
                  value={formData.name}
                  name="name"
                />
                <InfoField
                  icon={PhoneIcon}
                  label="Phone Number"
                  value={formData.phone}
                  name="phone"
                />
                <InfoField
                  icon={EnvelopeIcon}
                  label="Email Address"
                  value={formData.email}
                  name="email"
                />
                <InfoField
                  icon={MapPinIcon}
                  label="Ward"
                  value={formData.ward}
                  name="ward"
                />
                <div className="md:col-span-2">
                  <InfoField
                    icon={MapPinIcon}
                    label="Address"
                    value={formData.address}
                    name="address"
                  />
                </div>
                <InfoField
                  icon={IdentificationIcon}
                  label="Aadhaar Number"
                  value={formData.aadhaar}
                  name="aadhaar"
                />
              </div>

              {isEditing && (
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#31757A] hover:bg-[#41A4A7]"
                  >
                    <CheckIcon className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <XMarkIcon className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProfilePage;
