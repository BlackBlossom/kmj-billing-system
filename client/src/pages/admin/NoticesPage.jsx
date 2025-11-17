import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { Image } from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import './NoticesPage.css';
import {
  BellIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, Button, Badge } from '../../components/common';
import { ANIMATION_VARIANTS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice
} from '../../services/noticeService';

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    expired: 0,
    totalViews: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    expiryDate: ''
  });

  // TipTap editor for rich text editing
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'listItem'],
      }),
      Image,
      Color,
      TextStyle,
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData(prev => ({ ...prev, content: html }));
    },
  });

  // Use editorState hook for proper reactivity in toolbar
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return {};
      return {
        isBold: ctx.editor.isActive('bold'),
        isItalic: ctx.editor.isActive('italic'),
        isStrike: ctx.editor.isActive('strike'),
        isH1: ctx.editor.isActive('heading', { level: 1 }),
        isH2: ctx.editor.isActive('heading', { level: 2 }),
        isH3: ctx.editor.isActive('heading', { level: 3 }),
        isBulletList: ctx.editor.isActive('bulletList'),
        isOrderedList: ctx.editor.isActive('orderedList'),
        isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }),
        isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }),
        isAlignRight: ctx.editor.isActive({ textAlign: 'right' }),
      };
    },
  });

  // Update editor content when formData changes (for edit mode)
  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content || '');
    }
  }, [formData.content, editor]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const params = {
        includeExpired: true, // Admin can see all notices
        limit: 100
      };
      const response = await getAllNotices(params);
      const noticesList = response.data.notices;
      setNotices(noticesList);
      
      // Calculate stats
      const now = new Date();
      setStats({
        total: noticesList.length,
        expired: noticesList.filter(n => new Date(n.expiryDate) < now).length,
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
      setFormData({
        title: notice.title,
        content: notice.content,
        expiryDate: notice.expiryDate ? new Date(notice.expiryDate).toISOString().split('T')[0] : ''
      });
    } else {
      setEditingNotice(null);
      setFormData({
        title: '',
        content: '',
        expiryDate: ''
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
      expiryDate: ''
    });
    // Clear editor content
    if (editor) {
      editor.commands.setContent('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const noticeData = {
        title: formData.title,
        content: formData.content,
        expiryDate: formData.expiryDate
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

  // Check if notice is expired
  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
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
                {/* <BellIcon className="w-10 h-10 text-[#31757A]" /> */}
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

        {/* Search Bar */}
        <motion.div
          variants={ANIMATION_VARIANTS.slideUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <Card className="shadow-xl border-0 overflow-hidden">
            <Card.Content className="p-6">
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
                        {searchQuery
                          ? 'Try adjusting your search'
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
                      <div className="flex gap-4">
                        {/* Notice Icon */}
                        <div className="shrink-0">
                          <div className={cn(
                            "p-3 rounded-xl",
                            isExpired(notice.expiryDate) ? "bg-gray-100" : "bg-[#E3F9F9]"
                          )}>
                            <BellIcon className={cn(
                              "w-6 h-6",
                              isExpired(notice.expiryDate) ? "text-gray-500" : "text-[#31757A]"
                            )} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#31757A] transition-colors">
                                {notice.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2">
                                {isExpired(notice.expiryDate) && (
                                  <Badge className="bg-gray-200 text-gray-700 border-gray-300" size="sm">
                                    <ClockIcon className="w-3.5 h-3.5 mr-1 inline" />
                                    Expired
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenModal(notice)}
                                className="text-[#31757A] hover:bg-[#E3F9F9] hover:text-[#41A4A7] border border-transparent hover:border-[#31757A] transition-all"
                                title="Edit"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(notice._id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                                title="Delete"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>

                          {/* Content Preview */}
                          <div 
                            className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: notice.content }}
                          />

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <EyeIcon className="w-4 h-4 text-purple-600" />
                              <span className="font-medium">{notice.views || 0} views</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <CalendarIcon className="w-4 h-4 text-blue-600" />
                              <span>Created: {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}</span>
                            </div>
                            <div className={cn(
                              "flex items-center gap-1.5 font-semibold",
                              isExpired(notice.expiryDate) ? "text-gray-500" : "text-red-600"
                            )}>
                              <ClockIcon className="w-4 h-4" />
                              <span>Expires: {new Date(notice.expiryDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}</span>
                            </div>
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
                <div className="border-b-2 border-gray-300 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl">
                        <BellIcon className="w-6 h-6 text-white" />
                      </div> */}
                      <h2 className="text-2xl font-bold text-black">
                        {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                      </h2>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 hover:bg-white/20 rounded-xl transition-colors text-gray-600"
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
                      <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#31757A] focus-within:border-[#31757A] transition-all bg-white">
                        {/* Editor Toolbar */}
                        {editor && (
                          <div className="flex flex-wrap gap-1.5 p-3 border-b border-gray-200 bg-gray-50">
                            {/* Text Formatting */}
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().toggleBold().run()}
                              className={`px-3 py-2 rounded-lg text-sm border-2 transition-all flex items-center gap-1.5 ${
                                editorState.isBold
                                  ? 'bg-[#31757A] text-white border-[#31757A] shadow-lg ring-2 ring-[#31757A] ring-opacity-50' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#31757A]'
                              }`}
                              title="Bold (Ctrl+B)"
                            >
                              <Bold className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().toggleItalic().run()}
                              className={`px-3 py-2 rounded-lg text-sm border-2 transition-all flex items-center gap-1.5 ${
                                editorState.isItalic
                                  ? 'bg-[#31757A] text-white border-[#31757A] shadow-lg ring-2 ring-[#31757A] ring-opacity-50' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#31757A]'
                              }`}
                              title="Italic (Ctrl+I)"
                            >
                              <Italic className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().toggleStrike().run()}
                              className={`px-3 py-2 rounded-lg text-sm border-2 transition-all flex items-center gap-1.5 ${
                                editorState.isStrike
                                  ? 'bg-[#31757A] text-white border-[#31757A] shadow-lg ring-2 ring-[#31757A] ring-opacity-50' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#31757A]'
                              }`}
                              title="Strikethrough"
                            >
                              <Strikethrough className="w-4 h-4" />
                            </button>
                            
                            <div className="w-px h-8 bg-gray-300 mx-1"></div>
                            
                            {/* Headings */}
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                              className={`px-3 py-2 rounded-lg text-sm border-2 transition-all flex items-center gap-1.5 ${
                                editorState.isH1
                                  ? 'bg-[#31757A] text-white border-[#31757A] shadow-md' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                              }`}
                              title="Heading 1"
                            >
                              <Heading1 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                              className={`px-3 py-2 rounded-lg text-sm border-2 transition-all flex items-center gap-1.5 ${
                                editorState.isH2
                                  ? 'bg-[#31757A] text-white border-[#31757A] shadow-md' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                              }`}
                              title="Heading 2"
                            >
                              <Heading2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                              className={`px-3 py-2 rounded-lg text-sm border-2 transition-all flex items-center gap-1.5 ${
                                editorState.isH3
                                  ? 'bg-[#31757A] text-white border-[#31757A] shadow-md' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                              }`}
                              title="Heading 3"
                            >
                              <Heading3 className="w-4 h-4" />
                            </button>
                            
                            <div className="w-px h-8 bg-gray-300 mx-1"></div>
                            
                            {/* Lists */}
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().toggleBulletList().run()}
                              className={`px-3 py-2 rounded text-sm transition-all border-2 flex items-center gap-1.5 ${
                                editorState.isBulletList
                                  ? 'bg-[#31757A] text-white border-[#31757A] shadow-md' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-[#31757A]'
                              }`}
                              title="Bullet List"
                            >
                              <List className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().toggleOrderedList().run()}
                              className={`px-3 py-2 rounded text-sm transition-all border-2 flex items-center gap-1.5 ${
                                editorState.isOrderedList
                                  ? 'bg-[#31757A] text-white border-[#31757A] shadow-md' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-[#31757A]'
                              }`}
                              title="Numbered List"
                            >
                              <ListOrdered className="w-4 h-4" />
                            </button>
                            
                            <div className="w-px h-8 bg-gray-300 mx-1"></div>
                            
                            {/* Alignment */}
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().setTextAlign('left').run()}
                              className={`px-3 py-2 rounded text-sm transition-all border-2 flex items-center gap-1.5 ${
                                editorState.isAlignLeft
                                  ? 'bg-[#31757A] text-white border-[#31757A] shadow-md' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-[#31757A]'
                              }`}
                              title="Align Left"
                            >
                              <AlignLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().setTextAlign('center').run()}
                              className={`px-3 py-2 rounded text-sm transition-all border-2 flex items-center gap-1.5 ${
                                editorState.isAlignCenter
                                  ? 'bg-[#31757A] text-white border-[#31757A] shadow-md' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-[#31757A]'
                              }`}
                              title="Align Center"
                            >
                              <AlignCenter className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().setTextAlign('right').run()}
                              className={`px-3 py-2 rounded text-sm transition-all border-2 flex items-center gap-1.5 ${
                                editorState.isAlignRight
                                  ? 'bg-[#31757A] text-white border-[#31757A] shadow-md' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-[#31757A]'
                              }`}
                              title="Align Right"
                            >
                              <AlignRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        {/* Editor Content */}
                        <div className="p-4 min-h-[300px] bg-white">
                          {editor ? (
                            <EditorContent editor={editor} />
                          ) : (
                            <div className="text-gray-400 italic">Loading editor...</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-16">
                      <label className="block text-sm font-bold text-gray-700 mb-2.5">
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#31757A] focus:border-[#31757A] transition-all outline-none shadow-sm hover:shadow-md"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                      <p className="mt-2 text-sm text-gray-500">Notice will automatically expire after this date</p>
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
