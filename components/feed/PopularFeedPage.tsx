import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { BaseFeedPage } from './BaseFeedPage';
import { useFeed } from '../../contexts/FeedContext';

/**
 * PopularFeedPage component that displays trending content across the platform
 * Shows posts with high engagement metrics like likes, comments, and bookmarks
 */
export const PopularFeedPage: React.FC = () => {
  const { popularFeed, loadPopularFeed } = useFeed();
  
  // Initial load
  useEffect(() => {
    if (popularFeed.posts.length === 0 && !popularFeed.loading) {
      loadPopularFeed(true);
    }
  }, [loadPopularFeed, popularFeed.posts.length, popularFeed.loading]);
  
  return (
    <BaseFeedPage
      feedType="popular"
      feed={popularFeed}
      loadFeed={loadPopularFeed}
      title="Trending"
    />
  );
};

const styles = StyleSheet.create({});
