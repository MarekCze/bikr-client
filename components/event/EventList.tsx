import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { Event } from '@bikr/shared/src/types/event';
import { EventListItem } from './EventListItem';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

interface EventListProps {
  events: Event[];
  loading?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
}

/**
 * A list component for displaying events with optional pagination and pull-to-refresh
 */
export const EventList: React.FC<EventListProps> = ({
  events,
  loading = false,
  loadingMore = false,
  onLoadMore,
  onRefresh,
  refreshing = false,
  emptyMessage = 'No events found'
}) => {
  // Render a loading indicator when initially loading
  if (loading && !loadingMore && events.length === 0) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <ThemedText style={styles.loadingText}>Loading events...</ThemedText>
      </ThemedView>
    );
  }
  
  // Render empty state message when no events
  if (!loading && events.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>{emptyMessage}</ThemedText>
      </ThemedView>
    );
  }
  
  // Render footer with loading indicator when loading more
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color="#6200ee" />
        <ThemedText style={styles.footerText}>Loading more events...</ThemedText>
      </View>
    );
  };
  
  // Render event item
  const renderEventItem = ({ item }: { item: Event }) => (
    <EventListItem event={item} />
  );
  
  // Extract item key for FlatList
  const keyExtractor = (item: Event) => item.id;
  
  return (
    <FlatList
      data={events}
      renderItem={renderEventItem}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderFooter}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6200ee']}
            tintColor="#6200ee"
          />
        ) : undefined
      }
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: 8,
  },
});
