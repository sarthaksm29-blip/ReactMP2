import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Link as LinkIcon, X } from 'lucide-react';

export default function ImageUploader({ value, onChange, isCirclePreview = false }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // Sync internal tab if value is an external URL vs Base64
  useEffect(() => {
    if (value && value.startsWith('http') && activeTab !== 'url') {
      setActiveTab('url');
    } else if (value && value.startsWith('data:image') && activeTab !== 'upload') {
      setActiveTab('upload');
    }
  }, [value]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max size is 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex p-1 bg-cream-100 dark:bg-nature-950 rounded-lg">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'upload' 
              ? 'bg-white dark:bg-nature-800 text-nature-800 dark:text-nature-200 shadow-sm' 
              : 'text-nature-500 hover:text-nature-700 dark:hover:text-nature-300'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'url' 
              ? 'bg-white dark:bg-nature-800 text-nature-800 dark:text-nature-200 shadow-sm' 
              : 'text-nature-500 hover:text-nature-700 dark:hover:text-nature-300'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          Paste URL
        </button>
      </div>

      {/* Content */}
      <div className="flex gap-4">
        <div className="flex-1">
          {activeTab === 'upload' ? (
            value && value.startsWith('data:image') ? (
              <div className="relative rounded-lg overflow-hidden border border-cream-200 dark:border-nature-800 bg-cream-50 dark:bg-nature-950">
                <img 
                  src={value} 
                  alt="Preview" 
                  className={`w-full object-cover ${isCirclePreview ? 'aspect-square rounded-full max-h-48 max-w-48 mx-auto' : 'max-h-44 rounded-lg'}`}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-500/90 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className={`relative min-h-[140px] flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                  dragActive 
                    ? 'border-nature-500 bg-nature-50 dark:bg-nature-900/50' 
                    : 'border-[#639922] bg-white dark:bg-nature-950 hover:bg-cream-50 dark:hover:bg-nature-900/30'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
              >
                <input 
                  ref={inputRef}
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <UploadCloud className="w-8 h-8 text-[#639922] mb-3" />
                <p className="text-sm font-medium text-nature-700 dark:text-nature-300">Click to upload or drag & drop</p>
                <p className="text-xs text-nature-500 mt-1">JPG, PNG, WEBP up to 5MB</p>
              </div>
            )
          ) : (
            <div className="space-y-2">
              <input 
                type="url" 
                placeholder="https://images.unsplash.com/..." 
                value={value && value.startsWith('http') ? value : ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 rounded-lg border border-cream-300 dark:border-nature-700 bg-white dark:bg-nature-950 focus:ring-2 focus:ring-[#639922] outline-none transition-all dark:text-cream-50"
              />
            </div>
          )}
        </div>

        {/* Circular preview when using URL tab in AddPlant (optional based on isCirclePreview) */}
        {activeTab === 'url' && isCirclePreview && value && value.startsWith('http') && (
          <div className="w-20 h-20 shrink-0">
             <img src={value} alt="Preview" className="w-full h-full object-cover rounded-full border-2 border-cream-200 dark:border-nature-800" onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Invalid'} />
          </div>
        )}
      </div>
    </div>
  );
}
