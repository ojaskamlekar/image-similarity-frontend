/**
 * API Service for Image Similarity Search
 * 
 * Handles communication with the backend /search-similar endpoint
 */

// API configuration - update this URL to match your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface SearchResponse {
  similar_images: string[];
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Searches for visually similar images using the backend API
 * 
 * @param imageFile - The image file to search for similar images
 * @returns Promise with array of similar image URLs
 * @throws ApiError if the request fails
 */
export async function searchSimilarImages(imageFile: File): Promise<string[]> {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/search-similar`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header - browser will set it with boundary for multipart
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw {
        message: `Search failed: ${errorText}`,
        status: response.status,
      } as ApiError;
    }

    const data: SearchResponse = await response.json();
    return data.similar_images || [];
  } catch (error) {
    // Re-throw ApiError as-is
    if ((error as ApiError).status) {
      throw error;
    }

    // Network or other errors
    throw {
      message: 'Network error. Please check your connection and try again.',
    } as ApiError;
  }
}

/**
 * Mock function for testing without backend
 * Returns placeholder images after a simulated delay
 */
export async function mockSearchSimilarImages(_imageFile: File): Promise<string[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return realistic product/fashion style images from Unsplash
  return [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055uj-a3f81?w=400&h=400&fit=crop',
  ];
}
