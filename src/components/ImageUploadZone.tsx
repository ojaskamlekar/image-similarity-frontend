import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadZoneProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  previewUrl: string | null;
}

/**
 * Drag & drop image upload zone with file picker
 * Accepts only image files (JPEG, PNG, WebP, GIF)
 */
const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImageSelect,
  selectedImage,
  onClear,
  previewUrl,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Allowed image MIME types
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  // Validate file type
  const isValidFile = (file: File): boolean => {
    return acceptedTypes.includes(file.type);
  };

  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      onImageSelect(file);
    }
  };

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle file drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && isValidFile(file)) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  return (
    <div className="w-full">
      {/* Show upload zone when no image selected */}
      {!selectedImage ? (
        <div>
          <label
            className={`upload-zone flex flex-col items-center justify-center min-h-[240px] cursor-pointer group ${
              isDragging ? 'dragging' : ''
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {/* Upload icon */}
            <div className="mb-4">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-200">
                <Upload className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              </div>
            </div>

            <h3 className="text-base font-medium text-foreground mb-1">
              Drop your image here
            </h3>
            <p className="text-muted-foreground text-sm mb-3">
              or click to browse
            </p>
            <p className="text-muted-foreground/70 text-xs">
              Supports: JPEG, PNG, WebP, GIF
            </p>
          </label>
          {/* Helper text */}
          <p className="text-center text-muted-foreground/60 text-xs mt-3">
            Works best with product, fashion, and object images.
          </p>
        </div>
      ) : (
        /* Show preview when image is selected */
        <div className="bg-card border border-border rounded-xl p-4 animate-scale-in">
          <div className="relative">
            {/* Image preview */}
            <div className="relative overflow-hidden rounded-lg aspect-video bg-secondary/30">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Selected image preview"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Clear button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
              onClick={onClear}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* File info */}
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {selectedImage.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadZone;
