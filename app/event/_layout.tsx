import React from 'react';
import { Stack } from 'expo-router';

/**
 * Layout for the events section of the application
 */
export default function EventLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Events',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Create Event',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[eventId]/index"
        options={({ route }) => ({
          title: 'Event Details',
        })}
      />
    </Stack>
  );
}
