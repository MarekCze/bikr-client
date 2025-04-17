import React from 'react';
import { Stack } from 'expo-router';

/**
 * Layout for the user profile section.
 * Uses a Stack navigator to manage profile-related screens.
 */
export default function ProfileLayout() {
  return (
    <Stack>
      {/* Main profile view */}
      <Stack.Screen
        name="index"
        options={{ title: 'My Profile', headerShown: false }} // Hide header if tabs handle it
      />
      {/* Edit Profile Screen */}
      <Stack.Screen
        name="edit"
        options={{ title: 'Edit Profile', presentation: 'modal' }} // Example: open as modal
      />
      {/* Garage Screen */}
      <Stack.Screen
        name="garage"
        options={{ title: 'My Garage' }}
      />
      {/* Settings Screen */}
      <Stack.Screen
        name="settings"
        options={{ title: 'Settings' }}
      />
       {/* Add Bike Screen */}
       <Stack.Screen
        name="add-bike"
        options={{ title: 'Add Bike', presentation: 'modal' }}
      />
       {/* Edit Bike Screen (Dynamic) */}
       <Stack.Screen
        name="edit-bike/[id]"
        options={{ title: 'Edit Bike', presentation: 'modal' }}
      />
    </Stack>
  );
}
