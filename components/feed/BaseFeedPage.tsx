import React, { useCallback, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { MediaCard } from '../content/MediaCard';
import { useFeed } from '../../contexts/FeedContext';
import { Post } from '../../utils/feedCache';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';

export interface BaseFeedPageProps {
  /**
   * The feed type identifier
   */
  feedType: 'user' | 'popular' | 'local' | 'filtered';
  
  /**
   * Function to load feed data (called on initial load, refresh, and load more)
   */
  loadFeed: (refresh?: boolean) => Promise<void>;
  
  /**
   * Current feed data
   */
  feed: {
    posts: Post[];
    nextCursor?: string;
    hasMore: boolean;
    loading: boolean;
    refreshing: boolean;
    error?: string;
  };
  
  /**
   * Optional title to display at the top of the feed
   */
  title?: string;
  
  /**
   * Optional component to display at the top of the feed
   */
  HeaderComponent?: React.ReactNode;
  
  /**
   * Optional component to display when the feed is empty
   */
  EmptyComponent?: React.ReactNode;
  
  /**
   * Optional filters for the feed
   */
  filters?: React.ReactNode;
}

/**
 * BaseFeedPage component that implements common feed functionality
 * Can be used for any feed type (user, popular, local, filtered)
 */
export const BaseFeedPage: React.FC<BaseFeedPageProps> = ({
  feedType,
  loadFeed,
  feed,
  title,
  HeaderComponent,
  EmptyComponent,
  filters,
}) => {
  const { width } = useWindowDimensions();
  const backgroundColor = useThemeColor({ light: '#f7f7f7', dark: '#000' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const subtleColor = useThemeColor({ light: '#888', dark: '#aaa' }, 'text'); // Changed from 'subtle' to 'text'
  
  // Handle refresh pull-down
  const handleRefresh = useCallback(() => {
    loadFeed(true);
  }, [loadFeed]);
  
  // Handle loading more when reaching end of list
  const handleLoadMore = useCallback(() => {
    if (!feed.loading && feed.hasMore) {
      loadFeed();
    }
  }, [feed.loading, feed.hasMore, loadFeed]);
  
  // Render each post item
  const renderItem = useCallback(({ item }: { item: Post }) => {
    return <MediaCard post={item} />;
  }, []);
  
  // Extract key for each item
  const keyExtractor = useCallback((item: Post) => item.id, []);
  
  // Render header component (title, filters, custom header)
  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        {title && (
          <ThemedText style={styles.title}>{title}</ThemedText>
        )}
        
        {filters && (
          <View style={styles.filtersContainer}>
            {filters}
          </View>
        )}
        
        {HeaderComponent}
      </View>
    );
  }, [title, filters, HeaderComponent]);
  
  // Render empty state
  const renderEmpty = useCallback(() => {
    if (feed.loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={subtleColor} />
        </View>
      );
    }
    
    if (feed.error) {
      return (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.errorText}>
            {feed.error}
          </ThemedText>
          <ThemedText 
            style={styles.retryText}
            onPress={() => loadFeed(true)}
          >
            Tap to retry
          </ThemedText>
        </View>
      );
    }
    
    if (EmptyComponent) {
      return EmptyComponent;
    }
    
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          {feedType === 'user' && 'No posts in your feed yet. Follow more users to see content.'}
          {feedType === 'popular' && 'No popular posts at the moment. Check back later.'}
          {feedType === 'local' && 'No posts nearby. Be the first to post in this area!'}
          {feedType === 'filtered' && 'No posts match the current filters.'}
        </ThemedText>
      </View>
    );
  }, [feed.loading, feed.error, EmptyComponent, feedType, loadFeed, subtleColor]);
  
  // Render footer (loading indicator when loading more)
  const renderFooter = useCallback(() => {
    if (!feed.loading || feed.posts.length === 0) return null;
    
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={subtleColor} />
      </View>
    );
  }, [feed.loading, feed.posts.length, subtleColor]);
  
  return (
    <ThemedView style={styles.container}>
      <FlashList
        data={feed.posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={350}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={feed.refreshing}
            onRefresh={handleRefresh}
            tintColor={subtleColor}
            colors={[subtleColor]}
          />
        }
        contentContainerStyle={[
          styles.contentContainer,
          feed.posts.length === 0 && styles.emptyContentContainer,
        ]}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filtersContainer: {
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    color: '#ff3b30',
  },
  retryText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    textDecorationLine: 'underline',
  },
  footerContainer: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
