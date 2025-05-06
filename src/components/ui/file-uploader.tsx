import React, { useCallback, useState } from 'react';
import ButtonWithVariant from './ButtonWithVariant';

type FileUploaderProps = {
  onFileSelected: (file: File) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelected,
  accept = '*/*',
  multiple = false,
  className = '',
  children = 'Upload File'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
      <div className="space-y-2">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div className="flex text-sm text-gray-600">
          <ButtonWithVariant
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            className="mx-auto"
          >
            {children}
          </ButtonWithVariant>

        </div>
        <p className="text-xs text-gray-500">
          {accept === '*/*' ? 'Any file type' : `Supported formats: ${accept}`}
        </p>
      </div>
    </div>
  );
};

export default FileUploader;
