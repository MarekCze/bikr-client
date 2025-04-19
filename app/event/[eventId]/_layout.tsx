import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack, Tabs } from 'expo-router';
import { ScrollView } from 'tamagui';
import { Calendar, Info, Settings, Users } from '@tamagui/lucide-icons';
import { useAuth } from '../../../hooks/useAuth';
import { useEvent } from '../../../contexts/EventContext';
import { EventHeader } from '../../../components/event/EventHeader';
import { ThemedView } from '../../../components/ThemedView';

export default function EventLayout() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { user } = useAuth();
  const { fetchEventById, currentEvent, loading } = useEvent();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId).catch(err => {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event');
      });
    }
  }, [eventId, fetchEventById]);

  if (loading || !currentEvent) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <ThemedView style={styles.content}>
          <ThemedView>
            <ErrorText>Failed to load event: {error}</ErrorText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  }

  const isOrganizer = currentEvent.organizerId === user?.id;

  return (
    <>
      <Stack.Screen
        options={{
          title: currentEvent?.title || 'Event Details',
          headerShown: false,
        }}
      />
      
      <ScrollView>
        <EventHeader
          event={currentEvent}
          showParticipateButton={true}
        />
      </ScrollView>
      
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#0a7ea4',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Details',
            tabBarIcon: ({ color }) => <Info size={24} color={color} />,
          }}
        />
        
        <Tabs.Screen
          name="participants"
          options={{
            title: 'Participants',
            tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          }}
        />
        
        <Tabs.Screen
          name="schedule"
          options={{
            title: 'Schedule',
            tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
          }}
        />
        
        {isOrganizer && (
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
            }}
          />
        )}
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Simple error text component
function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <ThemedView style={{ padding: 16, alignItems: 'center' }}>
      <ThemedText style={{ color: 'red', textAlign: 'center' }}>{children}</ThemedText>
    </ThemedView>
  );
}

// Add ThemedText as we need it for the ErrorText component
import { ThemedText } from '../../../components/ThemedText';
