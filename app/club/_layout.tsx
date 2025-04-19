import React from 'react';
import { Stack } from 'expo-router';
import { YStack } from 'tamagui';

/**
 * Layout component for club-related screens
 * This creates a stack navigator for showing clubs
 */
export default function ClubLayout() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Clubs',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="create"
          options={{
            title: 'Create Club',
            headerLargeTitle: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="[clubId]"
          options={{
            headerShown: false, // Will be handled by nested layout
          }}
        />
      </Stack>
    </YStack>
  );
}
