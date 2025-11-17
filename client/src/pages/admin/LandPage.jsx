/**
 * Land Page
 * Admin page for managing land records
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
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
import { ANIMATION_VARIANTS } from '../../lib/constants';
import landService from '../../services/landService';

const LandPage = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLand, setEditingLand] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFile, setPreviewFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    area: '',
    ward: '',
    attachmentUrl: '',
  });

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      setLoading(true);
      const response = await landService.getAll();
      setLands(response.data || []);
    } catch (error) {
      console.error('Error fetching land records:', error);
      toast.error('Failed to fetch land records');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (land = null) => {
    if (land) {
      setEditingLand(land);
      setFormData({
        name: land.name,
        area: land.area,
        ward: land.ward,
        attachmentUrl: land.attachmentUrl || '',
      });
    } else {
      setEditingLand(null);
      setFormData({
        name: '',
        area: '',
        ward: '',
        attachmentUrl: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLand(null);
    setFormData({
      name: '',
      area: '',
      ward: '',
      attachmentUrl: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.area || !formData.ward) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingLand) {
        await landService.update(editingLand._id, formData);
        toast.success('Land record updated successfully');
      } else {
        await landService.create(formData);
        toast.success('Land record created successfully');
      }
      
      handleCloseModal();
      fetchLands();
    } catch (error) {
      console.error('Error saving land record:', error);
      toast.error(error.response?.data?.message || 'Failed to save land record');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this land record?')) return;

    try {
      await landService.delete(id);
      toast.success('Land record deleted successfully');
      fetchLands();
    } catch (error) {
      console.error('Error deleting land record:', error);
      toast.error('Failed to delete land record');
    }
  };

  const filteredLands = lands.filter(land => {
    const matchesSearch = land.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         land.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         land.ward.toLowerCase().includes(searchQuery.toLowerCase());
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
              Land Records Management
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Manage land ownership and property records • Total: {filteredLands.length} records
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            leftIcon={<Plus className="h-5 w-5" />}
            className="shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 bg-linear-to-r from-[#31757A] to-[#41A4A7] hover:from-[#41A4A7] hover:to-[#31757A]"
          >
            Add Land
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideDown}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-linear-to-br from-white to-[#E3F9F9]/30">
          <Card.Content className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, area, or ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-transparent transition-all"
              />
            </div>
          </Card.Content>
        </Card>
      </motion.div>

      {/* Land List */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
          <Card.Header className="border-b-0 border-gray-300">
            <Card.Title className="text-[#1F2E2E]">
              All Land Records ({filteredLands.length})
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading land records...
              </div>
            ) : filteredLands.length === 0 ? (
              <div className="p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No land records found</p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => handleOpenModal()}
                >
                  Create First Record
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
                        Area/Place
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Ward/Building No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Attachment
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
                    {filteredLands.map((land) => (
                      <tr key={land._id} className="hover:bg-[#E3F9F9]/30 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">
                            {land.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-600">
                            {land.area}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="primary">{land.ward}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {land.attachmentUrl ? (
                            <button
                              onClick={() => setPreviewFile(land.attachmentUrl)}
                              className="text-primary-600 hover:text-primary-900 flex items-center gap-1"
                            >
                              <Paperclip className="h-4 w-4" />
                              View
                            </button>
                          ) : (
                            <span className="text-neutral-400 text-sm">No file</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {formatDate(land.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(land)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                                                      <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(land._id)}
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
                  {editingLand ? 'Edit Land Record' : 'Add New Land Record'}
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

                  <Input
                    label="Area/Place"
                    name="area"
                    value={formData.area}
                    onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    required
                    placeholder="Enter area or place"
                  />

                  <Input
                    label="Ward/Building No"
                    name="ward"
                    value={formData.ward}
                    onChange={(e) => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                    required
                    placeholder="Enter ward or building number"
                  />

                  <FileUpload
                    label="Attachment (optional)"
                    currentUrl={formData.attachmentUrl}
                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, attachmentUrl: url }))}
                    accept="image/*,.pdf"
                    maxSize={5}
                    helperText="Upload images (JPG, PNG) or PDF files up to 5MB"
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
                    {editingLand ? 'Update' : 'Create'} Record
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

export default LandPage;
