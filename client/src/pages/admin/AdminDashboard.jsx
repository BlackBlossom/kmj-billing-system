/**
 * Admin Dashboard Page
 * Main dashboard for administrators
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  HomeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BellIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, Button, Badge, Avatar, Skeleton } from '../../components/common';
import { ANIMATION_VARIANTS, COLORS } from '../../lib/constants';
import { formatCurrency, formatDate } from '../../lib/utils';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalFamilies: 0,
    totalBills: 0,
    totalRevenue: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingNotices, setUpcomingNotices] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalMembers: 3251,
        totalFamilies: 847,
        totalBills: 1523,
        totalRevenue: 2847500,
      });

      setRecentActivity([
        {
          id: 1,
          type: 'member',
          message: 'New member registered: Ahmed Khan',
          time: '5 minutes ago',
          icon: UsersIcon,
        },
        {
          id: 2,
          type: 'bill',
          message: 'Bill payment received: ₹5,000',
          time: '15 minutes ago',
          icon: CurrencyDollarIcon,
        },
        {
          id: 3,
          type: 'notice',
          message: 'Notice published: Monthly Meeting',
          time: '1 hour ago',
          icon: BellIcon,
        },
        {
          id: 4,
          type: 'member',
          message: 'Member profile updated: Fatima Ali',
          time: '2 hours ago',
          icon: UsersIcon,
        },
      ]);

      setUpcomingNotices([
        {
          id: 1,
          title: 'Monthly Committee Meeting',
          date: '2025-11-05',
          priority: 'urgent',
        },
        {
          id: 2,
          title: 'Annual General Body Meeting',
          date: '2025-11-15',
          priority: 'high',
        },
        {
          id: 3,
          title: 'Community Iftar Program',
          date: '2025-11-20',
          priority: 'normal',
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      change: '+12%',
      icon: UsersIcon,
      color: COLORS.primary[600],
      bgColor: COLORS.primary[50],
    },
    {
      title: 'Total Families',
      value: stats.totalFamilies,
      change: '+8%',
      icon: HomeIcon,
      color: COLORS.accent[600],
      bgColor: COLORS.accent[50],
    },
    {
      title: 'Total Bills',
      value: stats.totalBills,
      change: '+15%',
      icon: DocumentTextIcon,
      color: COLORS.success[600],
      bgColor: COLORS.success[50],
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: '+23%',
      icon: CurrencyDollarIcon,
      color: COLORS.warning[600],
      bgColor: COLORS.warning[50],
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        variants={ANIMATION_VARIANTS.fadeIn}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={ANIMATION_VARIANTS.stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={ANIMATION_VARIANTS.slideUp}>
            <Card hover className="h-full">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 mt-2">
                    {loading ? <Skeleton className="h-8 w-24" /> : stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-success-600" />
                    <span className="text-sm text-success-600 font-medium">
                      {stat.change}
                    </span>
                    <span className="text-sm text-neutral-500">vs last month</span>
                  </div>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideUp}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <Card>
          <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
            <Card.Description>Frequently used actions</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="primary"
                leftIcon={<PlusIcon className="h-5 w-5" />}
                fullWidth
              >
                Add Member
              </Button>
              <Button
                variant="primary"
                leftIcon={<PlusIcon className="h-5 w-5" />}
                fullWidth
              >
                Create Bill
              </Button>
              <Button
                variant="primary"
                leftIcon={<PlusIcon className="h-5 w-5" />}
                fullWidth
              >
                Post Notice
              </Button>
              <Button
                variant="outline"
                leftIcon={<DocumentTextIcon className="h-5 w-5" />}
                fullWidth
              >
                View Reports
              </Button>
            </div>
          </Card.Content>
        </Card>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          variants={ANIMATION_VARIANTS.slideLeft}
          initial="hidden"
          animate="visible"
        >
          <Card className="h-full">
            <Card.Header>
              <Card.Title>Recent Activity</Card.Title>
              <Card.Description>Latest updates and changes</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))
                  : recentActivity.map((activity) => (
                      <motion.div
                        key={activity.id}
                        variants={ANIMATION_VARIANTS.fadeIn}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-primary-50">
                          <activity.icon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-neutral-900">
                            {activity.message}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
              </div>
            </Card.Content>
            <Card.Footer>
              <Button variant="ghost" size="sm">
                View All Activity
              </Button>
            </Card.Footer>
          </Card>
        </motion.div>

        {/* Upcoming Notices */}
        <motion.div
          variants={ANIMATION_VARIANTS.slideRight}
          initial="hidden"
          animate="visible"
        >
          <Card className="h-full">
            <Card.Header>
              <Card.Title>Upcoming Notices</Card.Title>
              <Card.Description>Important dates and events</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-4 border border-neutral-200 rounded-lg">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))
                  : upcomingNotices.map((notice) => (
                      <motion.div
                        key={notice.id}
                        variants={ANIMATION_VARIANTS.fadeIn}
                        className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-neutral-900">
                              {notice.title}
                            </h4>
                            <p className="text-xs text-neutral-500 mt-1">
                              {formatDate(notice.date, 'PPP')}
                            </p>
                          </div>
                          <Badge priority={notice.priority} size="sm">
                            {notice.priority}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
              </div>
            </Card.Content>
            <Card.Footer>
              <Button variant="ghost" size="sm">
                View All Notices
              </Button>
            </Card.Footer>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
