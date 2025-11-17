/**
 * Reports Page
 * Admin page for managing complaints and repairs
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, Badge } from '../../components/common';
import { ANIMATION_VARIANTS, REPORT_STATUS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import reportService from '../../services/reportService';
import inventoryService from '../../services/inventoryService';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    problem: '',
    status: 'Pending',
    inventoryItem: '',
  });

  useEffect(() => {
    fetchReports();
    fetchInventoryItems();
  }, [filterStatus]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      
      const response = await reportService.getAll(params);
      setReports(response.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const response = await inventoryService.getAll();
      setInventoryItems(response.data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleOpenModal = (report = null) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        name: report.name,
        problem: report.problem,
        status: report.status,
        inventoryItem: report.inventoryItem?._id || '',
      });
    } else {
      setEditingReport(null);
      setFormData({
        name: '',
        problem: '',
        status: 'Pending',
        inventoryItem: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReport(null);
    setFormData({
      name: '',
      problem: '',
      status: 'Pending',
      inventoryItem: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.problem) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const submitData = { ...formData };
      if (!submitData.inventoryItem) delete submitData.inventoryItem;

      if (editingReport) {
        await reportService.update(editingReport._id, submitData);
        toast.success('Report updated successfully');
      } else {
        await reportService.create(submitData);
        toast.success('Report created successfully');
      }
      
      handleCloseModal();
      fetchReports();
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error(error.response?.data?.message || 'Failed to save report');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      await reportService.delete(id);
      toast.success('Report deleted successfully');
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.problem.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const statusObj = REPORT_STATUS.find(s => s.value === status);
    return statusObj?.color || 'gray';
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
              Reports & Complaints
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Track and manage repair reports • Total: {filteredReports.length} reports
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            leftIcon={<Plus className="h-5 w-5" />}
            className="shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 bg-linear-to-r from-[#31757A] to-[#41A4A7] hover:from-[#41A4A7] hover:to-[#31757A]"
          >
            Add Report
          </Button>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideDown}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-linear-to-br from-white to-[#E3F9F9]/30">
          <Card.Content className="p-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or problem..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-transparent transition-all"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-transparent bg-white transition-all"
              >
                <option value="">All Status</option>
                {REPORT_STATUS.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </Card.Content>
        </Card>
      </motion.div>

      {/* Reports List */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 ">
          <Card.Header className="border-b-0 border-gray-300">
            <Card.Title className="text-[#1F2E2E]">
              All Reports ({filteredReports.length})
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading reports...
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No reports found</p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => handleOpenModal()}
                >
                  Create First Report
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-linear-to-r from-[#E3F9F9] to-white border-b-2 border-[#31757A]/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Problem
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Inventory Item
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredReports.map((report) => (
                      <tr key={report._id} className="hover:bg-[#E3F9F9]/30 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">
                            {report.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-600 max-w-xs truncate">
                            {report.problem}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {report.inventoryItem ? (
                            <span className="text-sm text-neutral-600">
                              {report.inventoryItem.name}
                            </span>
                          ) : (
                            <span className="text-sm text-neutral-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={
                              report.status === 'Resolved' ? 'success' :
                              report.status === 'In Progress' ? 'warning' : 
                              'secondary'
                            }
                          >
                            {report.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {formatDate(report.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(report)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                                                      <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(report._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                                                      <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Content>
        </Card>
      </motion.div>

      {/* Add/Edit Modal - Rendered via Portal */}
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
            <div style={{ zIndex: 10000 }} className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
              >
              <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                  {editingReport ? 'Edit Report' : 'Add New Report'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-neutral-400 hover:text-neutral-600 p-1"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Reporter name"
                  />

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Problem Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="problem"
                      value={formData.problem}
                      onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe the problem"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {REPORT_STATUS.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Related Inventory Item (optional)
                    </label>
                    <select
                      name="inventoryItem"
                      value={formData.inventoryItem}
                      onChange={(e) => setFormData(prev => ({ ...prev, inventoryItem: e.target.value }))}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">None</option>
                      {inventoryItems.map(item => (
                        <option key={item._id} value={item._id}>
                          {item.name} - {item.department}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingReport ? 'Update' : 'Create'} Report
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
          </>
        </AnimatePresence>,
        document.body
      )}
    </AdminLayout>
  );
};

export default ReportsPage;
