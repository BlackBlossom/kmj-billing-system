/**
 * Admin Hub Page
 * Central hub with quick actions and member search
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  BoltIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  UserPlusIcon,
  DocumentPlusIcon,
  BellAlertIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/layout/AdminLayout';
import { Skeleton, Card } from '../../components/common';
import { ANIMATION_VARIANTS } from '../../lib/constants';
import { getAllMembers } from '../../services/memberService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Quick action cards configuration
  const quickActions = [
    {
      id: 'members',
      title: 'Member Management',
      description: 'View, add, and manage member records',
      icon: UsersIcon,
      gradient: 'from-[#31757A] to-[#41A4A7]',
      actions: [
        { label: 'View All Members', icon: UsersIcon, path: '/admin/members' },
        { label: 'Add New Member', icon: UserPlusIcon, path: '/admin/members?action=add' },
      ],
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      description: 'Manage bills and process payments',
      icon: CurrencyDollarIcon,
      gradient: 'from-[#41A4A7] to-[#31757A]',
      actions: [
        { label: 'View All Bills', icon: DocumentTextIcon, path: '/admin/bills' },
        { label: 'Quick Payment', icon: CreditCardIcon, path: '/admin/quick-pay' },
      ],
    },
    {
      id: 'notices',
      title: 'Notices & Announcements',
      description: 'Post and manage community notices',
      icon: BellIcon,
      gradient: 'from-[#1F2E2E] to-[#31757A]',
      actions: [
        { label: 'View All Notices', icon: BellIcon, path: '/admin/notices' },
        { label: 'Create Notice', icon: DocumentPlusIcon, path: '/admin/notices?action=create' },
      ],
    },
    // {
    //   id: 'reports',
    //   title: 'Reports & Analytics',
    //   description: 'View reports and statistics',
    //   icon: ChartBarIcon,
    //   gradient: 'from-[#31757A] to-[#1F2E2E]',
    //   actions: [
    //     { label: 'Financial Reports', icon: ChartBarIcon, path: '/admin/reports' },
    //     { label: 'Member Statistics', icon: UsersIcon, path: '/admin/reports?type=members' },
    //   ],
    // },
  ];

  // Search members with debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const response = await getAllMembers({ 
          search: searchQuery, 
          limit: 8,
          page: 1 
        });
        setSearchResults(response.data.members || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Failed to search members');
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleMemberClick = (memberId) => {
    navigate(`/admin/members?view=${memberId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <motion.div
        variants={ANIMATION_VARIANTS.fadeIn}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <SparklesIcon className="h-8 w-8 text-[#31757A]" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-[#1F2E2E] via-[#31757A] to-[#41A4A7] bg-clip-text text-transparent leading-relaxed">
              Admin Hub
            </h1>
          </div>
          <p className="text-gray-600 text-sm">
            Your central command center for managing members, billing, notices, and more
          </p>
        </div>
      </motion.div>

      {/* Search Section */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideDown}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <Card className="border-0 shadow-lg">
          <Card.Content className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MagnifyingGlassIcon className="h-6 w-6 text-[#31757A]" />
              <h2 className="text-lg font-bold text-[#1F2E2E]">Quick Member Search</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Search for members by name, Mahal ID, or phone number
            </p>

            <div className="relative">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members by name, Mahal ID, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31757A]/20 focus:border-[#31757A] transition-all text-gray-900 placeholder-gray-500"
                />
                {searching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#31757A] border-t-transparent" />
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-600">
                      {searchResults.length} member{searchResults.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.map((member) => (
                      <button
                        key={member._id}
                        onClick={() => handleMemberClick(member._id)}
                        className="w-full p-4 hover:bg-[#E3F9F9]/50 transition-colors text-left flex items-center justify-between group border-b border-gray-50 last:border-0"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-[#1F2E2E] group-hover:text-[#31757A] transition-colors">
                            {member.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-600">
                              Mahal ID: {member.mahalId}
                            </span>
                            {member.phone && (
                              <span className="text-xs text-gray-600">
                                • {member.phone}
                              </span>
                            )}
                          </div>
                        </div>
                        <EyeIcon className="h-5 w-5 text-gray-400 group-hover:text-[#31757A] transition-colors" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {showResults && searchResults.length === 0 && !searching && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 p-8 text-center z-50"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No members found</p>
                  <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
                </motion.div>
              )}
            </div>
          </Card.Content>
        </Card>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        variants={ANIMATION_VARIANTS.stagger}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <BoltIcon className="h-6 w-6 text-[#31757A]" />
          <h2 className="text-xl font-bold text-[#1F2E2E]">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((section, index) => (
            <motion.div
              key={section.id}
              variants={ANIMATION_VARIANTS.slideUp}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Card.Content className="p-6">
                  {/* Section Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-4 rounded-xl bg-linear-to-br ${section.gradient} shadow-lg`}>
                      <section.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#1F2E2E] mb-1">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 gap-3">
                    {section.actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => handleQuickAction(action.path)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-gray-50 to-white border-2 border-gray-100 hover:border-[#31757A]/30 hover:shadow-md transition-all duration-200 group/btn"
                      >
                        <action.icon className="h-5 w-5 text-[#31757A] group-hover/btn:scale-110 transition-transform" />
                        <span className="font-semibold text-[#1F2E2E] group-hover/btn:text-[#31757A] transition-colors">
                          {action.label}
                        </span>
                        <svg
                          className="ml-auto h-5 w-5 text-gray-400 group-hover/btn:text-[#31757A] group-hover/btn:translate-x-1 transition-all"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Help Section */}
      {/* <motion.div
        variants={ANIMATION_VARIANTS.fadeIn}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-0 shadow-lg bg-linear-to-br from-[#E3F9F9]/30 to-white">
          <Card.Content className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <BellAlertIcon className="h-6 w-6 text-[#31757A]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1F2E2E] mb-2">
                  Need Help?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Use the search bar above to quickly find any member, or use the quick action cards to navigate to different sections. Each section provides detailed management capabilities for members, billing, notices, and reports.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#31757A] hover:text-[#31757A] transition-colors text-sm font-semibold shadow-sm">
                    View Documentation
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#31757A] hover:text-[#31757A] transition-colors text-sm font-semibold shadow-sm">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </motion.div> */}
    </AdminLayout>
  );
};

export default AdminDashboard;
