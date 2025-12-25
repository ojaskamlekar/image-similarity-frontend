import React, { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import ImageUploadZone from '@/components/ImageUploadZone';
import SearchButton from '@/components/SearchButton';
import ImageResultsGrid from '@/components/ImageResultsGrid';
import { searchSimilarImages, mockSearchSimilarImages, ApiError } from '@/services/imageSearchApi';

/**
 * Main page component for AI Image Similarity Search
 * 
 * Features:
 * - Image upload via drag & drop or file picker
 * - Preview of uploaded image
 * - Search button to find similar images
 * - Loading state with skeleton loaders
 * - Responsive results grid
 * - Error handling with toast notifications
 */
const Index: React.FC = () => {
  const { toast } = useToast();
  
  // State for selected image file and its preview URL
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // State for search results and loading
  const [similarImages, setSimilarImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Use mock API for demo (set to false to use real backend)
  const useMockApi = true;

  // Create preview URL when image is selected
  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      
      // Cleanup URL on unmount or when image changes
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage]);

  // Handle image selection
  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setSimilarImages([]); // Clear previous results
    setHasSearched(false);
  }, []);

  // Clear selected image
  const handleClear = useCallback(() => {
    setSelectedImage(null);
    setSimilarImages([]);
    setHasSearched(false);
  }, []);

  // Handle search
  const handleSearch = useCallback(async () => {
    if (!selectedImage) {
      toast({
        title: 'No image selected',
        description: 'Please upload an image first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Use mock or real API based on configuration
      const searchFn = useMockApi ? mockSearchSimilarImages : searchSimilarImages;
      const results = await searchFn(selectedImage);
      
      setSimilarImages(results);

      if (results.length === 0) {
        toast({
          title: 'No similar images found',
          description: 'Try uploading a different image.',
        });
      } else {
        toast({
          title: 'Search complete',
          description: `Found ${results.length} similar image${results.length !== 1 ? 's' : ''}.`,
        });
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: 'Search failed',
        description: apiError.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      setSimilarImages([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedImage, toast, useMockApi]);

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header with branding */}
        <Header />

        {/* Main content area */}
        <main className="space-y-8">
          {/* Upload section */}
          <section className="max-w-2xl mx-auto">
            <ImageUploadZone
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClear={handleClear}
              previewUrl={previewUrl}
            />
          </section>

          {/* Search button */}
          {selectedImage && (
            <section className="flex justify-center animate-fade-in">
              <SearchButton
                onClick={handleSearch}
                isLoading={isLoading}
                disabled={!selectedImage}
              />
            </section>
          )}

          {/* Results section */}
          <section className="pt-6 border-t border-border/40">
            {(isLoading || similarImages.length > 0) ? (
              <ImageResultsGrid images={similarImages} isLoading={isLoading} />
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground text-sm">
                  Upload an image to see similar results here.
                </p>
              </div>
            )}
          </section>

          {/* Empty state after search with no results */}
          {hasSearched && !isLoading && similarImages.length === 0 && (
            <section className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No similar images found
              </h3>
              <p className="text-muted-foreground">
                Try uploading a different image to find matches.
              </p>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground/70">
            Powered by deep learning embeddings
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
