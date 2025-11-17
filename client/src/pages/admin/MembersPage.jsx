/**
 * Members Page
 * Admin page for managing members/census
 * Displays all members with search, filtering, and CRUD operations
 */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  UsersIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Badge, Input, Skeleton } from '../../components/common';
import { ANIMATION_VARIANTS } from '../../lib/constants';
import { formatDate, formatMemberId, cn } from '../../lib/utils';
import { getAllMembers, searchMembers, deleteMember, getMemberCount } from '../../services/memberService';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import MemberDetailModal from '../../components/modals/MemberDetailModal';

const MembersPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false); // Track if we're in search mode
  const [filterWard, setFilterWard] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterRelation, setFilterRelation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20, // Show 20 members per page for better UX
    total: 0,
    totalPages: 0,
  });

  // Step 1: Get total count to calculate total pages
  const fetchMemberCount = async () => {
    try {
      const filters = {
        ...(filterWard && { ward: filterWard }),
        ...(filterGender && { gender: filterGender }),
        ...(filterRelation && { relation: filterRelation }),
      };

      const response = await getMemberCount(filters);
      const { totalMembers, totalPages } = response.data;

      setPagination(prev => ({
        ...prev,
        total: totalMembers,
        totalPages: totalPages,
      }));
    } catch (error) {
      console.error('Error fetching member count:', error);
    }
  };

  // Step 2: Fetch members for current page only
  const fetchCurrentPage = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filterWard && { ward: filterWard }),
        ...(filterGender && { gender: filterGender }),
        ...(filterRelation && { relation: filterRelation }),
      };

      const response = await getAllMembers(params);
      setMembers(response.data.members);
      setIsSearching(false);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Search across ALL members (server-side search)
  const performSearch = async (query) => {
    if (!query || query.trim().length === 0) {
      // If search is cleared, go back to normal pagination
      setIsSearching(false);
      fetchCurrentPage();
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);

      const response = await searchMembers(query, 'all');
      setMembers(response.data);
      
      // Show search results count
      toast.success(`Found ${response.data.length} members`);
    } catch (error) {
      console.error('Error searching members:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchQuery.trim().length > 0) {
        performSearch(searchQuery);
      } else if (searchQuery === '' && isSearching) {
        // Search cleared, return to pagination
        setIsSearching(false);
        fetchCurrentPage();
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Check for search parameter from URL on mount
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      // performSearch will be triggered by the searchQuery useEffect above
    }
  }, [searchParams]);

  // Fetch count when filters change
  useEffect(() => {
    fetchMemberCount();
  }, [filterWard, filterGender, filterRelation]);

  // Fetch current page when page number changes or count is updated
  useEffect(() => {
    if (!isSearching && (pagination.total > 0 || pagination.page === 1)) {
      fetchCurrentPage();
    }
  }, [pagination.page, pagination.limit, filterWard, filterGender, filterRelation]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [filterWard, filterGender, filterRelation]);

  // Search filtering - now works on current page only
  const filteredMembers = useMemo(() => {
    // No additional filtering needed - search is server-side
    return members;
  }, [members]);

  // Handle delete member
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await deleteMember(id);
      toast.success('Member deleted successfully');
      // Refresh both count and current page
      fetchMemberCount();
      fetchCurrentPage();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    }
  };

  // Handle view member details
  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setShowDetailModal(true);
  };

  // Handle edit member from modal
  const handleEditFromModal = (memberId) => {
    navigate(`/admin/members/edit/${memberId}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilterWard('');
    setFilterGender('');
    setFilterRelation('');
  };

  // Pagination handlers
  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: parseInt(newLimit), page: 1 }));
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-[#1F2E2E] via-[#31757A] to-[#41A4A7] bg-clip-text text-transparent leading-relaxed">
              Members Management
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Manage member census and family information • Total: {pagination.total} members
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="h-5 w-5" />}
            onClick={() => navigate('/admin/members/add')}
            className="shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 bg-linear-to-r from-[#31757A] to-[#41A4A7] hover:from-[#41A4A7] hover:to-[#31757A]"
          >
            Add New Member
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {/* <motion.div
        variants={ANIMATION_VARIANTS.slideDown}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-br from-white to-[#E3F9F9]/30">
          <Card.Content className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Members</p>
                <div className="text-3xl font-bold bg-linear-to-r from-[#31757A] to-[#41A4A7] bg-clip-text text-transparent">
                  {loading ? <Skeleton className="h-10 w-20" /> : pagination.total.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-2">Registered in system</p>
              </div>
              <div className="p-4 bg-linear-to-br from-[#31757A] to-[#41A4A7] rounded-2xl shadow-lg shadow-[#31757A]/30">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div> 
            </div>
          </Card.Content>
        </Card>

        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-br from-white to-blue-50">
          <Card.Content className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Male Members</p>
                <div className="text-3xl font-bold text-blue-600">
                  {loading ? <Skeleton className="h-10 w-20" /> : members.filter(m => m.Gender === 'Male').length}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {loading ? '-' : `${((members.filter(m => m.Gender === 'Male').length / members.length) * 100).toFixed(1)}%`} of total
                </p>
              </div>
              <div className="p-4 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-br from-white to-pink-50">
          <Card.Content className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Female Members</p>
                <div className="text-3xl font-bold text-pink-600">
                  {loading ? <Skeleton className="h-10 w-20" /> : members.filter(m => m.Gender === 'Female').length}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {loading ? '-' : `${((members.filter(m => m.Gender === 'Female').length / members.length) * 100).toFixed(1)}%`} of total
                </p>
              </div>
              <div className="p-4 bg-linear-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg shadow-pink-500/30">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-br from-white to-green-50">
          <Card.Content className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Families</p>
                <div className="text-3xl font-bold text-green-600">
                  {loading ? <Skeleton className="h-10 w-20" /> : new Set(members.map(m => m.Mid)).size}
                </div>
                <p className="text-xs text-gray-500 mt-2">Unique households</p>
              </div>
              <div className="p-4 bg-linear-to-br from-green-500 to-green-600 rounded-2xl shadow-lg shadow-green-500/30">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </Card.Content>
        </Card>
      </motion.div> */}

      {/* Search and Filters */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideDown}
        initial="hidden"
        animate="visible"
      >
        <Card className="mb-8 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <Card.Content className="py-6">
            <div className="flex flex-col gap-5">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      placeholder="Search by ID, Name, Aadhaar, Phone, Email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                      className="pl-11 pr-4 py-3 text-base border-2 border-gray-200 focus:border-[#31757A] rounded-xl shadow-sm hover:shadow-md transition-all"
                    />
                    {searchQuery && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <button
                          onClick={() => setSearchQuery('')}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    leftIcon={<FunnelIcon className="h-5 w-5" />}
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      "border-2 transition-all duration-300 rounded-xl",
                      showFilters ? "border-[#31757A] bg-[#E3F9F9] text-[#1F2E2E]" : "border-gray-200 hover:border-[#31757A] hover:bg-[#E3F9F9]"
                    )}
                  >
                    Filters {(filterWard || filterGender || filterRelation) && (
                      <span className="ml-1 px-2 py-0.5 bg-[#31757A] text-white text-xs rounded-full">
                        {[filterWard, filterGender, filterRelation].filter(Boolean).length}
                      </span>
                    )}
                  </Button>
                  {(searchQuery || filterWard || filterGender || filterRelation) && (
                    <Button
                      variant="ghost"
                      leftIcon={<XMarkIcon className="h-5 w-5" />}
                      onClick={clearFilters}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-2 border-transparent hover:border-red-200 rounded-xl transition-all"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t-2 border-gray-100"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                        Ward
                      </label>
                      <select
                        value={filterWard}
                        onChange={(e) => setFilterWard(e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-sm"
                      >
                        <option value="">All Wards</option>
                        {[1, 2, 3, 4, 5, 6].map((ward) => (
                          <option key={ward} value={ward}>
                            Ward {ward}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                        Gender
                      </label>
                      <select
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-sm"
                      >
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                        Relation
                      </label>
                      <select
                        value={filterRelation}
                        onChange={(e) => setFilterRelation(e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-sm"
                      >
                        <option value="">All Relations</option>
                        <option value="Head">Head</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card.Content>
        </Card>
      </motion.div>

      {/* Members Table */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden shadow-xl border-0">
          <Card.Header className="">
            <div className="flex items-center justify-between">
              <div>
                <Card.Title className="text-xl font-bold text-[#1F2E2E]">
                  {isSearching ? (
                    <span className="flex items-center gap-2">
                      <MagnifyingGlassIcon className="h-5 w-5" />
                      Search Results ({filteredMembers.length})
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserGroupIcon className="h-5 w-5" />
                      All Members ({pagination.total})
                    </span>
                  )}
                </Card.Title>
                {/* <Card.Description className="text-sm mt-1">
                  {isSearching 
                    ? `Showing search results for "${searchQuery}"` 
                    : `Page ${pagination.page} of ${pagination.totalPages} • ${pagination.total} total members`
                  }
                </Card.Description> */}
              </div>
              {isSearching && (
                <Badge variant="success" className="px-4 py-2">
                  Search Active
                </Badge>
              )}
            </div>
          </Card.Header>
          <Card.Content className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-gray-50 to-[#E3F9F9]/30 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Mahal ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Relation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-5"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-6 py-5"><Skeleton className="h-4 w-36" /></td>
                        <td className="px-6 py-5"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-6 py-5"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-6 py-5"><Skeleton className="h-4 w-28" /></td>
                        <td className="px-6 py-5"><Skeleton className="h-4 w-48" /></td>
                        <td className="px-6 py-5"><Skeleton className="h-4 w-24" /></td>
                      </tr>
                    ))
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <UsersIcon className="h-12 w-12 text-gray-400" />
                          </div>
                          <p className="text-lg font-semibold text-gray-700">
                            {searchQuery ? 'No members found' : 'No members yet'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {searchQuery ? 'Try adjusting your search or filters' : 'Add your first member to get started!'}
                          </p>
                          {!searchQuery && (
                            <Button
                              variant="primary"
                              leftIcon={<PlusIcon className="h-5 w-5" />}
                              onClick={() => navigate('/admin/members/add')}
                              className="mt-3"
                            >
                              Add First Member
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member, index) => (
                      <motion.tr
                        key={member._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-linear-to-r hover:from-[#E3F9F9]/20 hover:to-transparent transition-all duration-200 cursor-pointer group"
                        onClick={() => handleViewDetails(member)}
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#31757A] group-hover:text-[#41A4A7] transition-colors">
                            {member.Mid}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="shrink-0">
                              <div className="h-10 w-10 rounded-full bg-linear-to-br from-[#31757A] to-[#41A4A7] flex items-center justify-center text-white font-bold shadow-md">
                                {member.Fname?.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 group-hover:text-[#1F2E2E]">
                                {member.Fname}
                              </div>
                              {member.Aadhaar && (
                                <div className="text-xs text-gray-500">
                                  Aadhaar: {member.Aadhaar}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <Badge
                            variant={member.Gender === 'Male' ? 'info' : member.Gender === 'Female' ? 'warning' : 'default'}
                            size="sm"
                            className="font-semibold"
                          >
                            {member.Gender}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm text-gray-700 font-medium">
                            {member.Relation || <span className="text-gray-400">-</span>}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm text-gray-900 font-medium">
                            {member.Mobile || <span className="text-gray-400">-</span>}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-700 max-w-xs truncate">
                            {member.Address || <span className="text-gray-400">-</span>}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<PencilIcon className="h-4 w-4" />}
                              onClick={() => navigate(`/admin/members/edit/${member._id}`)}
                              className="text-[#31757A] hover:text-[#41A4A7] hover:bg-[#E3F9F9] border border-transparent hover:border-[#31757A] transition-all"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<TrashIcon className="h-4 w-4" />}
                              onClick={() => handleDelete(member._id, member.Fname)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card.Content>

          {/* Pagination */}
          {!isSearching && pagination.total > 0 && (
            <Card.Footer className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5  border-t-2 border-gray-100">
              <div className="text-sm font-medium text-gray-700">
                Showing <span className="font-bold text-[#31757A]">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                <span className="font-bold text-[#31757A]">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                <span className="font-bold text-[#31757A]">{pagination.total}</span> members
              </div>

              <div className="flex items-center gap-4">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-700">Per page:</label>
                  <select
                    value={pagination.limit}
                    onChange={(e) => handleLimitChange(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] hover:border-[#31757A] transition-all shadow-sm hover:shadow-md bg-white"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                {/* Page navigation */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="border-2 border-gray-200 hover:border-[#31757A] hover:bg-[#E3F9F9] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {/* Show first page */}
                    {pagination.page > 3 && (
                      <>
                        <button
                          onClick={() => goToPage(1)}
                          className="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-[#E3F9F9] hover:text-[#1F2E2E] transition-all border-2 border-transparent hover:border-[#31757A]"
                        >
                          1
                        </button>
                        {pagination.page > 4 && (
                          <span className="px-2 text-gray-400 font-bold">...</span>
                        )}
                      </>
                    )}

                    {/* Show pages around current page */}
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        return Math.abs(page - pagination.page) <= 2;
                      })
                      .map(page => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all border-2 ${
                            page === pagination.page
                              ? 'bg-linear-to-r from-[#31757A] to-[#41A4A7] text-white border-transparent shadow-lg shadow-[#31757A]/30'
                              : 'hover:bg-[#E3F9F9] text-gray-700 border-transparent hover:border-[#31757A]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                    {/* Show last page */}
                    {pagination.page < pagination.totalPages - 2 && (
                      <>
                        {pagination.page < pagination.totalPages - 3 && (
                          <span className="px-2 text-gray-400 font-bold">...</span>
                        )}
                        <button
                          onClick={() => goToPage(pagination.totalPages)}
                          className="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-[#E3F9F9] hover:text-[#1F2E2E] transition-all border-2 border-transparent hover:border-[#31757A]"
                        >
                          {pagination.totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="border-2 border-gray-200 hover:border-[#31757A] hover:bg-[#E3F9F9] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card.Footer>
          )}
        </Card>
      </motion.div>

      {/* Member Detail Modal */}
      <MemberDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        member={selectedMember}
        onEdit={handleEditFromModal}
      />
    </AdminLayout>
  );
};

export default MembersPage;
