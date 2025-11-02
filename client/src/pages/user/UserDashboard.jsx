/**
 * User Dashboard Page
 * Main dashboard for regular users
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  UsersIcon,
  DocumentTextIcon,
  BellIcon,
  EyeIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Avatar, Skeleton, AvatarGroup } from '../../components/common';
import { ANIMATION_VARIANTS } from '../../lib/constants';
import { formatCurrency, formatDate, formatMemberId } from '../../lib/utils';
import useAuthStore from '../../store/authStore';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [recentBills, setRecentBills] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfile({
        name: user?.name || 'Ahmed Khan',
        memberId: '1/74',
        ward: 1,
        house: 74,
        phone: '9876543210',
        email: user?.email || 'ahmed.khan@example.com',
        aadhaar: '1234 5678 9012',
        familyMembers: 4,
        totalBills: 12,
        totalPaid: 45000,
      });

      setFamilyMembers([
        {
          id: 1,
          name: 'Ahmed Khan',
          relation: 'Head',
          age: 45,
          gender: 'Male',
          avatar: null,
        },
        {
          id: 2,
          name: 'Fatima Khan',
          relation: 'Spouse',
          age: 40,
          gender: 'Female',
          avatar: null,
        },
        {
          id: 3,
          name: 'Ayesha Khan',
          relation: 'Daughter',
          age: 15,
          gender: 'Female',
          avatar: null,
        },
        {
          id: 4,
          name: 'Omar Khan',
          relation: 'Son',
          age: 12,
          gender: 'Male',
          avatar: null,
        },
      ]);

      setRecentBills([
        {
          id: 1,
          receiptNo: 'RCP-2024-001',
          accountType: 'Dua_Friday',
          amount: 5000,
          date: '2024-10-15',
          status: 'paid',
        },
        {
          id: 2,
          receiptNo: 'RCP-2024-002',
          accountType: 'Donation',
          amount: 10000,
          date: '2024-10-20',
          status: 'paid',
        },
        {
          id: 3,
          receiptNo: 'RCP-2024-003',
          accountType: 'Marriage Fee',
          amount: 15000,
          date: '2024-10-25',
          status: 'pending',
        },
      ]);

      setNotices([
        {
          id: 1,
          title: 'Monthly Committee Meeting',
          date: '2025-11-05',
          priority: 'urgent',
        },
        {
          id: 2,
          title: 'Community Iftar Program',
          date: '2025-11-20',
          priority: 'normal',
        },
      ]);

      setLoading(false);
    }, 1000);
  }, [user]);

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        variants={ANIMATION_VARIANTS.fadeIn}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-neutral-900">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-neutral-600 mt-1">
          Here's your account overview and recent activity.
        </p>
      </motion.div>

      {/* Profile Summary Card */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideDown}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <Card gradient>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <Avatar
              name={profile?.name}
              src={user?.avatar}
              size="2xl"
              className="ring-4 ring-white shadow-lg"
            />

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-900">
                {loading ? <Skeleton className="h-8 w-48" /> : profile?.name}
              </h2>
              <p className="text-neutral-600 mt-1">
                {loading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  `Member ID: ${formatMemberId(profile?.ward, profile?.house)}`
                )}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-sm text-neutral-600">Family Members</p>
                  <p className="text-xl font-bold text-neutral-900">
                    {loading ? <Skeleton className="h-6 w-8" /> : profile?.familyMembers}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Total Bills</p>
                  <p className="text-xl font-bold text-neutral-900">
                    {loading ? <Skeleton className="h-6 w-8" /> : profile?.totalBills}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Total Paid</p>
                  <p className="text-xl font-bold text-neutral-900">
                    {loading ? (
                      <Skeleton className="h-6 w-20" />
                    ) : (
                      formatCurrency(profile?.totalPaid)
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex sm:flex-col gap-2">
              <Button
                variant="primary"
                leftIcon={<UserCircleIcon className="h-5 w-5" />}
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                leftIcon={<EyeIcon className="h-5 w-5" />}
              >
                View Details
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Family Members */}
          <motion.div
            variants={ANIMATION_VARIANTS.slideLeft}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div>
                    <Card.Title>Family Members</Card.Title>
                    <Card.Description>
                      {familyMembers.length} members in your family
                    </Card.Description>
                  </div>
                  <Button variant="ghost" size="sm">
                    Add Member
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      ))
                    : familyMembers.map((member) => (
                        <motion.div
                          key={member.id}
                          variants={ANIMATION_VARIANTS.fadeIn}
                          className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                        >
                          <Avatar name={member.name} src={member.avatar} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {member.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {member.relation} • {member.age} years
                            </p>
                          </div>
                        </motion.div>
                      ))}
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Recent Bills */}
          <motion.div
            variants={ANIMATION_VARIANTS.slideLeft}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div>
                    <Card.Title>Recent Bills</Card.Title>
                    <Card.Description>Your last 5 transactions</Card.Description>
                  </div>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-6 w-20" />
                        </div>
                      ))
                    : recentBills.map((bill) => (
                        <motion.div
                          key={bill.id}
                          variants={ANIMATION_VARIANTS.fadeIn}
                          className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary-50">
                              <CreditCardIcon className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                {bill.accountType}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {bill.receiptNo} • {formatDate(bill.date)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-neutral-900">
                              {formatCurrency(bill.amount)}
                            </p>
                            <Badge
                              status={bill.status}
                              size="sm"
                              className="mt-1"
                            >
                              {bill.status}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Notices */}
          <motion.div
            variants={ANIMATION_VARIANTS.slideRight}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <Card.Header>
                <Card.Title>Important Notices</Card.Title>
                <Card.Description>Stay updated</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {loading
                    ? Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="p-3 border border-neutral-200 rounded-lg">
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      ))
                    : notices.map((notice) => (
                        <motion.div
                          key={notice.id}
                          variants={ANIMATION_VARIANTS.fadeIn}
                          className="p-3 border border-neutral-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <BellIcon className="h-4 w-4 text-primary-600 mt-0.5" />
                            <h4 className="text-sm font-medium text-neutral-900 flex-1">
                              {notice.title}
                            </h4>
                          </div>
                          <p className="text-xs text-neutral-500">
                            {formatDate(notice.date, 'PPP')}
                          </p>
                        </motion.div>
                      ))}
                </div>
              </Card.Content>
              <Card.Footer>
                <Button variant="ghost" size="sm" fullWidth>
                  View All Notices
                </Button>
              </Card.Footer>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={ANIMATION_VARIANTS.slideRight}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <Card.Header>
                <Card.Title>Quick Actions</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    leftIcon={<UserCircleIcon className="h-5 w-5" />}
                    fullWidth
                  >
                    Update Profile
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<UsersIcon className="h-5 w-5" />}
                    fullWidth
                  >
                    Add Family Member
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<DocumentTextIcon className="h-5 w-5" />}
                    fullWidth
                  >
                    View All Bills
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
