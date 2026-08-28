import { useState, useRef } from 'react';
import { Upload, X, Link as LinkIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CloudinaryImageUpload({ images = [], onChange, label = "Property Photos" }) {
  // Config state (Env variables or LocalStorage fallback)
  const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const envUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

  const [cloudName] = useState(
    () => envCloudName || localStorage.getItem('cl_cloud_name') || 'dopurvmlr'
  );
  const [uploadPreset] = useState(
    () => envUploadPreset || localStorage.getItem('cl_upload_preset') || 'getnest'
  );

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const fileInputRef = useRef(null);


  // Direct Frontend Upload to Cloudinary API
  const uploadFileToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      const activeCloudName = cloudName.trim();
      const activePreset = uploadPreset.trim();

      if (!activeCloudName || !activePreset) {
        toast.error('Cloudinary credentials missing in environment variables');
        reject(new Error('Cloudinary credentials missing'));
        return;
      }

      const url = `https://api.cloudinary.com/v1_1/${activeCloudName}/image/upload`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append('file', file);
      formData.append('upload_preset', activePreset);

      xhr.open('POST', url, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          try {
            const errRes = JSON.parse(xhr.responseText);
            reject(new Error(errRes.error?.message || 'Upload failed'));
          } catch {
            reject(new Error('Failed to upload image to Cloudinary'));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during upload'));
      };

      xhr.send(formData);
    });
  };

  const handleFiles = async (files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      toast.error('Please select valid image files (JPG, PNG, WebP, GIF)');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const uploadedUrls = [];
    let successCount = 0;

    for (let i = 0; i < validFiles.length; i++) {
      try {
        const file = validFiles[i];
        const url = await uploadFileToCloudinary(file);
        uploadedUrls.push(url);
        successCount++;
      } catch (err) {
        toast.error(`File ${validFiles[i].name}: ${err.message}`);
      }
    }

    if (uploadedUrls.length > 0) {
      const updatedList = [...images, ...uploadedUrls];
      onChange(updatedList);
      toast.success(`Successfully uploaded ${successCount} image${successCount > 1 ? 's' : ''}!`);
    }

    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeImage = (indexToRemove) => {
    const updated = images.filter((_, index) => index !== indexToRemove);
    onChange(updated);
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (!manualUrl.startsWith('http://') && !manualUrl.startsWith('https://')) {
      toast.error('Please enter a valid HTTP/HTTPS image URL');
      return;
    }
    onChange([...images, manualUrl.trim()]);
    setManualUrl('');
    setShowManualInput(false);
    toast.success('Image URL added');
  };

  return (
    <div className="space-y-4 font-sans text-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {label} ({images.length})
        </label>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-xs text-[var(--color-primary)] hover:opacity-80 flex items-center gap-1 transition"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            {showManualInput ? 'Hide URL input' : 'Add via URL'}
          </button>
        </div>
      </div>

      {/* Manual URL Input */}
      {showManualInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Paste image web URL (https://...)"
            className="flex-grow bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)]"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
            style={{ background: 'var(--color-primary)' }}
          >
            Add
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 scale-[1.01]'
            : 'border-[var(--border-color)] hover:border-[var(--color-primary)]/50 bg-[var(--bg-card-hover)]'
        } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
              <p className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                Uploading to Cloudinary... ({uploadProgress}%)
              </p>
              <div className="w-48 bg-[var(--border-color)] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%`, background: 'var(--color-primary)' }}
                />
              </div>
            </div>
          ) : (
            <>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-1 border"
                style={{ background: 'var(--color-primary)10', borderColor: 'var(--color-primary)', color: 'var(--color-primary)', opacity: 0.8 }}
              >
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Click to upload or drag & drop images
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Cloudinary upload — JPG, PNG, WebP (Max 10MB each)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Uploaded Images Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Uploaded Preview Gallery ({images.length}):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((url, index) => (
              <div
                key={index}
                className="group relative aspect-video bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-md hover:border-[var(--color-primary)]/50 transition"
              >
                <img
                  src={url}
                  alt={`Upload preview ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80';
                  }}
                />

                {/* Badge indicator */}
                <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-white border border-white/10">
                  #{index + 1}
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
