import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { BaseFeedPage } from './BaseFeedPage';
import { useFeed } from '../../contexts/FeedContext';

/**
 * UserFeedPage component that displays the personalized feed for the current user
 * Shows posts from accounts the user follows
 */
export const UserFeedPage: React.FC = () => {
  const { userFeed, loadUserFeed } = useFeed();
  
  // Initial load
  useEffect(() => {
    if (userFeed.posts.length === 0 && !userFeed.loading) {
      loadUserFeed(true);
    }
  }, [loadUserFeed, userFeed.posts.length, userFeed.loading]);
  
  return (
    <BaseFeedPage
      feedType="user"
      feed={userFeed}
      loadFeed={loadUserFeed}
      title="Your Feed"
    />
  );
};

const styles = StyleSheet.create({});
