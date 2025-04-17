import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { BaseFeedPage } from './BaseFeedPage';
import { useFeed } from '../../contexts/FeedContext';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Post } from '../../utils/feedCache';

interface FilteredFeedPageProps {
  /**
   * The type of filter to apply
   */
  filterType: 'club' | 'event' | 'skillLevel' | 'bikeType';
  
  /**
   * The ID of the entity to filter by (club ID, event ID, etc.)
   */
  filterId: string;
  
  /**
   * Optional title to display at the top of the feed
   * If not provided, a default title based on filterType will be used
   */
  title?: string;
  
  /**
   * Optional subtitle with additional context
   */
  subtitle?: string;
  
  /**
   * Optional header component to display above the feed
   */
  HeaderComponent?: React.ReactNode;
}

/**
 * FilteredFeedPage component that displays content filtered by specific criteria
 * Used for club feeds, event feeds, skill level feeds, and bike type feeds
 */
export const FilteredFeedPage: React.FC<FilteredFeedPageProps> = ({
  filterType,
  filterId,
  title,
  subtitle,
  HeaderComponent,
}) => {
  const { loadFilteredFeed } = useFeed();
  const [feed, setFeed] = useState<{
    posts: Post[];
    nextCursor?: string;
    hasMore: boolean;
    loading: boolean;
    refreshing: boolean;
    error?: string;
  }>({
    posts: [],
    hasMore: false,
    loading: true,
    refreshing: false,
  });
  
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const accentColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  
  // Generate a default title based on filter type if none provided
  const getDefaultTitle = () => {
    switch (filterType) {
      case 'club':
        return 'Club Feed';
      case 'event':
        return 'Event Feed';
      case 'skillLevel':
        return `${filterId} Riders`;
      case 'bikeType':
        return `${filterId} Bikes`;
      default:
        return 'Filtered Feed';
    }
  };
  
  // Load filtered feed data
  const loadFeed = async (refresh = false) => {
    if (feed.loading && !refresh) return;
    
    try {
      setFeed(prev => ({
        ...prev,
        loading: !refresh,
        refreshing: refresh,
        error: undefined,
      }));
      
      const options: any = {
        limit: 10,
      };
      
      // Add cursor for pagination if not refreshing
      if (!refresh && feed.nextCursor) {
        options.cursor = feed.nextCursor;
      }
      
      // Load filtered feed
      const result = await loadFilteredFeed(filterType, filterId, refresh);
      
      setFeed(prev => ({
        posts: refresh ? result.posts : [...prev.posts, ...result.posts],
        nextCursor: result.nextCursor,
        hasMore: result.hasMore,
        loading: false,
        refreshing: false,
      }));
    } catch (error: any) {
      console.error(`Error loading ${filterType} feed:`, error);
      setFeed(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: error.message || `Failed to load ${filterType} feed`,
      }));
    }
  };
  
  // Initial load
  useEffect(() => {
    loadFeed(true);
  }, [filterType, filterId]);
  
  // Custom header with title and subtitle
  const CustomHeader = (
    <>
      {HeaderComponent}
      {subtitle && (
        <ThemedText style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      )}
    </>
  );
  
  return (
    <BaseFeedPage
      feedType="filtered"
      feed={feed}
      loadFeed={loadFeed}
      title={title || getDefaultTitle()}
      HeaderComponent={CustomHeader}
    />
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: -4,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});
