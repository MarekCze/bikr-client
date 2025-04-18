import { FeedResult } from '../utils/feedCache'; // Use the existing FeedResult type

/**
 * Parameters for fetching feeds.
 * Specific feed types might extend this or use specific properties.
 */
export interface FetchFeedParams {
  limit?: number;
  cursor?: string; // For pagination
  userId?: string; // For user-specific feeds
  latitude?: number; // For local feeds
  longitude?: number; // For local feeds
  radius?: number; // For local feeds
  filter?: string; // For filtered feeds (e.g., tags, keywords)
  // Add other potential parameters like clubId, eventId, etc.
}

/**
 * Interface for managing feed data retrieval.
 */
export interface IFeedRepository {
  /**
   * Fetches the user's personalized feed.
   * @param params - Parameters including userId, limit, cursor.
   * @returns A FeedResult containing posts and pagination info.
   */
  getUserFeed(params: FetchFeedParams): Promise<FeedResult>;

  /**
   * Fetches the popular or trending feed.
   * @param params - Parameters including limit, cursor.
   * @returns A FeedResult containing posts and pagination info.
   */
  getPopularFeed(params: FetchFeedParams): Promise<FeedResult>;

  /**
   * Fetches the feed based on geographical location.
   * @param params - Parameters including latitude, longitude, radius, limit, cursor.
   * @returns A FeedResult containing posts and pagination info.
   */
  getLocalFeed(params: FetchFeedParams): Promise<FeedResult>;

  /**
   * Fetches a feed based on specific filters (e.g., tags, keywords).
   * @param params - Parameters including filter, limit, cursor.
   * @returns A FeedResult containing posts and pagination info.
   */
  getFilteredFeed(params: FetchFeedParams): Promise<FeedResult>;

  // Add methods for other specific feed types as needed (e.g., getClubFeed, getEventFeed)
}
