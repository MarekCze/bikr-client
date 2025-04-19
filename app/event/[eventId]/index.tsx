import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { YStack, View } from 'tamagui';

import { useEvent } from '../../../contexts/EventContext';
import { 
  EventHeader, 
  EventDetailsSection, 
  ParticipateButton 
} from '../../../components/event';
import { ThemedView } from '../../../components/ThemedView';
import { ThemedText } from '../../../components/ThemedText';

/**
 * Event detail screen that displays a specific event's information
 */
export default function EventDetailScreen() {
  const params = useLocalSearchParams();
  const { currentEvent, loadingEvent, fetchEventById } = useEvent();
  
  const eventId = params.eventId as string;
  
  // Load event details on component mount
  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId);
    }
  }, [eventId]);
  
  // Render loading state
  if (loadingEvent || !currentEvent) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <ThemedText style={styles.loadingText}>Loading event details...</ThemedText>
      </ThemedView>
    );
  }
  
  return (
    <ScrollView style={styles.scrollView} bounces={false}>
      <ThemedView style={styles.container}>
        {/* Event Header */}
        <EventHeader event={currentEvent} />
        
        {/* Participate Button */}
        <YStack padding="$2" marginBottom="$2">
          <ParticipateButton 
            eventId={currentEvent.id} 
            initialStatus={null} 
            fullWidth={true}
            size="large"
          />
        </YStack>
        
        {/* Event Details */}
        <EventDetailsSection 
          event={currentEvent}
          onShowRoute={() => console.log('Show route')}
          onShowMap={() => console.log('Show map')}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
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
  }
});
