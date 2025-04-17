import React from 'react';
import { Stack } from 'expo-router';

/**
 * Layout for the user onboarding flow.
 * Uses a Stack navigator to manage the different onboarding steps.
 */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide header for all onboarding screens
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="interests" />
      <Stack.Screen name="experience" />
      <Stack.Screen name="bike-setup" />
      <Stack.Screen name="permissions" />
    </Stack>
  );
}
