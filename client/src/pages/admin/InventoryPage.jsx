/**
 * Inventory Page
 * Admin page for managing inventory items (Engineering Department)
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Paperclip,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, Badge, FileUpload } from '../../components/common';
import { ANIMATION_VARIANTS, DEPARTMENT_TYPES } from '../../lib/constants';
import inventoryService from '../../services/inventoryService';

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [previewFile, setPreviewFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    department: 'Engineering',
    count: '',
    purchaseDate: '',
    phoneNumber: '',
    attachmentUrl: '',
    warrantyUrl: '',
  });

  useEffect(() => {
    fetchItems();
  }, [filterDepartment]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterDepartment) params.department = filterDepartment;
      
      const response = await inventoryService.getAll(params);
      setItems(response.data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to fetch inventory items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        title: item.title || '',
        department: item.department,
        count: item.count,
        purchaseDate: item.purchaseDate ? new Date(item.purchaseDate).toISOString().split('T')[0] : '',
        phoneNumber: item.phoneNumber || '',
        attachmentUrl: item.attachmentUrl || '',
        warrantyUrl: item.warrantyUrl || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        title: '',
        department: 'Engineering',
        count: '',
        purchaseDate: '',
        phoneNumber: '',
        attachmentUrl: '',
        warrantyUrl: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: '',
      title: '',
      department: 'Engineering',
      count: '',
      purchaseDate: '',
      phoneNumber: '',
      attachmentUrl: '',
      warrantyUrl: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.count || !formData.purchaseDate) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingItem) {
        await inventoryService.update(editingItem._id, formData);
        toast.success('Inventory item updated successfully');
      } else {
        await inventoryService.create(formData);
        toast.success('Inventory item created successfully');
      }
      
      handleCloseModal();
      fetchItems();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      toast.error(error.response?.data?.message || 'Failed to save inventory item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await inventoryService.delete(id);
      toast.success('Inventory item deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast.error('Failed to delete inventory item');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

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
              Inventory Management
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Manage engineering department inventory • Total: {filteredItems.length} items
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            leftIcon={<Plus className="h-5 w-5" />}
            className="shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 bg-linear-to-r from-[#31757A] to-[#41A4A7] hover:from-[#41A4A7] hover:to-[#31757A]"
          >
            Add Item
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
                  placeholder="Search by name or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-transparent transition-all"
                />
              </div>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-transparent bg-white transition-all"
              >
                <option value="">All Departments</option>
                {DEPARTMENT_TYPES.map(dept => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
          </Card.Content>
        </Card>
      </motion.div>

      {/* Inventory List */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 ">
          <Card.Header className="border-b-0 border-gray-300">
            <Card.Title className="text-[#1F2E2E]">
              All Items ({filteredItems.length})
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading inventory...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No inventory items found</p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => handleOpenModal()}
                >
                  Add First Item
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
                        Department
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Count
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Purchase Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Files
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredItems.map((item) => (
                      <tr key={item._id} className="hover:bg-[#E3F9F9]/30 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {item.name}
                          </div>
                          {item.title && (
                            <div className="text-xs text-neutral-500">{item.title}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="primary">{item.department}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-neutral-900">
                            {item.count}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {formatDate(item.purchaseDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {item.phoneNumber || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {item.attachmentUrl && (
                              <button
                                onClick={() => setPreviewFile(item.attachmentUrl)}
                                className="text-primary-600 hover:text-primary-900"
                                title="View Attachment"
                              >
                                <Paperclip className="h-4 w-4" />
                              </button>
                            )}
                            {item.warrantyUrl && (
                              <button
                                onClick={() => setPreviewFile(item.warrantyUrl)}
                                className="text-green-600 hover:text-green-900"
                                title="View Warranty"
                              >
                                <Paperclip className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(item)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                                                      <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
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
                  {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
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
                    label="Item Name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="e.g., Fan, Pump, Light"
                  />

                  <Input
                    label="Title (optional)"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Additional description"
                  />

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {DEPARTMENT_TYPES.map(dept => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Count"
                    name="count"
                    type="number"
                    value={formData.count}
                    onChange={(e) => setFormData(prev => ({ ...prev, count: e.target.value }))}
                    required
                    min="0"
                    placeholder="Number of items"
                  />

                  <Input
                    label="Purchase Date"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    required
                  />

                  <Input
                    label="Phone Number (optional)"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="Contact number"
                  />

                  <FileUpload
                    label="Attachment (optional)"
                    currentUrl={formData.attachmentUrl}
                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, attachmentUrl: url }))}
                    accept="image/*,.pdf"
                    maxSize={5}
                    helperText="Upload purchase receipts or related documents"
                  />

                  <FileUpload
                    label="Warranty File (optional)"
                    currentUrl={formData.warrantyUrl}
                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, warrantyUrl: url }))}
                    accept="image/*,.pdf"
                    maxSize={5}
                    helperText="Upload warranty documents or certificates"
                  />
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
                    {editingItem ? 'Update' : 'Create'} Item
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
          </>
        </AnimatePresence>,
        document.body
      )}

      {/* File Preview Modal */}
      {previewFile && createPortal(
        <AnimatePresence>
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewFile(null)}
              style={{ zIndex: 9999 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm"
            />

            {/* Preview Modal */}
            <div style={{ zIndex: 10000 }} className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
              >
                <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-neutral-900">File Preview</h3>
                  <div className="flex items-center gap-2">
                    <a
                      href={previewFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Open in New Tab
                    </a>
                    <button
                      onClick={() => setPreviewFile(null)}
                      className="text-neutral-400 hover:text-neutral-600 p-1"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto bg-neutral-50 p-4">
                  {previewFile.toLowerCase().endsWith('.pdf') ? (
                    <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center gap-4">
                      <iframe
                        src={`${previewFile}#toolbar=0`}
                        className="w-full h-full rounded-lg border-0"
                        title="PDF Preview"
                        style={{ minHeight: '600px' }}
                      />
                      <p className="text-sm text-neutral-600">
                        Can't see the preview? <a href={previewFile} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Open in new tab</a>
                      </p>
                    </div>
                  ) : (
                    <img
                      src={previewFile}
                      alt="File preview"
                      className="max-w-full max-h-full mx-auto rounded-lg shadow-lg"
                    />
                  )}
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

export default InventoryPage;
