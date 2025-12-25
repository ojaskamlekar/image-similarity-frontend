import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ImageResultsGridProps {
  images: string[];
  isLoading: boolean;
}

/**
 * Skeleton loader for image grid items
 */
const SkeletonCard: React.FC = () => (
  <div className="aspect-square skeleton-pulse rounded-xl" />
);

/**
 * Single image result card with hover effects
 */
const ImageCard: React.FC<{ src: string; index: number }> = ({ src, index }) => {
  return (
    <div
      className="image-grid-item aspect-square opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
    >
      <img
        src={src}
        alt={`Similar image ${index + 1}`}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';
        }}
      />
      
      {/* Subtle hover overlay */}
      <div className="absolute inset-0 flex items-end justify-center p-3 opacity-0 hover:opacity-100 transition-opacity duration-200 z-10">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background/80 text-foreground text-xs font-medium hover:bg-background transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3" />
          View
        </a>
      </div>
    </div>
  );
};

/**
 * Responsive grid displaying similar images with loading skeletons
 */
const ImageResultsGrid: React.FC<ImageResultsGridProps> = ({
  images,
  isLoading,
}) => {
  // Show skeletons while loading
  if (isLoading) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Finding similar images...
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Don't render if no images
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="w-full animate-fade-in">
      {/* Results header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Similar Images
        </h2>
        <span className="text-sm text-muted-foreground">
          {images.length} result{images.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, index) => (
          <ImageCard key={`${src}-${index}`} src={src} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ImageResultsGrid;
