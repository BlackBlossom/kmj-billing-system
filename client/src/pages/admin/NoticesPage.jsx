import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Badge } from '../../components/common';
import { ANIMATION_VARIANTS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  PRIORITY_LEVELS,
  getPriorityColor
} from '../../services/noticeService';

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    urgent: 0,
    totalViews: 0
  });
  const [filters, setFilters] = useState({
    priority: '',
    isActive: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    expiresAt: '',
    isActive: true
  });

  useEffect(() => {
    fetchNotices();
  }, [filters]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        includeInactive: true // Admin can see all notices
      };
      const response = await getAllNotices(params);
      const noticesList = response.data.notices;
      setNotices(noticesList);
      
      // Calculate stats
      setStats({
        total: noticesList.length,
        active: noticesList.filter(n => n.isActive).length,
        urgent: noticesList.filter(n => n.priority === 'urgent').length,
        totalViews: noticesList.reduce((sum, n) => sum + (n.views || 0), 0)
      });
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (notice = null) => {
    if (notice) {
      setEditingNotice(notice);
      // Handle both expiresAt and expiryDate field names from backend
      const expiryDate = notice.expiresAt || notice.expiryDate;
      setFormData({
        title: notice.title,
        content: notice.content,
        priority: notice.priority,
        expiresAt: expiryDate ? new Date(expiryDate).toISOString().split('T')[0] : '',
        isActive: notice.isActive
      });
    } else {
      setEditingNotice(null);
      setFormData({
        title: '',
        content: '',
        priority: 'normal',
        expiresAt: '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      priority: 'normal',
      expiresAt: '',
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const noticeData = {
        ...formData,
        expiresAt: formData.expiresAt || null
      };

      if (editingNotice) {
        await updateNotice(editingNotice._id, noticeData);
        toast.success('Notice updated successfully');
      } else {
        await createNotice(noticeData);
        toast.success('Notice created successfully');
      }

      handleCloseModal();
      fetchNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      toast.error(error.response?.data?.message || 'Failed to save notice');
    }
  };

  const handleDelete = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      await deleteNotice(noticeId);
      toast.success('Notice deleted successfully');
      fetchNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast.error('Failed to delete notice');
    }
  };

  const handleToggleActive = async (notice) => {
    try {
      await updateNotice(notice._id, { isActive: !notice.isActive });
      toast.success(`Notice ${!notice.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchNotices();
    } catch (error) {
      console.error('Error toggling notice status:', error);
      toast.error('Failed to update notice status');
    }
  };

  // Filter notices based on search
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = searchQuery === '' || 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          variants={ANIMATION_VARIANTS.fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold leading-relaxed bg-linear-to-r from-[#1F2E2E] via-[#31757A] to-[#41A4A7] bg-clip-text text-transparent flex items-center gap-3">
                <BellIcon className="w-10 h-10 text-[#31757A]" />
                Notice Board
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage and broadcast important notices to members</p>
            </div>
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="h-5 w-5" />}
              onClick={() => handleOpenModal()}
              className="bg-linear-to-r from-[#31757A] to-[#41A4A7] hover:from-[#41A4A7] hover:to-[#31757A] shadow-lg hover:shadow-xl transition-all"
            >
              Create Notice
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {/* <motion.div
          variants={ANIMATION_VARIANTS.slideUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Notices *
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <SparklesIcon className="w-8 h-8 text-blue-500/20" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Notices</p>
                <p className="text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  {stats.total}
                </p>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Active Notices *
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <SparklesIcon className="w-8 h-8 text-green-500/20" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Active Notices</p>
                <p className="text-4xl font-bold bg-linear-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  {stats.active}
                </p>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Urgent Notices *
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-red-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-linear-to-br from-red-500 to-rose-600 rounded-xl shadow-lg">
                    <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                  </div>
                  <SparklesIcon className="w-8 h-8 text-red-500/20" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Urgent Notices</p>
                <p className="text-4xl font-bold bg-linear-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                  {stats.urgent}
                </p>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Total Views *
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <EyeIcon className="w-6 h-6 text-white" />
                  </div>
                  <SparklesIcon className="w-8 h-8 text-purple-500/20" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Views</p>
                <p className="text-4xl font-bold bg-linear-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                  {stats.totalViews}
                </p>
              </Card.Content>
            </Card>
          </motion.div>
        </motion.div> */}

        {/* Search and Filter Bar */}
        <motion.div
          variants={ANIMATION_VARIANTS.slideUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <Card className="shadow-xl border-0 overflow-hidden">
            <Card.Content className="p-6">
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notices by title or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-base"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  leftIcon={<FunnelIcon className="w-5 h-5" />}
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "border-2 border-gray-200 hover:border-[#31757A] hover:bg-[#E3F9F9] transition-all shadow-sm hover:shadow-md",
                    showFilters && "bg-[#E3F9F9] border-[#31757A]"
                  )}
                >
                  Filters
                  {(filters.priority || filters.isActive) && (
                    <Badge variant="primary" className="ml-2 bg-[#31757A] text-white">
                      {[filters.priority, filters.isActive].filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
              </form>

              {/* Expandable Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t-2 border-gray-100 pt-6 mt-2"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2.5">
                          Priority Level
                        </label>
                        <select
                          value={filters.priority}
                          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-sm"
                        >
                          <option value="">All Priorities</option>
                          {PRIORITY_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2.5">
                          Status
                        </label>
                        <select
                          value={filters.isActive}
                          onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all shadow-sm hover:shadow-md text-sm"
                        >
                          <option value="">All Statuses</option>
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        variant="outline"
                        leftIcon={<XMarkIcon className="w-5 h-5" />}
                        onClick={() => {
                          setFilters({ priority: '', isActive: '' });
                          setSearchQuery('');
                        }}
                        className="border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold shadow-sm hover:shadow-md transition-all"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Notices List */}
        <motion.div
          variants={ANIMATION_VARIANTS.slideUp}
          initial="hidden"
          animate="visible"
        >
          <Card className="overflow-hidden shadow-xl border-0">
            <Card.Header>
              <div className="flex items-center justify-between">
                <div>
                  <Card.Title className="text-xl font-bold text-[#1F2E2E] flex items-center gap-2">
                    <BellIcon className="h-6 w-6 text-[#31757A]" />
                    All Notices
                  </Card.Title>
                  <Card.Description className="text-sm mt-1">
                    {filteredNotices.length > 0
                      ? `Showing ${filteredNotices.length} notice${filteredNotices.length !== 1 ? 's' : ''}`
                      : 'No notices found'
                    }
                  </Card.Description>
                </div>
              </div>
            </Card.Header>
            <Card.Content className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#31757A]"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <BellIcon className="h-6 w-6 text-[#31757A]" />
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">Loading notices...</p>
                </div>
              ) : filteredNotices.length === 0 ? (
                <div className="text-center py-24">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-6 bg-linear-to-br from-[#E3F9F9] to-white rounded-full">
                      <BellIcon className="w-16 h-16 text-[#31757A]" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-700 mb-2">No notices found</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {searchQuery || filters.priority || filters.isActive
                          ? 'Try adjusting your search or filters'
                          : 'Start by creating your first notice'}
                      </p>
                      <Button
                        variant="primary"
                        leftIcon={<PlusIcon className="h-5 w-5" />}
                        onClick={() => handleOpenModal()}
                        className="bg-linear-to-r from-[#31757A] to-[#41A4A7] shadow-lg hover:shadow-xl"
                      >
                        Create First Notice
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotices.map((notice, index) => (
                    <motion.div
                      key={notice._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 hover:bg-linear-to-r hover:from-[#E3F9F9]/20 hover:to-transparent transition-all duration-200 group"
                    >
                      {/* Priority Indicator - Vertical Bar on Left */}
                      <div className="flex gap-4">
                        <div className={`w-1 rounded-full ${
                          notice.priority === 'urgent' ? 'bg-linear-to-b from-red-500 to-rose-600' :
                          notice.priority === 'high' ? 'bg-linear-to-b from-orange-500 to-amber-600' :
                          notice.priority === 'normal' ? 'bg-linear-to-b from-blue-500 to-blue-600' :
                          'bg-linear-to-b from-gray-400 to-gray-500'
                        }`}></div>

                        <div className="flex-1 min-w-0">
                          {/* Header with badges */}
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className={`p-2.5 rounded-xl shrink-0 ${
                                notice.priority === 'urgent' ? 'bg-red-100' :
                                notice.priority === 'high' ? 'bg-orange-100' :
                                notice.priority === 'normal' ? 'bg-blue-100' :
                                'bg-gray-100'
                              }`}>
                                {notice.priority === 'urgent' ? (
                                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                                ) : notice.priority === 'high' ? (
                                  <BellIcon className="w-5 h-5 text-orange-600" />
                                ) : (
                                  <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-[#31757A] transition-colors">
                                  {notice.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge
                                    className={cn(
                                      "font-semibold text-xs uppercase",
                                      notice.priority === 'urgent' ? 'bg-red-100 text-red-800 border-red-200' :
                                      notice.priority === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                      notice.priority === 'normal' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                      'bg-gray-100 text-gray-800 border-gray-200'
                                    )}
                                    size="sm"
                                  >
                                    {notice.priority}
                                  </Badge>
                                  {notice.isActive ? (
                                    <Badge className="bg-linear-to-r from-green-500 to-emerald-600 text-white border-0" size="sm">
                                      <CheckCircleIcon className="w-3.5 h-3.5 mr-1 inline" />
                                      Active
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-gray-200 text-gray-700 border-gray-300" size="sm">
                                      <XCircleIcon className="w-3.5 h-3.5 mr-1 inline" />
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleActive(notice)}
                                className={cn(
                                  "transition-all",
                                  notice.isActive
                                    ? "text-yellow-700 hover:bg-yellow-100"
                                    : "text-green-700 hover:bg-green-100"
                                )}
                                title={notice.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {notice.isActive ? (
                                  <XCircleIcon className="w-5 h-5" />
                                ) : (
                                  <CheckCircleIcon className="w-5 h-5" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenModal(notice)}
                                className="text-blue-700 hover:bg-blue-100 transition-all"
                                title="Edit"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(notice._id)}
                                className="text-red-700 hover:bg-red-100 transition-all"
                                title="Delete"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>

                          {/* Content */}
                          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">
                            {notice.content}
                          </p>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <EyeIcon className="w-4 h-4 text-purple-600" />
                              <span className="font-medium">{notice.views || 0} views</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <CalendarIcon className="w-4 h-4 text-blue-600" />
                              <span>{new Date(notice.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}</span>
                            </div>
                            {(notice.expiresAt || notice.expiryDate) && (
                              <div className="flex items-center gap-1.5 text-red-600 font-semibold">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                <span>Expires: {new Date(notice.expiresAt || notice.expiryDate).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short'
                                })}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card.Content>
          </Card>
        </motion.div>
      </div>

      {/* Create/Edit Modal - Rendered via Portal */}
      {showModal && createPortal(
        <AnimatePresence>
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              style={{ zIndex: 9999 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal */}
            <div style={{ zIndex: 10000 }} className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
              >
                {/* Modal Header */}
                <div className="bg-linear-to-r from-[#1F2E2E] via-[#31757A] to-[#41A4A7] px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl">
                        <BellIcon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                      </h2>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Form Content - Scrollable */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                  <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2.5">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all outline-none shadow-sm hover:shadow-md"
                        placeholder="Enter notice title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2.5">
                        Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all outline-none resize-none shadow-sm hover:shadow-md"
                        placeholder="Enter notice content"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2.5">
                          Priority Level
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all outline-none shadow-sm hover:shadow-md"
                        >
                          {PRIORITY_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2.5">
                          Expiration Date
                        </label>
                        <input
                          type="date"
                          value={formData.expiresAt}
                          onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all outline-none shadow-sm hover:shadow-md"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="w-5 h-5 text-[#31757A] border-gray-300 rounded focus:ring-[#31757A]"
                      />
                      <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 flex items-center gap-2 cursor-pointer">
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        Active (visible to members)
                      </label>
                    </div>

                    <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCloseModal}
                        className="flex-1 border-2 border-gray-300 hover:bg-gray-50 font-semibold"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-1 bg-linear-to-r from-[#31757A] to-[#41A4A7] hover:from-[#41A4A7] hover:to-[#31757A] shadow-lg hover:shadow-xl font-semibold"
                      >
                        {editingNotice ? 'Update Notice' : 'Create Notice'}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        </AnimatePresence>,
        document.body
      )}
    </AdminLayout>
  );
};

export default NoticesPage;
