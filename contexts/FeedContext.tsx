import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../services/api';
import { feedCache, FeedResult, Post } from '../utils/feedCache';

// Define the state for the feed context
interface FeedContextState {
  // Feed data
  userFeed: {
    posts: Post[];
    nextCursor?: string;
    hasMore: boolean;
    loading: boolean;
    refreshing: boolean;
    error?: string;
  };
  popularFeed: {
    posts: Post[];
    nextCursor?: string;
    hasMore: boolean;
    loading: boolean;
    refreshing: boolean;
    error?: string;
  };
  localFeed: {
    posts: Post[];
    nextCursor?: string;
    hasMore: boolean;
    loading: boolean;
    refreshing: boolean;
    error?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    radius: number;
  };
  // Method for loading user feed
  loadUserFeed: (refresh?: boolean) => Promise<void>;
  
  // Method for loading popular feed
  loadPopularFeed: (refresh?: boolean) => Promise<void>;
  
  // Method for loading local feed
  loadLocalFeed: (refresh?: boolean) => Promise<void>;
  
  // Method for loading filtered feed (club, event, etc.)
  loadFilteredFeed: (
    filterType: 'club' | 'event' | 'skillLevel' | 'bikeType',
    filterId: string,
    refresh?: boolean
  ) => Promise<FeedResult>;
  
  // Method for clearing cache
  clearCache: () => void;
}

// Create the context
export const FeedContext = createContext<FeedContextState | null>(null);

// Feed provider props
interface FeedProviderProps {
  children: ReactNode;
}

// Default limit for feed requests
const DEFAULT_LIMIT = 10;

// Feed provider component
export const FeedProvider: React.FC<FeedProviderProps> = ({ children }) => {
  const { session } = useAuth();
  const token = session?.session?.access_token;
  
  // User feed state
  const [userFeed, setUserFeed] = useState<FeedContextState['userFeed']>({
    posts: [],
    hasMore: false,
    loading: false,
    refreshing: false,
  });
  
  // Popular feed state
  const [popularFeed, setPopularFeed] = useState<FeedContextState['popularFeed']>({
    posts: [],
    hasMore: false,
    loading: false,
    refreshing: false,
  });
  
  // Local feed state
  const [localFeed, setLocalFeed] = useState<FeedContextState['localFeed']>({
    posts: [],
    hasMore: false,
    loading: false,
    refreshing: false,
    radius: 20, // Default 20km radius
  });
  
  // Load user feed
  const loadUserFeed = useCallback(async (refresh = false) => {
    if (!token) {
      setUserFeed(prev => ({ ...prev, error: 'Authentication required' }));
      return;
    }
    
    // If refreshing, set refreshing state
    if (refresh) {
      setUserFeed(prev => ({ ...prev, refreshing: true, error: undefined }));
    } else {
      // If loading more, set loading state
      // Don't load more if already loading or no more items
      if (userFeed.loading || (!refresh && !userFeed.hasMore)) {
        return;
      }
      setUserFeed(prev => ({ ...prev, loading: true, error: undefined }));
    }
    
    try {
      // Prepare options
      const options: Record<string, any> = {
        limit: DEFAULT_LIMIT,
      };
      
      // Add cursor for pagination if not refreshing
      if (!refresh && userFeed.nextCursor) {
        options.cursor = userFeed.nextCursor;
      }
      
      // Check cache first if not refreshing
      let feedData: FeedResult | null = null;
      if (!refresh) {
        feedData = feedCache.getFeed('user', options);
      }
      
      // If no cached data, fetch from API
      if (!feedData) {
        feedData = await apiClient.feeds.getUserFeed(token, options);
        
        // Cache the result
        if (feedData) {
          feedCache.storeFeed('user', feedData, options);
        }
      }
      
      // Update state
      if (feedData) {
        setUserFeed(prev => ({
          posts: refresh ? feedData!.posts : [...prev.posts, ...feedData!.posts],
          nextCursor: feedData!.nextCursor,
          hasMore: feedData!.hasMore,
          loading: false,
          refreshing: false,
        }));
      }
    } catch (error: any) {
      console.error('Error loading user feed:', error);
      setUserFeed(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: error.message || 'Failed to load feed',
      }));
    }
  }, [token, userFeed.loading, userFeed.hasMore, userFeed.nextCursor, userFeed.posts]);
  
  // Load popular feed
  const loadPopularFeed = useCallback(async (refresh = false) => {
    // If refreshing, set refreshing state
    if (refresh) {
      setPopularFeed(prev => ({ ...prev, refreshing: true, error: undefined }));
    } else {
      // Don't load more if already loading or no more items
      if (popularFeed.loading || (!refresh && !popularFeed.hasMore)) {
        return;
      }
      setPopularFeed(prev => ({ ...prev, loading: true, error: undefined }));
    }
    
    try {
      // Prepare options
      const options: Record<string, any> = {
        limit: DEFAULT_LIMIT,
      };
      
      // Add cursor for pagination if not refreshing
      if (!refresh && popularFeed.nextCursor) {
        options.cursor = popularFeed.nextCursor;
      }
      
      // Check cache first if not refreshing
      let feedData: FeedResult | null = null;
      if (!refresh) {
        feedData = feedCache.getFeed('popular', options);
      }
      
      // If no cached data, fetch from API
      if (!feedData) {
        feedData = await apiClient.feeds.getPopularFeed(token, options);
        
        // Cache the result
        if (feedData) {
          feedCache.storeFeed('popular', feedData, options);
        }
      }
      
      // Update state
      if (feedData) {
        setPopularFeed(prev => ({
          posts: refresh ? feedData!.posts : [...prev.posts, ...feedData!.posts],
          nextCursor: feedData!.nextCursor,
          hasMore: feedData!.hasMore,
          loading: false,
          refreshing: false,
        }));
      }
    } catch (error: any) {
      console.error('Error loading popular feed:', error);
      setPopularFeed(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: error.message || 'Failed to load feed',
      }));
    }
  }, [token, popularFeed.loading, popularFeed.hasMore, popularFeed.nextCursor, popularFeed.posts]);
  
  // Load local feed
  const loadLocalFeed = useCallback(async (refresh = false) => {
    // If refreshing, set refreshing state
    if (refresh) {
      setLocalFeed(prev => ({ ...prev, refreshing: true, error: undefined }));
    } else {
      // Don't load more if already loading or no more items
      if (localFeed.loading || (!refresh && !localFeed.hasMore)) {
        return;
      }
      setLocalFeed(prev => ({ ...prev, loading: true, error: undefined }));
    }
    
    try {
      // Get location if not available or refreshing
      let location = localFeed.location;
      
      if (!location || refresh) {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          throw new Error('Location permission denied');
        }
        
        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        location = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        
        // Update location in state
        setLocalFeed(prev => ({ ...prev, location }));
      }
      
      // Prepare options
      const options: Record<string, any> = {
        limit: DEFAULT_LIMIT,
      };
      
      // Add cursor for pagination if not refreshing
      if (!refresh && localFeed.nextCursor) {
        options.cursor = localFeed.nextCursor;
      }
      
      // Check cache first if not refreshing
      let feedData: FeedResult | null = null;
      const cacheParams = {
        ...options,
        location,
        radius: localFeed.radius,
      };
      
      if (!refresh) {
        feedData = feedCache.getFeed('local', cacheParams);
      }
      
      // If no cached data, fetch from API
      if (!feedData) {
        feedData = await apiClient.feeds.getLocalFeed(
          location!,
          localFeed.radius,
          token,
          options
        );
        
        // Cache the result
        if (feedData) {
          feedCache.storeFeed('local', feedData, cacheParams);
        }
      }
      
      // Update state
      if (feedData) {
        setLocalFeed(prev => ({
          ...prev,
          posts: refresh ? feedData!.posts : [...prev.posts, ...feedData!.posts],
          nextCursor: feedData!.nextCursor,
          hasMore: feedData!.hasMore,
          loading: false,
          refreshing: false,
        }));
      }
    } catch (error: any) {
      console.error('Error loading local feed:', error);
      
      // Handle location errors specifically
      if (error.message.includes('Location')) {
        Alert.alert(
          'Location Access Required',
          'Please enable location services to view content near you.',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ]
        );
      }
      
      setLocalFeed(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: error.message || 'Failed to load local feed',
      }));
    }
  }, [token, localFeed.loading, localFeed.hasMore, localFeed.nextCursor, localFeed.location, localFeed.radius, localFeed.posts]);
  
  // Load filtered feed
  const loadFilteredFeed = useCallback(async (
    filterType: 'club' | 'event' | 'skillLevel' | 'bikeType',
    filterId: string,
    refresh = false
  ): Promise<FeedResult> => {
    try {
      // Prepare options
      const options: Record<string, any> = {
        limit: DEFAULT_LIMIT,
      };
      
      // Check cache first if not refreshing
      let feedData: FeedResult | null = null;
      const cacheParams = {
        ...options,
        filterType,
        filterId,
      };
      
      if (!refresh) {
        feedData = feedCache.getFeed('filtered', cacheParams);
      }
      
      // If no cached data, fetch from API
      if (!feedData) {
        feedData = await apiClient.feeds.getFilteredFeed(
          filterType,
          filterId,
          token,
          options
        );
        
        // Cache the result
        if (feedData) {
          feedCache.storeFeed('filtered', feedData, cacheParams);
        }
      }
      
      return feedData;
    } catch (error: any) {
      console.error(`Error loading ${filterType} feed:`, error);
      throw error;
    }
  }, [token]);
  
  // Clear cache
  const clearCache = useCallback(() => {
    feedCache.clearAll();
  }, []);
  
  // Initialize feeds on login
  useEffect(() => {
    if (token) {
      // Only initialize feeds if they're empty
      if (userFeed.posts.length === 0) {
        loadUserFeed(true);
      }
      
      if (popularFeed.posts.length === 0) {
        loadPopularFeed(true);
      }
    }
  }, [token, loadUserFeed, loadPopularFeed]);
  
  const contextValue: FeedContextState = {
    userFeed,
    popularFeed,
    localFeed,
    loadUserFeed,
    loadPopularFeed,
    loadLocalFeed,
    loadFilteredFeed,
    clearCache,
  };
  
  return (
    <FeedContext.Provider value={contextValue}>
      {children}
    </FeedContext.Provider>
  );
};

// Custom hook to use feed context
export const useFeed = () => {
  const context = useContext(FeedContext);
  
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  
  return context;
};
