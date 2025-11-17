/**
 * Admin Profile Page
 * Display-only view of admin profile information (no edit functionality)
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Shield,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Avatar, Badge } from '../../components/common';
import useAuthStore from '../../store/authStore';
import api from '../../api/axios.config';
import toast from 'react-hot-toast';

const AdminProfilePage = () => {
  const { user } = useAuthStore();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/admin/profile');
      
      if (response.success) {
        setAdminData(response.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch admin profile:', error);
      toast.error(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const InfoField = ({ icon: Icon, label, value }) => {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-linear-to-br from-white to-[#E3F9F9]/30 border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="p-2 rounded-lg bg-linear-to-br from-[#31757A] to-[#41A4A7] shadow-sm">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-base font-semibold text-[#1F2E2E] wrap-break-word">
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

  const displayData = adminData || user;

  return (
    <AdminLayout>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-[#1F2E2E] via-[#31757A] to-[#41A4A7] bg-clip-text text-transparent">
              Admin Profile
            </h1>
            <p className="text-gray-600 mt-1">
              View your account information
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-br from-white to-[#E3F9F9]/30">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar
                    name={displayData?.name}
                    src={displayData?.avatar}
                    size="2xl"
                    className="ring-4 ring-[#E3F9F9] shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-linear-to-br from-green-400 to-green-500 shadow-lg ring-4 ring-white">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-[#1F2E2E] mb-1">
                  {displayData?.name || 'Administrator'}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  {displayData?.memberId && (
                    <>
                      Member ID: <span className="font-semibold text-[#31757A]">{displayData.memberId}</span>
                    </>
                  )}
                </p>

                <div className="w-full pt-4 border-t border-gray-200">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#E3F9F9]/30 transition-colors">
                      <span className="text-gray-600 font-medium">Ward</span>
                      <span className="font-bold text-[#1F2E2E]">{displayData?.ward || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#E3F9F9]/30 transition-colors">
                      <span className="text-gray-600 font-medium">Role</span>
                      <span className="font-bold text-[#1F2E2E] capitalize">{displayData?.role || 'Admin'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#E3F9F9]/30 transition-colors">
                      <span className="text-gray-600 font-medium">Status</span>
                      <Badge className="bg-green-100 text-green-700">
                        {displayData?.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#E3F9F9]/30 transition-colors">
                      <span className="text-gray-600 font-medium">Member Since</span>
                      <span className="font-bold text-[#1F2E2E]">
                        {displayData?.createdAt ? new Date(displayData.createdAt).getFullYear() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Information Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#31757A]" />
                <div>
                  <h2 className="text-lg font-bold text-[#1F2E2E]">
                    Personal Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Your contact and identification details
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  icon={User}
                  label="Full Name"
                  value={displayData?.name}
                />
                <InfoField
                  icon={Phone}
                  label="Phone Number"
                  value={displayData?.phone}
                />
                <InfoField
                  icon={Mail}
                  label="Email Address"
                  value={displayData?.email}
                />
                <InfoField
                  icon={MapPin}
                  label="Ward"
                  value={displayData?.ward}
                />
                <div className="md:col-span-2">
                  <InfoField
                    icon={MapPin}
                    label="Address"
                    value={displayData?.address}
                  />
                </div>
                <InfoField
                  icon={CreditCard}
                  label="Aadhaar Number"
                  value={displayData?.aadhaar}
                />
                <InfoField
                  icon={Calendar}
                  label="Account Created"
                  value={displayData?.createdAt ? new Date(displayData.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'N/A'}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
