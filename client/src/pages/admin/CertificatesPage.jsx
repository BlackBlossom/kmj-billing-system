/**
 * Certificates Page
 * Admin page for generating certificates (Marriage, Death, Transfer)
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, Badge } from '../../components/common';
import { ANIMATION_VARIANTS, CERTIFICATE_TYPES } from '../../lib/constants';
import certificateService from '../../services/certificateService';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');

  const [formData, setFormData] = useState({
    type: '',
    name: '',
    details: {},
  });

  useEffect(() => {
    fetchCertificates();
  }, [filterType]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterType) params.type = filterType;
      
      const response = await certificateService.getAll(params);
      setCertificates(response.data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (certificate = null) => {
    if (certificate) {
      setEditingCertificate(certificate);
      setFormData({
        type: certificate.type,
        name: certificate.name,
        details: certificate.details || {},
      });
    } else {
      setEditingCertificate(null);
      setFormData({
        type: '',
        name: '',
        details: {},
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCertificate(null);
    setFormData({
      type: '',
      name: '',
      details: {},
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type || !formData.name) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingCertificate) {
        await certificateService.update(editingCertificate._id, formData);
        toast.success('Certificate updated successfully');
      } else {
        await certificateService.create(formData);
        toast.success('Certificate created successfully');
      }
      
      handleCloseModal();
      fetchCertificates();
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast.error(error.response?.data?.message || 'Failed to save certificate');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      await certificateService.delete(id);
      toast.success('Certificate deleted successfully');
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast.error('Failed to delete certificate');
    }
  };

  const handleDetailsChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      details: { ...prev.details, [key]: value }
    }));
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.certificateNumber?.toLowerCase().includes(searchQuery.toLowerCase());
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
              Certificates Management
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Generate and manage certificates • Total: {filteredCertificates.length} certificates
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            leftIcon={<Plus className="h-5 w-5" />}
            className="shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 bg-linear-to-r from-[#31757A] to-[#41A4A7] hover:from-[#41A4A7] hover:to-[#31757A]"
          >
            Add Certificate
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
                  placeholder="Search by name or certificate number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-transparent transition-all"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31757A] focus:border-transparent bg-white transition-all"
              >
                <option value="">All Types</option>
                {CERTIFICATE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </Card.Content>
        </Card>
      </motion.div>

      {/* Certificates List */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
          <Card.Header className="border-b-0 border-gray-300">
            <Card.Title className="text-[#1F2E2E]">
              All Certificates ({filteredCertificates.length})
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading certificates...
              </div>
            ) : filteredCertificates.length === 0 ? (
              <div className="p-8 text-center">
                <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No certificates found</p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => handleOpenModal()}
                >
                  Generate First Certificate
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-linear-to-r from-[#E3F9F9] to-white border-b-2 border-[#31757A]/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Certificate No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Issue Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-[#1F2E2E] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredCertificates.map((certificate) => (
                      <tr key={certificate._id} className="hover:bg-[#E3F9F9]/30 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-medium text-primary-600">
                            {certificate.certificateNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="primary">
                            {certificate.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">
                            {certificate.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {formatDate(certificate.issueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {formatDate(certificate.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(certificate)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                                                      <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(certificate._id)}
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
                  {editingCertificate ? 'Edit Certificate' : 'Generate New Certificate'}
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
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Certificate Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      required
                      disabled={!!editingCertificate}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100"
                    >
                      <option value="">Select Type</option>
                      {CERTIFICATE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Full name"
                  />

                  {/* Dynamic fields based on certificate type */}
                  {formData.type === 'Marriage' && (
                    <>
                      <Input
                        label="Spouse Name"
                        value={formData.details.spouseName || ''}
                        onChange={(e) => handleDetailsChange('spouseName', e.target.value)}
                        placeholder="Spouse full name"
                      />
                      <Input
                        label="Marriage Date"
                        type="date"
                        value={formData.details.marriageDate || ''}
                        onChange={(e) => handleDetailsChange('marriageDate', e.target.value)}
                      />
                      <Input
                        label="Place"
                        value={formData.details.place || ''}
                        onChange={(e) => handleDetailsChange('place', e.target.value)}
                        placeholder="Marriage location"
                      />
                    </>
                  )}

                  {formData.type === 'Death' && (
                    <>
                      <Input
                        label="Date of Death"
                        type="date"
                        value={formData.details.deathDate || ''}
                        onChange={(e) => handleDetailsChange('deathDate', e.target.value)}
                      />
                      <Input
                        label="Place of Death"
                        value={formData.details.place || ''}
                        onChange={(e) => handleDetailsChange('place', e.target.value)}
                        placeholder="Death location"
                      />
                      <Input
                        label="Cause"
                        value={formData.details.cause || ''}
                        onChange={(e) => handleDetailsChange('cause', e.target.value)}
                        placeholder="Cause of death (optional)"
                      />
                    </>
                  )}

                  {formData.type === 'Transfer' && (
                    <>
                      <Input
                        label="From Location"
                        value={formData.details.fromLocation || ''}
                        onChange={(e) => handleDetailsChange('fromLocation', e.target.value)}
                        placeholder="Previous location"
                      />
                      <Input
                        label="To Location"
                        value={formData.details.toLocation || ''}
                        onChange={(e) => handleDetailsChange('toLocation', e.target.value)}
                        placeholder="New location"
                      />
                      <Input
                        label="Transfer Date"
                        type="date"
                        value={formData.details.transferDate || ''}
                        onChange={(e) => handleDetailsChange('transferDate', e.target.value)}
                      />
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Additional Notes (optional)
                    </label>
                    <textarea
                      value={formData.details.notes || ''}
                      onChange={(e) => handleDetailsChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Any additional information"
                    />
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
                    {editingCertificate ? 'Update' : 'Generate'} Certificate
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

export default CertificatesPage;
