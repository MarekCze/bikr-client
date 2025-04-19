import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { YStack, Button, XStack } from 'tamagui';
import { Calendar, Plus } from '@tamagui/lucide-icons';
import { useEvent } from '../../../contexts/EventContext';
import { useAuth } from '../../../hooks/useAuth';
import { ThemedView } from '../../../components/ThemedView';
import { ThemedText } from '../../../components/ThemedText';
import EventScheduleItem from '../../../components/event/EventScheduleItem';
import { EventScheduleItem as ScheduleItemType } from '@bikr/shared/src/types/event';

export default function EventScheduleScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { currentEvent, canManageEvent } = useEvent();
  const { user } = useAuth();
  const [scheduleItems, setScheduleItems] = useState<ScheduleItemType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isOrganizer = currentEvent ? canManageEvent(currentEvent) : false;
  
  // In a real app, you'd fetch schedule items from the API
  // For now, we'll just use hardcoded sample data if the event exists
  useEffect(() => {
    if (currentEvent) {
      // Simulate API call
      setTimeout(() => {
        // Mock schedule items
        const mockScheduleItems: ScheduleItemType[] = [
          {
            id: '1',
            title: 'Check-in & Welcome',
            description: 'Arrive at the venue, register, and get your welcome pack.',
            startTime: new Date(currentEvent.startDate).toISOString(),
            location: {
              ...currentEvent.location,
              name: 'Main Entrance', // Override the location name
            },
          },
          {
            id: '2',
            title: 'Group Ride Briefing',
            description: 'Safety briefing and route explanation.',
            startTime: new Date(new Date(currentEvent.startDate).getTime() + 30 * 60000).toISOString(), // 30 minutes after start
            endTime: new Date(new Date(currentEvent.startDate).getTime() + 45 * 60000).toISOString(), // 45 minutes after start
            location: {
              ...currentEvent.location,
              name: 'Meeting Point', // Override the location name
            },
          },
          {
            id: '3',
            title: 'Group Ride',
            description: 'Scenic ride through mountain roads.',
            startTime: new Date(new Date(currentEvent.startDate).getTime() + 60 * 60000).toISOString(), // 1 hour after start
            endTime: new Date(new Date(currentEvent.startDate).getTime() + 180 * 60000).toISOString(), // 3 hours after start
          },
          {
            id: '4',
            title: 'Lunch Break',
            description: 'Stop for lunch and refreshments.',
            startTime: new Date(new Date(currentEvent.startDate).getTime() + 180 * 60000).toISOString(), // 3 hours after start
            endTime: new Date(new Date(currentEvent.startDate).getTime() + 240 * 60000).toISOString(), // 4 hours after start
            location: {
              name: 'Mountain View Restaurant',
              address: '123 Mountain Road',
              city: 'Highland',
              state: 'CA',
              country: 'USA',
              zipCode: '12345',
              latitude: 37.7749,
              longitude: -122.4194,
            },
          },
          {
            id: '5',
            title: 'Return Ride',
            description: 'Ride back to starting point.',
            startTime: new Date(new Date(currentEvent.startDate).getTime() + 240 * 60000).toISOString(), // 4 hours after start
            endTime: new Date(new Date(currentEvent.startDate).getTime() + 300 * 60000).toISOString(), // 5 hours after start
          },
        ];
        
        setScheduleItems(mockScheduleItems);
        setLoading(false);
      }, 1000);
    }
  }, [currentEvent]);
  
  // In a real app, you'd have a function to add a new schedule item
  const handleAddScheduleItem = () => {
    alert('Add schedule item feature will be implemented in a future update');
  };
  
  // Render schedule item
  const renderScheduleItem = ({ item, index }: { item: ScheduleItemType; index: number }) => (
    <EventScheduleItem 
      item={item} 
      isLast={index === scheduleItems.length - 1} 
    />
  );
  
  // Render empty state
  const renderEmpty = () => (
    <YStack alignItems="center" justifyContent="center" padding="$4" space="$2">
      <Calendar size={40} color="#999" />
      <ThemedText style={{ textAlign: 'center' }}>No schedule items yet</ThemedText>
      
      {isOrganizer && (
        <Button 
          theme="blue" 
          onPress={handleAddScheduleItem}
          icon={<Plus size={16} />}
          marginTop="$3"
        >
          Add Schedule Item
        </Button>
      )}
    </YStack>
  );
  
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <YStack space="$3" padding="$3" flex={1}>
        <XStack alignItems="center" justifyContent="space-between">
          <ThemedText type="subtitle">Event Schedule</ThemedText>
          
          {isOrganizer && scheduleItems.length > 0 && (
            <Button 
              size="$3" 
              theme="blue" 
              icon={<Plus size={16} />}
              onPress={handleAddScheduleItem}
            >
              Add
            </Button>
          )}
        </XStack>
        
        <FlatList
          data={scheduleItems}
          renderItem={renderScheduleItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmpty}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </YStack>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
});
