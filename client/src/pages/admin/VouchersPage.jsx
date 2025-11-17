/**
 * Vouchers Page
 * Admin page for managing vouchers
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, Badge } from '../../components/common';
import { ANIMATION_VARIANTS, VOUCHER_SERVICES } from '../../lib/constants';
import { cn } from '../../lib/utils';
import voucherService from '../../services/voucherService';

const VouchersPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterService, setFilterService] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cost: '',
    service: '',
  });

  // Fetch vouchers
  useEffect(() => {
    fetchVouchers();
  }, [filterService]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterService) params.service = filterService;
      
      const response = await voucherService.getAll(params);
      setVouchers(response.data || []);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('Failed to fetch vouchers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (voucher = null) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setFormData({
        name: voucher.name,
        address: voucher.address,
        cost: voucher.cost,
        service: voucher.service,
      });
    } else {
      setEditingVoucher(null);
      setFormData({
        name: '',
        address: '',
        cost: '',
        service: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVoucher(null);
    setFormData({
      name: '',
      address: '',
      cost: '',
      service: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.cost || !formData.service) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingVoucher) {
        await voucherService.update(editingVoucher._id, formData);
        toast.success('Voucher updated successfully');
      } else {
        await voucherService.create(formData);
        toast.success('Voucher created successfully');
      }
      
      handleCloseModal();
      fetchVouchers();
    } catch (error) {
      console.error('Error saving voucher:', error);
      toast.error(error.response?.data?.message || 'Failed to save voucher');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this voucher?')) return;

    try {
      await voucherService.delete(id);
      toast.success('Voucher deleted successfully');
      fetchVouchers();
    } catch (error) {
      console.error('Error deleting voucher:', error);
      toast.error('Failed to delete voucher');
    }
  };

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         voucher.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
              Vouchers Management
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Manage voucher entries for various services • Total: {filteredVouchers.length} vouchers
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            leftIcon={<Plus className="h-5 w-5" />}
            className="shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 bg-linear-to-r from-[#31757A] to-[#41A4A7] hover:from-[#41A4A7] hover:to-[#31757A]"
          >
            Add Voucher
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
                  placeholder="Search by name or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-transparent transition-all"
                />
              </div>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-transparent bg-white transition-all"
              >
                <option value="">All Services</option>
                {VOUCHER_SERVICES.map(service => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>
          </Card.Content>
        </Card>
      </motion.div>

      {/* Vouchers List */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-br from-white to-[#E3F9F9]/20">
          <Card.Header className="border-b-0 border-gray-300">
            <Card.Title className="text-[#1F2E2E]">
              All Vouchers ({filteredVouchers.length})
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-0">
            {loading ? (
              <div className="p-8 text-center text-neutral-500">
                Loading vouchers...
              </div>
            ) : filteredVouchers.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">No vouchers found</p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => handleOpenModal()}
                >
                  Create First Voucher
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
                        Address
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredVouchers.map((voucher) => (
                      <tr key={voucher._id} className="hover:bg-[#E3F9F9]/30 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">
                            {voucher.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-600 max-w-xs truncate">
                            {voucher.address}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="primary">
                            {VOUCHER_SERVICES.find(s => s.value === voucher.service)?.label || voucher.service}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-neutral-900">
                            {formatCurrency(voucher.cost)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {formatDate(voucher.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(voucher)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                                                      <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(voucher._id)}
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
                  {editingVoucher ? 'Edit Voucher' : 'Add New Voucher'}
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
                    placeholder="Enter name"
                  />

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter address"
                    />
                  </div>

                  <Input
                    label="Cost"
                    name="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter cost"
                  />

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Service <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Service</option>
                      {VOUCHER_SERVICES.map(service => (
                        <option key={service.value} value={service.value}>
                          {service.label}
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
                    {editingVoucher ? 'Update' : 'Create'} Voucher
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

export default VouchersPage;
