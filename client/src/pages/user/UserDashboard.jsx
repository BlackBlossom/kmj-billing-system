/**
 * User Dashboard Page
 * Main dashboard for regular users - Modern Design
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  UsersIcon,
  DocumentTextIcon,
  BellIcon,
  CreditCardIcon,
  HomeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChartBarIcon,
  CalendarIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Badge, Avatar } from '../../components/common';
import { formatCurrency, formatDate } from '../../lib/utils';
import useAuthStore from '../../store/authStore';
import userService from '../../services/userService';
import familyService from '../../services/familyService';
import axiosInstance from '../../api/axios.config';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    familyMembers: 0,
    totalBills: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [recentBills, setRecentBills] = useState([]);
  const [notices, setNotices] = useState([]);
  const [showAllNotices, setShowAllNotices] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // URL encode memberId to handle forward slashes (e.g., "1/2" -> "1%2F2")
      const encodedMemberId = encodeURIComponent(user?.memberId || '');
      
      // Fetch all data in parallel
      const [profileResponse, familyResponse, billsResponse, noticesResponse] = await Promise.all([
        userService.getProfile(),
        familyService.getAll(),
        axiosInstance.get(`/bills/member/${encodedMemberId}`),
        axiosInstance.get('/notices', { params: { limit: 5, page: 1 } })
      ]);

      // Process family data from dedicated family service
      if (familyResponse.success) {
        const members = familyResponse.data.members || [];
        setFamilyMembers(members);
      }

      // Process bills data
      let paidAmount = 0;
      let pendingAmount = 0;
      let allBills = [];
      
      if (billsResponse.data?.success) {
        allBills = billsResponse.data.data?.bills || [];
        
        allBills.forEach(bill => {
          const amount = parseFloat(bill.amount) || 0;
          if (bill.status === 'paid') {
            paidAmount += amount;
          } else {
            pendingAmount += amount;
          }
        });
        
        // Transform bills for display
        const transformedBills = allBills.slice(0, 5).map(bill => ({
          id: bill._id,
          accountType: bill.type || 'General',
          amount: bill.amount,
          status: bill.status || 'pending',
          date: bill.Date_time,
          receiptNo: bill.receiptNo || 'N/A'
        }));
        
        setRecentBills(transformedBills);
      }

      // Update stats
      setStats({
        familyMembers: familyResponse.success ? (familyResponse.data.members?.length || 0) : 0,
        totalBills: allBills.length,
        paidAmount,
        pendingAmount
      });

      // Process notices data (axios interceptor already unwraps response.data)
      if (noticesResponse.success) {
        const noticesData = noticesResponse.data?.notices || [];
        const transformedNotices = noticesData.map(notice => ({
          id: notice._id,
          title: notice.title,
          content: notice.content || notice.message || 'No content',
          date: notice.createdAt,
          priority: notice.priority || 'normal',
        }));
        setNotices(transformedNotices);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Set empty data on error
      setStats({
        familyMembers: 0,
        totalBills: 0,
        paidAmount: 0,
        pendingAmount: 0,
      });
      setFamilyMembers([]);
      setRecentBills([]);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Family Members',
      value: stats.familyMembers,
      icon: UsersIcon,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Bills',
      value: stats.totalBills,
      icon: DocumentTextIcon,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Amount Paid',
      value: formatCurrency(stats.paidAmount),
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Pending Amount',
      value: formatCurrency(stats.pendingAmount),
      icon: ClockIcon,
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="p-1.5 sm:p-2 rounded-xl bg-linear-to-br from-[#31757A] to-[#41A4A7]">
            <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#31757A] to-[#41A4A7] bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Welcome back, <span className="font-semibold text-[#1F2E2E]">{user?.name || 'Member'}</span>! Here's your account overview.
        </p>
      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-[#1F2E2E]">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              {/* Gradient Border Bottom 
              <div className={`h-1 bg-linear-to-r ${stat.gradient}`}></div>
            </Card>
          </motion.div>
        ))}
      </div> */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#31757A]" />
                <h2 className="text-base sm:text-lg font-bold text-[#1F2E2E]">Profile Information</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Your personal details and contact information</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex justify-center sm:justify-start">
                  <Avatar
                    name={user?.name || 'User'}
                    src={user?.avatar}
                    size="2xl"
                    className="ring-2 sm:ring-4 ring-[#E3F9F9] shadow-lg"
                  />
                </div>
                <div className="flex-1 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</label>
                      <p className="text-sm sm:text-base font-semibold text-[#1F2E2E] mt-1">{user?.memberId || '1/10'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                      <p className="text-sm sm:text-base font-semibold text-[#1F2E2E] mt-1">{user?.name || 'Member Name'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                      <p className="text-sm sm:text-base font-semibold text-[#1F2E2E] mt-1 flex items-center gap-1.5 sm:gap-2">
                        <PhoneIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#31757A]" />
                        {user?.phone || '9876543210'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                      <p className="text-sm sm:text-base font-semibold text-[#1F2E2E] mt-1 flex items-center gap-1.5 sm:gap-2 truncate">
                        <EnvelopeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#31757A]" />
                        <span className="truncate">{user?.email || 'member@kmj.local'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/user/profile')}
                      className="border-[#31757A] text-[#31757A] hover:bg-[#E3F9F9]"
                    >
                      <UserCircleIcon className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Family Members */}
          <Card>
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#31757A]" />
                    <h2 className="text-base sm:text-lg font-bold text-[#1F2E2E]">Family Members</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{familyMembers.length} members registered</p>
                </div>
                <Button size="sm" className="bg-[#31757A] hover:bg-[#41A4A7] w-full sm:w-auto">
                  Add Member
                </Button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {loading ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    Loading family members...
                  </div>
                ) : familyMembers.length === 0 ? (
                  <div className="col-span-2 text-center py-8">
                    <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No family members added yet</p>
                    <Button 
                      size="sm" 
                      className="mt-4 bg-[#31757A] hover:bg-[#41A4A7]"
                      onClick={() => navigate('/user/family')}
                    >
                      Add First Member
                    </Button>
                  </div>
                ) : (
                  familyMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#31757A] hover:shadow-md transition-all duration-200 cursor-pointer group"
                      onClick={() => navigate('/user/family')}
                    >
                      <Avatar name={member.Fname} size="lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1F2E2E] truncate group-hover:text-[#31757A] transition-colors">
                          {member.Fname}
                        </p>
                        <p className="text-xs text-gray-600">
                          {member.Relation} • {member.age || 'N/A'} years • {member.Gender}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Notices */}
          <Card>
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#31757A]" />
                <h2 className="text-base sm:text-lg font-bold text-[#1F2E2E]">Announcements</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Important updates</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading announcements...
                  </div>
                ) : notices.length === 0 ? (
                  <div className="text-center py-8">
                    <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No announcements yet</p>
                    <p className="text-sm text-gray-500 mt-1">Check back later for updates</p>
                  </div>
                ) : (
                  (showAllNotices ? notices : notices.slice(0, 2)).map((notice) => (
                    <div
                      key={notice.id}
                      className="p-4 rounded-xl border border-gray-200 hover:border-[#31757A] hover:shadow-md transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${
                          notice.priority === 'urgent' ? 'bg-red-100' :
                          notice.priority === 'high' ? 'bg-orange-100' :
                          'bg-blue-100'
                        }`}>
                          {notice.priority === 'urgent' ? (
                            <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                          ) : (
                            <BellIcon className={`w-4 h-4 ${
                              notice.priority === 'high' ? 'text-orange-600' : 'text-blue-600'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#1F2E2E] group-hover:text-[#31757A] transition-colors line-clamp-1">
                            {notice.title}
                          </h4>
                        </div>
                      </div>
                      <div 
                        className="text-xs text-gray-600 line-clamp-2 mb-2"
                        dangerouslySetInnerHTML={{ __html: notice.content }}
                      />
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {formatDate(notice.date)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            {notices.length > 2 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
              <Button
                size="sm"
                variant="outline"
                fullWidth
                onClick={() => setShowAllNotices(!showAllNotices)}
                className="border-[#31757A] text-[#31757A] hover:bg-[#E3F9F9]"
              >
                {showAllNotices ? 'Show Less' : `View All Announcements (${notices.length})`}
              </Button>
            </div>)}
          </Card>

          {/* Recent Bills *
          <Card>
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#31757A]" />
                    <h2 className="text-base sm:text-lg font-bold text-[#1F2E2E]">Recent Transactions</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Your latest billing history</p>
                </div>
                <Button size="sm" variant="outline" className="border-[#31757A] text-[#31757A] hover:bg-[#E3F9F9] w-full sm:w-auto">
                  View All
                </Button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading bills...
                  </div>
                ) : recentBills.length === 0 ? (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No bills found</p>
                  </div>
                ) : (
                  recentBills.map((bill) => (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#31757A] hover:shadow-md transition-all duration-200 cursor-pointer group"
                      onClick={() => navigate('/user/bills')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          bill.status === 'paid' ? 'bg-green-50' : 'bg-orange-50'
                        }`}>
                          {bill.status === 'paid' ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          ) : (
                            <ClockIcon className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1F2E2E] group-hover:text-[#31757A] transition-colors">
                            {bill.accountType}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {bill.receiptNo} • {formatDate(bill.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-[#1F2E2E]">
                          {formatCurrency(bill.amount)}
                        </p>
                        <Badge
                          className={`mt-1 ${
                            bill.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {bill.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>           */}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDashboard;
