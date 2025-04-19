import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

/**
 * Layout for route management screens.
 * Sets up navigation stack and headers for route screens.
 */
export default function RoutesLayout() {
  const { session } = useAuth();

  if (!session) {
    return null; // Protected route: don't render if not authenticated
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Saved Routes',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Create Route',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="[routeId]/index"
        options={{
          title: 'Route Details',
          headerBackTitle: 'Routes',
        }}
      />
      <Stack.Screen
        name="[routeId]/edit"
        options={{
          title: 'Edit Route',
          headerBackTitle: 'Details',
        }}
      />
    </Stack>
  );
}
