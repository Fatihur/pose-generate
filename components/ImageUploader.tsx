import React, { useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onFileSelect: (file: File, url: string) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onFileSelect(file, url);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onFileSelect(file, url);
    }
  }, [onFileSelect]);

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <label
        className={`flex justify-center items-center w-full h-48 rounded-lg cursor-pointer transition-all duration-300 ease-in-out overflow-hidden
          ${previewUrl 
            ? 'border-2 border-solid border-indigo-500 shadow-md' 
            : 'border-2 border-dashed border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-indigo-50'
          }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out transform scale-[1.03] hover:scale-110" 
          />
        ) : (
          <div className="text-center text-gray-500">
            <UploadIcon />
            <p className="mt-2 text-sm">Drag & drop an image, or click to select</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;