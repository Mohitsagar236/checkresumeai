import React, { useState, useRef } from 'react';
import { cn } from '../../utils/cn';
import { FileIcon, UploadCloud, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// FileUpload component props

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onFileSelected?: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  supportedFormats?: string[];
  isLoading?: boolean;
  loadingText?: string;
}

export function FileUpload({
  className,
  onFileSelected,
  accept = '.pdf,.docx',
  maxSize = 5 * 1024 * 1024, // 5MB default
  supportedFormats = ['PDF', 'DOCX'],
  isLoading = false,
  loadingText = 'Processing file...',
  ...props
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);

    if (!file.type.includes('pdf') && !file.type.includes('word') && !file.type.includes('docx')) {
      setError(`Unsupported file format. Please upload a ${supportedFormats.join(' or ')} file.`);
      return;
    }

    if (file.size > maxSize) {
      setError(`File size exceeds the limit of ${maxSize / (1024 * 1024)}MB.`);
      return;
    }

    setFile(file);
    
    // Added slight delay to ensure UI updates first
    setTimeout(() => {
      if (onFileSelected) {
        onFileSelected(file);
      }
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {!file ? (
        <motion.div
          className={cn(
            'group flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-all backdrop-blur-sm shadow-luxury hover:shadow-luxury-lg dark:shadow-slate-900/30 dark:hover:shadow-slate-900/40 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
            dragActive
              ? 'border-blue-400 bg-blue-50/80 dark:border-blue-500 dark:bg-blue-900/20 scale-[1.02]'
              : 'border-blue-300 bg-gradient-to-br from-gray-50/80 to-blue-50/50 hover:from-blue-50/60 hover:to-purple-50/40 dark:border-blue-700/50 dark:bg-gradient-to-br dark:from-gray-800/40 dark:to-slate-700/30 dark:hover:from-blue-900/20 dark:hover:to-purple-900/10',
            error && 'border-red-500 bg-red-50 dark:bg-red-900/20',
            isLoading && 'opacity-75 pointer-events-none'
          )}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Upload file"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          animate={{ scale: dragActive ? 1.02 : 1, y: dragActive ? -5 : 0 }}
          whileHover={{ scale: 1.01, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)" }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full">
            <motion.div 
              className={cn(
                'flex items-center justify-center w-20 h-20 rounded-full mb-4 relative',
                error ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30',
                'group-hover:from-blue-200 group-hover:to-purple-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-purple-800/50 transition-all duration-300 shadow-luxury'
              )}
              animate={{ y: dragActive ? -5 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {isLoading ? (
                <Loader2 className="w-10 h-10 text-blue-500 dark:text-blue-400 animate-spin" />
              ) : (
                <>
                  <UploadCloud className={cn(
                    'w-10 h-10',
                    error ? 'text-red-500' : 'text-blue-500 dark:text-blue-400'
                  )} />
                  <div className="absolute -bottom-1 -right-1 bg-gradient-luxury-blue text-white dark:bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center shadow-luxury group-hover:scale-110 transition-all duration-300">
                    <span className="text-xs font-bold">+</span>
                  </div>
                </>
              )}
            </motion.div>
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300 font-luxury">
              {isLoading ? loadingText : (
                <span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-3 py-1.5 rounded-md shadow-luxury border border-blue-200 dark:border-blue-800/50 cursor-pointer hover:from-blue-200 hover:to-purple-200 dark:hover:from-blue-800/50 dark:hover:to-purple-800/50 transition-all duration-300">Click to upload</span> or drag and drop
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-luxury">
              {supportedFormats.join(' or ')} (max {maxSize / (1024 * 1024)}MB)
            </p>
            {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept={accept}
            disabled={isLoading}
            {...props}
          />
        </motion.div>
      ) : (
        <div className={cn(
          'relative flex items-center gap-4 p-4 border rounded-lg bg-gradient-to-r from-white/80 to-blue-50/50 dark:from-gray-800/80 dark:to-slate-700/50 backdrop-blur-sm border-blue-200 dark:border-blue-700/50 shadow-luxury',
          isLoading && 'opacity-75'
        )}>
          <div className="flex-1 flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800/50 shadow-luxury">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-blue-500 dark:text-blue-400 animate-spin" />
              ) : (
                <FileIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate font-luxury">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-luxury">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <motion.button
            type="button"
            onClick={handleRemoveFile}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-red-100 dark:from-gray-700 dark:to-red-900/30 text-gray-500 hover:text-red-500 hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-900/40 transition-all duration-300 shadow-luxury hover:shadow-luxury-md"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      )}
    </div>
  );
}