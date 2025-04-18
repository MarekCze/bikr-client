import { supabase } from '../services/supabase';
import { IFeedRepository, FetchFeedParams } from './IFeedRepository';
import { FeedResult } from '../utils/feedCache';
import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';

// Re-use or import the error handler if it's in a shared utility
const handleSupabaseError = (error: PostgrestError | Error | null, context: string) => {
  if (error) {
    console.error(`Supabase error in ${context}:`, error.message);
    throw new Error(`Failed to ${context}: ${error.message}`);
  }
};

// Default limit for feed fetching
const DEFAULT_FEED_LIMIT = 10;

export class SupabaseFeedRepository implements IFeedRepository {
  private client: SupabaseClient;

  constructor() {
    this.client = supabase;
  }

  // Helper to call RPC and map result
  private async callFeedRpc(functionName: string, params: FetchFeedParams): Promise<FeedResult> {
    // Prepare parameters for the RPC call, mapping FetchFeedParams keys if needed
    const rpcParams = {
      p_limit: params.limit ?? DEFAULT_FEED_LIMIT,
      p_cursor: params.cursor,
      p_user_id: params.userId, // Pass userId if relevant for the function
      p_latitude: params.latitude, // Pass location if relevant
      p_longitude: params.longitude,
      p_radius_meters: params.radius, // Assuming radius is in meters
      p_filter_term: params.filter, // Pass filter term if relevant
      // Add other parameters expected by your specific RPC functions
    };

    // Remove undefined params before calling RPC
    Object.keys(rpcParams).forEach(key => {
      const paramKey = key as keyof typeof rpcParams; // Cast key
      if (rpcParams[paramKey] === undefined) {
        delete rpcParams[paramKey];
      }
    });


    console.log(`Calling RPC ${functionName} with params:`, rpcParams); // Debug log

    const { data, error } = await this.client.rpc(functionName, rpcParams);

    handleSupabaseError(error, `call RPC ${functionName}`);

    if (!data) {
      // RPC might return empty array/null instead of error for no results
      console.warn(`No data returned from RPC ${functionName}`);
      return { posts: [], hasMore: false };
    }

    // Assuming the RPC function returns data in the shape of FeedResult
    // or requires mapping. Adjust mapping as necessary based on actual RPC return structure.
    // Example: If RPC returns { feed_posts: [], next_page_cursor: '...', has_more_posts: true }
    const result: FeedResult = {
       posts: data.posts || data.feed_posts || [], // Adjust based on actual return key
       nextCursor: data.nextCursor || data.next_page_cursor, // Adjust based on actual return key
       hasMore: data.hasMore ?? data.has_more_posts ?? false, // Adjust based on actual return key
    };

    console.log(`RPC ${functionName} result:`, result); // Debug log

    return result;
  }

  async getUserFeed(params: FetchFeedParams): Promise<FeedResult> {
    if (!params.userId) {
      throw new Error('User ID is required for getUserFeed.');
    }
    // Assuming an RPC function named 'get_user_feed' exists
    return this.callFeedRpc('get_user_feed', params);
  }

  async getPopularFeed(params: FetchFeedParams): Promise<FeedResult> {
    // Assuming an RPC function named 'get_popular_feed' exists
    return this.callFeedRpc('get_popular_feed', params);
  }

  async getLocalFeed(params: FetchFeedParams): Promise<FeedResult> {
    if (params.latitude === undefined || params.longitude === undefined) {
      throw new Error('Latitude and Longitude are required for getLocalFeed.');
    }
    // Assuming an RPC function named 'get_local_feed' exists
    return this.callFeedRpc('get_local_feed', params);
  }

  async getFilteredFeed(params: FetchFeedParams): Promise<FeedResult> {
    if (!params.filter) {
      throw new Error('Filter term is required for getFilteredFeed.');
    }
    // Assuming an RPC function named 'get_filtered_feed' exists
    return this.callFeedRpc('get_filtered_feed', params);
  }
}
