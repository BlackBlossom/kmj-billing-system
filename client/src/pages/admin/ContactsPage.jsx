/**
 * Contacts Page
 * Admin page for managing contacts with warranty files
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Phone,
  FileText,
  Paperclip,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Input, Badge, FileUpload } from '../../components/common';
import { ANIMATION_VARIANTS } from '../../lib/constants';
import contactService from '../../services/contactService';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFile, setPreviewFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    phoneNumber: '',
    warrantyFiles: [],
  });

  // Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      
      const response = await contactService.getAll(params);
      setContacts(response.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchContacts();
  };

  const handleAddFile = () => {
    setFormData(prev => ({
      ...prev,
      warrantyFiles: [...prev.warrantyFiles, ''],
    }));
  };

  const handleFileUploadComplete = (index, url) => {
    setFormData(prev => {
      const newFiles = [...prev.warrantyFiles];
      newFiles[index] = url;
      return { ...prev, warrantyFiles: newFiles };
    });
  };

  const handleRemoveFileSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      warrantyFiles: prev.warrantyFiles.filter((_, i) => i !== index),
    }));
  };

  const handleOpenModal = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        name: contact.name,
        title: contact.title,
        phoneNumber: contact.phoneNumber,
        warrantyFiles: contact.warrantyFiles || [],
      });
    } else {
      setEditingContact(null);
      setFormData({
        name: '',
        title: '',
        phoneNumber: '',
        warrantyFiles: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingContact(null);
    setFormData({
      name: '',
      title: '',
      phoneNumber: '',
      warrantyFiles: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.title || !formData.phoneNumber) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingContact) {
        await contactService.update(editingContact._id, formData);
        toast.success('Contact updated successfully');
      } else {
        await contactService.create(formData);
        toast.success('Contact created successfully');
      }
      
      handleCloseModal();
      fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error(error.response?.data?.message || 'Failed to save contact');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      await contactService.delete(id);
      toast.success('Contact deleted successfully');
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(search) ||
      contact.title.toLowerCase().includes(search) ||
      contact.phoneNumber.toLowerCase().includes(search)
    );
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
            <h1 className="text-4xl font-bold bg-linear-to-r from-primary via-primary-light to-primary-lighter bg-clip-text text-transparent leading-relaxed">
              Contacts Management
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Manage contact information with warranty files • Total: {filteredContacts.length} contacts
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            leftIcon={<Plus className="h-5 w-5" />}
            className="shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 bg-linear-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary"
          >
            Add Contact
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
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0">
          <Card.Content className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, title, or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </Card.Content>
        </Card>
      </motion.div>

      {/* Contacts List */}
      <motion.div
        variants={ANIMATION_VARIANTS.slideUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
          <Card.Header className="border-b-0 border-gray-300">
            <Card.Title className="text-secondary">
              All Contacts ({filteredContacts.length})
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading contacts...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No contacts found</p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => handleOpenModal()}
                >
                  Create First Contact
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-primary/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                        Warranty Files
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                        Date Added
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredContacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {contact.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            {contact.phoneNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contact.warrantyFiles?.filter(f => f).length > 0 ? (
                            <button
                              onClick={() => setPreviewFile(contact.warrantyFiles)}
                              className="text-primary hover:text-primary-light flex items-center gap-1"
                            >
                              <Paperclip className="h-4 w-4" />
                              <span>{contact.warrantyFiles.filter(f => f).length} file(s)</span>
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">No files</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(contact.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(contact)}
                              className="text-primary hover:text-primary-light transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(contact._id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete"
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
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
              >
                <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {editingContact ? 'Edit Contact' : 'Add New Contact'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        placeholder="Enter full name"
                      />

                      <Input
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                        placeholder="Enter job title"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Phone Number"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        required
                        placeholder="+91 1234567890"
                        pattern="[\\d\\s\\+\\-\\(\\)]{10,20}"
                        title="Phone number must contain 10-15 digits (spaces, +, -, (, ) are allowed)"
                      />
                    </div>

                    {/* Warranty Files Upload */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Warranty Files & Documents
                        </label>
                        <button
                          type="button"
                          onClick={handleAddFile}
                          className="text-sm text-primary hover:text-primary-light flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Add File
                        </button>
                      </div>

                      <div className="space-y-3">
                        {formData.warrantyFiles.length === 0 ? (
                          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">No warranty files added yet</p>
                            <button
                              type="button"
                              onClick={handleAddFile}
                              className="mt-2 text-sm text-primary hover:text-primary-light"
                            >
                              Add your first file
                            </button>
                          </div>
                        ) : (
                          formData.warrantyFiles.map((fileUrl, index) => (
                            <div key={index} className="relative border border-gray-200 rounded-lg p-3 bg-gray-50">
                              <button
                                type="button"
                                onClick={() => handleRemoveFileSlot(index)}
                                className="absolute top-2 right-2 text-red-600 hover:text-red-900 z-10"
                                title="Remove this file slot"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <FileUpload
                                label={`File ${index + 1}`}
                                currentUrl={fileUrl}
                                onUploadComplete={(url) => handleFileUploadComplete(index, url)}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                maxSize={5}
                                helperText="Upload PDF, DOC, DOCX, JPG, or PNG (Max 5MB)"
                              />
                            </div>
                          ))
                        )}
                      </div>
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
                      {editingContact ? 'Update' : 'Create'} Contact
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
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Warranty Files ({Array.isArray(previewFile) ? previewFile.filter(f => f).length : 0})
                  </h3>
                  <button
                    onClick={() => setPreviewFile(null)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-auto bg-gray-50 p-4">
                  {Array.isArray(previewFile) && previewFile.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {previewFile.filter(f => f).map((fileUrl, index) => {
                        const isImage = fileUrl && (
                          fileUrl.toLowerCase().includes('.jpg') || 
                          fileUrl.toLowerCase().includes('.jpeg') || 
                          fileUrl.toLowerCase().includes('.png') || 
                          fileUrl.toLowerCase().includes('.gif') ||
                          fileUrl.toLowerCase().includes('.webp')
                        );
                        const isPdf = fileUrl && fileUrl.toLowerCase().includes('.pdf');

                        return (
                          <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">File {index + 1}</span>
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary-light transition-colors"
                              >
                                Open in New Tab
                              </a>
                            </div>
                            <div className="p-4">
                              {isImage ? (
                                <img 
                                  src={fileUrl} 
                                  alt={`File ${index + 1}`}
                                  className="w-full h-64 object-contain rounded"
                                />
                              ) : isPdf ? (
                                <div className="w-full h-64 flex flex-col items-center justify-center gap-3 bg-gray-100 rounded">
                                  <FileText className="h-16 w-16 text-primary" />
                                  <p className="text-sm text-gray-600">PDF Document</p>
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                  >
                                    Click to view
                                  </a>
                                </div>
                              ) : (
                                <div className="w-full h-64 flex flex-col items-center justify-center gap-3 bg-gray-100 rounded">
                                  <FileText className="h-16 w-16 text-gray-400" />
                                  <p className="text-sm text-gray-600">Document File</p>
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                  >
                                    Click to download
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No files available</p>
                    </div>
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

export default ContactsPage;
