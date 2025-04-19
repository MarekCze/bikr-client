import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../../components/ThemedView';
import { EventList } from '../../components/event';
import { useEvent } from '../../contexts/EventContext';
import { Event, EventType } from '@bikr/shared/src/types/event';
import { EventFilters } from '@bikr/shared/src/repositories/IEventRepository';

/**
 * Events home screen that displays a list of upcoming events
 */
export default function EventsScreen() {
  const router = useRouter();
  const { 
    events, 
    loading, 
    hasMoreEvents, 
    fetchEvents, 
    fetchNextPage,
    filters,
    updateFilters
  } = useEvent();
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Function to handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchEvents(undefined, true);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Function to handle "Create Event" button press
  const handleCreateEvent = () => {
    // Use the relative route within the event directory
    router.push('./create');
  };
  
  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);
  
  return (
    <ThemedView style={styles.container}>
      <EventList
        events={events}
        loading={loading}
        loadingMore={loading && events.length > 0}
        onLoadMore={fetchNextPage}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        emptyMessage="No events found. Pull down to refresh or create a new event."
      />
      
      {/* Floating Action Button for creating new events */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateEvent}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
