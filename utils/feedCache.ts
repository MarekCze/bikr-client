import { DetailedPost } from '../../shared/src/types/post';

/**
 * Post data structure used in feed displays
 */
export interface Post extends DetailedPost {}

/**
 * Feed result data structure returned by API calls
 */
export interface FeedResult {
  posts: Post[];
  nextCursor?: string;
  hasMore: boolean;
}

/**
 * Feed cache configuration
 */
interface FeedCacheConfig {
  /**
   * Maximum number of cache entries to keep
   */
  maxEntries: number;
  
  /**
   * Time in milliseconds after which cache entries expire
   */
  expiryTime: number;
}

/**
 * Cache entry containing feed data and metadata
 */
interface CacheEntry {
  key: string;
  data: FeedResult;
  timestamp: number;
}

/**
 * Feed cache implementation for storing and retrieving feed data
 */
class FeedCache {
  private cache: Map<string, CacheEntry> = new Map();
  private config: FeedCacheConfig = {
    maxEntries: 20,
    expiryTime: 5 * 60 * 1000, // 5 minutes
  };
  
  /**
   * Generate a cache key from feed type and parameters
   */
  private generateKey(feedType: string, params: Record<string, any>): string {
    const sortedParams = Object.entries(params || {})
      .filter(([_, value]) => value !== undefined)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    
    return `${feedType}:${JSON.stringify(sortedParams)}`;
  }
  
  /**
   * Store feed data in cache
   */
  public storeFeed(
    feedType: string,
    data: FeedResult,
    params: Record<string, any> = {}
  ): void {
    // Clean expired entries first
    this.cleanExpired();
    
    // If cache is at max capacity, remove oldest entry
    if (this.cache.size >= this.config.maxEntries) {
      let oldestKey: string | null = null;
      let oldestTimestamp = Date.now();
      
      this.cache.forEach((entry, key) => {
        if (entry.timestamp < oldestTimestamp) {
          oldestTimestamp = entry.timestamp;
          oldestKey = key;
        }
      });
      
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    // Add new entry
    const key = this.generateKey(feedType, params);
    this.cache.set(key, {
      key,
      data,
      timestamp: Date.now(),
    });
  }
  
  /**
   * Get feed data from cache
   */
  public getFeed(
    feedType: string,
    params: Record<string, any> = {}
  ): FeedResult | null {
    const key = this.generateKey(feedType, params);
    const entry = this.cache.get(key);
    
    // Return null if entry doesn't exist or is expired
    if (!entry || this.isExpired(entry)) {
      if (entry) {
        // Delete expired entry
        this.cache.delete(key);
      }
      return null;
    }
    
    return entry.data;
  }
  
  /**
   * Check if a cache entry has expired
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > this.config.expiryTime;
  }
  
  /**
   * Clean expired entries from cache
   */
  private cleanExpired(): void {
    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    });
  }
  
  /**
   * Clear all cache entries
   */
  public clearAll(): void {
    this.cache.clear();
  }
  
  /**
   * Clear specific feed type from cache
   */
  public clearFeedType(feedType: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (key.startsWith(`${feedType}:`)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
    });
  }
  
  /**
   * Get cache statistics
   */
  public getStats(): {
    size: number;
    maxEntries: number;
    expiryTime: number;
  } {
    return {
      size: this.cache.size,
      maxEntries: this.config.maxEntries,
      expiryTime: this.config.expiryTime,
    };
  }
}

// Export singleton instance
export const feedCache = new FeedCache();
