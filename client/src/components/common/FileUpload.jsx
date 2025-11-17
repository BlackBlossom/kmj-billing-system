/**
 * FileUpload Component
 * Reusable file upload component with Cloudinary integration
 */

import { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadFile, deleteFile } from '../../services/uploadService';
import toast from 'react-hot-toast';

const FileUpload = ({ 
  onUploadComplete, 
  onUploadError,
  accept = 'image/*,.pdf',
  maxSize = 5, // MB
  label = 'Upload File',
  helperText,
  currentUrl = null,
  currentPublicId = null,
  showPreview = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl);
  const [uploadedPublicId, setUploadedPublicId] = useState(currentPublicId);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      const errorMsg = `File size must be less than ${maxSize}MB`;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Reset state
    setError(null);
    setProgress(0);
    setUploading(true);

    try {
      // Upload to Cloudinary via backend
      const response = await uploadFile(file, (progressPercent) => {
        setProgress(progressPercent);
      });

      // The axios interceptor unwraps response.data twice:
      // Backend sends: { success: true, data: { url, ... } }
      // Interceptor returns: response.data (the full backend response)
      // But then our service returns: response.data (which is the backend's data object)
      // So we get: { url, public_id, originalname, size, format } directly
      const fileUrl = response?.url;
      const publicId = response?.public_id;
      
      if (!fileUrl) {
        console.error('No URL in response:', response);
        throw new Error('No file URL received from server');
      }
      
      setUploadedUrl(fileUrl);
      setUploadedPublicId(publicId);
      setUploading(false);
      
      toast.success('File uploaded successfully!');
      
      if (onUploadComplete) {
        onUploadComplete(fileUrl, response);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to upload file';
      setError(errorMsg);
      setUploading(false);
      toast.error(errorMsg);
      
      if (onUploadError) {
        onUploadError(error);
      }
    }
  };

  const handleRemove = async () => {
    console.log('handleRemove called, uploadedPublicId:', uploadedPublicId);
    
    // Extract publicId from URL if not provided
    let publicIdToDelete = uploadedPublicId;
    
    if (!publicIdToDelete && uploadedUrl) {
      // Extract public_id from Cloudinary URL
      // URL format: https://res.cloudinary.com/xxx/image/upload/v123456/folder/filename.ext
      const urlParts = uploadedUrl.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
        // Get everything after /upload/ (skip version if present)
        const pathParts = urlParts.slice(uploadIndex + 1);
        // Skip version number (starts with 'v' followed by digits)
        const startIndex = pathParts[0].match(/^v\d+$/) ? 1 : 0;
        const publicIdWithExt = pathParts.slice(startIndex).join('/');
        // Remove file extension
        publicIdToDelete = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
        console.log('Extracted publicId from URL:', publicIdToDelete);
      }
    }
    
    // If there's a publicId, delete from Cloudinary
    if (publicIdToDelete) {
      if (!window.confirm('Are you sure you want to delete this file?')) {
        console.log('User cancelled deletion');
        return;
      }

      setDeleting(true);
      try {
        console.log('Calling deleteFile with publicId:', publicIdToDelete);
        await deleteFile(publicIdToDelete);
        toast.success('File deleted successfully');
        
        // Clear state after successful deletion
        setUploadedUrl(null);
        setUploadedPublicId(null);
        setError(null);
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (onUploadComplete) {
          onUploadComplete('');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete file from server');
      } finally {
        setDeleting(false);
      }
    } else {
      // No publicId, just clear the local state
      console.log('No publicId, just clearing local state');
      setUploadedUrl(null);
      setUploadedPublicId(null);
      setError(null);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onUploadComplete) {
        onUploadComplete('');
      }
    }
  };

  const isImage = uploadedUrl && (
    uploadedUrl.includes('.jpg') || 
    uploadedUrl.includes('.jpeg') || 
    uploadedUrl.includes('.png') || 
    uploadedUrl.includes('.gif') ||
    uploadedUrl.includes('.webp')
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Upload Button */}
        {!uploadedUrl && (
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              id="file-upload-input"
            />
            <label
              htmlFor="file-upload-input"
              className={`
                flex items-center justify-center gap-2 px-4 py-3 
                border-2 border-dashed rounded-lg cursor-pointer
                transition-all duration-200
                ${uploading 
                  ? 'border-primary-300 bg-primary-50 cursor-not-allowed' 
                  : 'border-neutral-300 hover:border-primary-500 hover:bg-primary-50'
                }
              `}
            >
              <Upload className={`h-5 w-5 ${uploading ? 'text-primary-500' : 'text-neutral-400'}`} />
              <span className={`text-sm ${uploading ? 'text-primary-600' : 'text-neutral-600'}`}>
                {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </span>
            </label>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="space-y-2">
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-neutral-600 text-center">
              Uploading... {progress}%
            </p>
          </div>
        )}

        {/* Preview */}
        {uploadedUrl && showPreview && (
          <div className="relative border border-neutral-200 rounded-lg p-3 bg-neutral-50">
            <button
              onClick={handleRemove}
              disabled={deleting}
              className={`absolute top-2 right-2 p-1 text-white rounded-full transition-colors ${
                deleting 
                  ? 'bg-red-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              title={deleting ? 'Deleting...' : 'Remove file'}
            >
              <X className={`h-4 w-4 ${deleting ? 'animate-spin' : ''}`} />
            </button>

            {isImage ? (
              <div className="space-y-2">
                <img 
                  src={uploadedUrl} 
                  alt="Uploaded preview" 
                  className="w-full h-40 object-cover rounded"
                />
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800"
                >
                  <CheckCircle className="h-4 w-4" />
                  View full size
                </a>
              </div>
            ) : (
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800"
              >
                <File className="h-5 w-5" />
                <span className="flex-1">File uploaded successfully</span>
                <CheckCircle className="h-4 w-4" />
              </a>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="text-xs text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
