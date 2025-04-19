import Constants from 'expo-constants';
import { 
  Bike, 
  BikeStatus, 
  BikeType, 
  RentBikeRequest, 
  RentBikeResponse, 
  User
} from '@bikr/shared';

// Import content-related types directly from post types
import type { 
  Comment, 
  CreateCommentInput, 
  Post,
  Like
} from '@bikr/shared/src/types/post';

// Define types needed for the feed features
// These match the types in shared/src/repositories/feedRepository.ts
interface GeoPoint {
  latitude: number;
  longitude: number;
}

interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface FeedQueryOptions {
  cursor?: string;
  limit?: number;
  contentTypes?: string[];
  dateRange?: DateRange;
  userId?: string;
  filters?: Record<string, any>;
}

interface FeedResult {
  posts: any[]; // Using any[] since we don't have the full DetailedPost type here
  nextCursor?: string;
  hasMore: boolean;
}

// API base URL - defaults to localhost but can be configured
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3001';
const API_VERSION = 'v1';
const API_BASE = `${API_URL}/api/${API_VERSION}`;

// Headers setup
const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Error handling
class APIError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Response handling
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new APIError(
      data.error || 'An unexpected error occurred',
      response.status,
      data
    );
  }

  return data;
};

// API Client
export const apiClient = {
  // Auth-related endpoints
  auth: {
    /**
     * Get the current user profile
     */
    getCurrentUser: async (token: string): Promise<User> => {
      const response = await fetch(`${API_BASE}/users/me`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      
      const data = await handleResponse(response);
      return data.user;
    },
  },

  // Content and post-related endpoints
  content: {
    /**
     * Get comments for a post
     */
    getCommentsByPostId: async (
      postId: string, 
      token?: string, 
      limit?: number, 
      offset?: number
    ): Promise<Comment[]> => {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      
      const url = `${API_BASE}/posts/${postId}/comments${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });
      
      return handleResponse(response);
    },
    
    /**
     * Create a comment on a post
     */
    createComment: async (
      postId: string, 
      input: CreateCommentInput, 
      token: string
    ): Promise<Comment> => {
      const response = await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(input),
      });
      
      return handleResponse(response);
    },
    
    /**
     * Update a comment
     */
    updateComment: async (
      commentId: string, 
      content: string, 
      token: string
    ): Promise<Comment> => {
      const response = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ content }),
      });
      
      return handleResponse(response);
    },
    
    /**
     * Delete a comment
     */
    deleteComment: async (
      commentId: string, 
      token: string
    ): Promise<boolean> => {
      const response = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      
      await handleResponse(response);
      return true;
    },
    
    /**
     * Like a comment
     */
    likeComment: async (
      commentId: string, 
      token: string
    ): Promise<void> => {
      const response = await fetch(`${API_BASE}/comments/${commentId}/like`, {
        method: 'POST',
        headers: getHeaders(token),
      });
      
      await handleResponse(response);
    },
    
    /**
     * Unlike a comment
     */
    unlikeComment: async (
      commentId: string, 
      token: string
    ): Promise<void> => {
      const response = await fetch(`${API_BASE}/comments/${commentId}/like`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      
      await handleResponse(response);
    },
    
    /**
     * Get a post by ID
     */
    getPostById: async (
      postId: string,
      token?: string
    ): Promise<Post> => {
      const response = await fetch(`${API_BASE}/posts/${postId}`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      
      return handleResponse(response);
    },
    
    /**
     * Create a new post
     */
    createPost: async (
      post: any, // Use proper type from shared library
      token: string
    ): Promise<Post> => {
      const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(post),
      });
      
      return handleResponse(response);
    },
    
    /**
     * Like a post
     */
    likePost: async (
      postId: string,
      token: string
    ): Promise<void> => {
      const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: 'POST',
        headers: getHeaders(token),
      });
      
      await handleResponse(response);
    },
    
    /**
     * Unlike a post
     */
    unlikePost: async (
      postId: string,
      token: string
    ): Promise<void> => {
      const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      
      await handleResponse(response);
    },
    
    /**
     * Get likes for a post
     */
    getPostLikes: async (
      postId: string,
      token?: string,
      limit?: number,
      offset?: number
    ): Promise<any[]> => { // Use proper Like[] type once imported from shared
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      
      const url = `${API_BASE}/posts/${postId}/likes${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });
      
      return handleResponse(response);
    }
  },

  // Feed-related endpoints
  feeds: {
    /**
     * Get user feed (posts from followed accounts)
     */
    getUserFeed: async (token: string, options?: Partial<FeedQueryOptions>): Promise<FeedResult> => {
      // Build query string
      const params = new URLSearchParams();
      if (options) {
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.cursor) params.append('cursor', options.cursor);
        if (options.contentTypes) {
          options.contentTypes.forEach((type: string) => params.append('contentTypes', type));
        }
        if (options.dateRange?.startDate) params.append('dateStart', options.dateRange.startDate);
        if (options.dateRange?.endDate) params.append('dateEnd', options.dateRange.endDate);
      }

      const url = `${API_BASE}/feeds/user${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      return handleResponse(response);
    },

    /**
     * Get popular/trending feed
     */
    getPopularFeed: async (token?: string, options?: Partial<FeedQueryOptions>): Promise<FeedResult> => {
      // Build query string
      const params = new URLSearchParams();
      if (options) {
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.cursor) params.append('cursor', options.cursor);
        if (options.contentTypes) {
          options.contentTypes.forEach((type: string) => params.append('contentTypes', type));
        }
        if (options.dateRange?.startDate) params.append('dateStart', options.dateRange.startDate);
        if (options.dateRange?.endDate) params.append('dateEnd', options.dateRange.endDate);
      }

      const url = `${API_BASE}/feeds/popular${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      return handleResponse(response);
    },

    /**
     * Get local feed (posts near a geographic location)
     */
    getLocalFeed: async (
      location: GeoPoint, 
      radius: number,
      token?: string, 
      options?: Partial<FeedQueryOptions>
    ): Promise<FeedResult> => {
      // Build query string
      const params = new URLSearchParams();
      params.append('latitude', location.latitude.toString());
      params.append('longitude', location.longitude.toString());
      params.append('radius', radius.toString());
      
      if (options) {
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.cursor) params.append('cursor', options.cursor);
        if (options.contentTypes) {
          options.contentTypes.forEach((type: string) => params.append('contentTypes', type));
        }
        if (options.dateRange?.startDate) params.append('dateStart', options.dateRange.startDate);
        if (options.dateRange?.endDate) params.append('dateEnd', options.dateRange.endDate);
      }

      const url = `${API_BASE}/feeds/local${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      return handleResponse(response);
    },

    /**
     * Get filtered feed by type and ID
     */
    getFilteredFeed: async (
      filterType: 'club' | 'event' | 'skillLevel' | 'bikeType',
      filterId: string,
      token?: string,
      options?: Partial<FeedQueryOptions>
    ): Promise<FeedResult> => {
      // Build query string
      const params = new URLSearchParams();
      if (options) {
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.cursor) params.append('cursor', options.cursor);
        if (options.contentTypes) {
          options.contentTypes.forEach((type: string) => params.append('contentTypes', type));
        }
        if (options.dateRange?.startDate) params.append('dateStart', options.dateRange.startDate);
        if (options.dateRange?.endDate) params.append('dateEnd', options.dateRange.endDate);
      }

      const url = `${API_BASE}/feeds/filtered/${filterType}/${filterId}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      return handleResponse(response);
    },

    /**
     * Get feed for a specific club
     */
    getClubFeed: async (
      clubId: string,
      token?: string,
      options?: Partial<FeedQueryOptions>
    ): Promise<FeedResult> => {
      // Build query string
      const params = new URLSearchParams();
      if (options) {
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.cursor) params.append('cursor', options.cursor);
        if (options.contentTypes) {
          options.contentTypes.forEach((type: string) => params.append('contentTypes', type));
        }
        if (options.dateRange?.startDate) params.append('dateStart', options.dateRange.startDate);
        if (options.dateRange?.endDate) params.append('dateEnd', options.dateRange.endDate);
      }

      const url = `${API_BASE}/feeds/club/${clubId}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      return handleResponse(response);
    },

    /**
     * Get feed for a specific event
     */
    getEventFeed: async (
      eventId: string,
      token?: string,
      options?: Partial<FeedQueryOptions>
    ): Promise<FeedResult> => {
      // Build query string
      const params = new URLSearchParams();
      if (options) {
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.cursor) params.append('cursor', options.cursor);
        if (options.contentTypes) {
          options.contentTypes.forEach((type: string) => params.append('contentTypes', type));
        }
        if (options.dateRange?.startDate) params.append('dateStart', options.dateRange.startDate);
        if (options.dateRange?.endDate) params.append('dateEnd', options.dateRange.endDate);
      }

      const url = `${API_BASE}/feeds/event/${eventId}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      return handleResponse(response);
    },
  },

  // Bike-related endpoints
  bikes: {
    /**
     * Get a list of available bikes
     */
    getAvailableBikes: async (
      token?: string,
      options?: {
        limit?: number;
        offset?: number;
        status?: BikeStatus;
        type?: BikeType;
        lat?: number;
        lng?: number;
        radius?: number;
      }
    ): Promise<{ bikes: Bike[]; count: number; total: number }> => {
      // Build query string
      const params = new URLSearchParams();
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }

      const url = `${API_BASE}/bikes${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      return handleResponse(response);
    },

    /**
     * Get a specific bike by ID
     */
    getBikeById: async (id: string, token?: string): Promise<Bike> => {
      const response = await fetch(`${API_BASE}/bikes/${id}`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      const data = await handleResponse(response);
      return data.bike;
    },

    /**
     * Rent a bike
     */
    rentBike: async (
      rentRequest: RentBikeRequest,
      token: string
    ): Promise<RentBikeResponse> => {
      const response = await fetch(`${API_BASE}/bikes/rent`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(rentRequest),
      });

      return handleResponse(response);
    },

    /**
     * Return a rented bike
     */
    returnBike: async (
      rentalId: string,
      endLocationLat: number,
      endLocationLng: number,
      token: string
    ): Promise<any> => {
      const response = await fetch(`${API_BASE}/rentals/${rentalId}/return`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({
          endLocationLat,
          endLocationLng,
        }),
      });

      return handleResponse(response);
    },
  },
};

// Simple API wrapper for use with repository pattern
export const api = {
  get: async <T>(url: string, options?: { params?: URLSearchParams }): Promise<{ data: T }> => {
    const queryString = options?.params ? `?${options.params.toString()}` : '';
    const response = await fetch(`${API_BASE}${url}${queryString}`, {
      method: 'GET',
      headers: getHeaders(), // Token handling is done in getHeaders
    });
    
    const data = await handleResponse(response);
    return { data };
  },
  
  post: async <T>(url: string, body?: any): Promise<{ data: T }> => {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const data = await handleResponse(response);
    return { data };
  },
  
  put: async <T>(url: string, body?: any): Promise<{ data: T }> => {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const data = await handleResponse(response);
    return { data };
  },
  
  delete: async <T>(url: string): Promise<{ data: T }> => {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    const data = await handleResponse(response);
    return { data };
  },
};

export default apiClient;
