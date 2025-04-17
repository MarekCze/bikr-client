import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native'; // Added ActivityIndicator
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
// Import permission request functions from Expo
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native'; // Import Platform

// TODO: Handle different permission statuses (granted, denied, undetermined) - Basic handling added
// TODO: Potentially store permission status if needed elsewhere

export default function PermissionsScreen() {
  const router = useRouter();
  // Removed duplicate locationStatus state declaration
  const [locationStatus, setLocationStatus] = useState<Location.PermissionStatus | null>(null); // Use enum type
  const [notificationStatus, setNotificationStatus] = useState<Notifications.PermissionStatus | null>(null); // Use enum type
  const [isLoading, setIsLoading] = useState(false);

  // Function to request permissions
  const requestPermissions = async () => {
    setIsLoading(true);
    let finalLocationStatus: Location.PermissionStatus = Location.PermissionStatus.UNDETERMINED;
    let finalNotificationStatus: Notifications.PermissionStatus = Notifications.PermissionStatus.UNDETERMINED;

    try {
        // --- Location ---
        const { status: location } = await Location.requestForegroundPermissionsAsync();
        finalLocationStatus = location;
        setLocationStatus(location);
        if (location !== 'granted') {
            Alert.alert('Location Permission', 'Location permission is recommended for features like finding nearby routes.');
            // Allow proceeding even if denied
        }

        // --- Notifications ---
        const { status: notifications } = await Notifications.requestPermissionsAsync();
        finalNotificationStatus = notifications;
        setNotificationStatus(notifications);
        if (notifications !== 'granted') {
            Alert.alert('Notification Permission', 'Notifications help keep you updated, but are optional.');
            // Allow proceeding even if denied
        }

        console.log('Permissions requested:', { location: finalLocationStatus, notifications: finalNotificationStatus });

    } catch (error: any) {
        console.error("Error requesting permissions:", error);
        Alert.alert('Error', 'Could not request permissions.');
    } finally {
        setIsLoading(false);
    }
  };

  // Check initial status on mount (optional, but good practice)
  useEffect(() => {
    const checkInitialStatus = async () => {
        const locStatus = await Location.getForegroundPermissionsAsync();
        setLocationStatus(locStatus.status);
        const notifStatus = await Notifications.getPermissionsAsync();
        setNotificationStatus(notifStatus.status);
    };
    checkInitialStatus();
  }, []);

  const handleFinish = () => {
    // Navigate to the main app screen (e.g., the tabs layout)
    // Replace '/(tabs)' with the actual route for the main app entry point
    router.replace('/(tabs)'); // Assuming this is the correct root layout path
  };

  const handleBack = () => {
    // Navigate back to the previous step (bike-setup)
    if (router.canGoBack()) {
        router.back();
    } else {
        // Fallback if cannot go back
        router.replace('./bike-setup'); // Use relative path
    }
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ThemedText type="title">App Permissions</ThemedText>
      <ThemedText style={{ marginVertical: 20, textAlign: 'center' }}>
        To get the most out of bikR, please grant location and notification permissions.
      </ThemedText>

      {/* Display permission status and request button */}
      <View style={{ marginVertical: 20, alignItems: 'stretch', width: '85%' }}>
          <View style={{ marginBottom: 15, padding: 10, borderWidth: 1, borderColor: 'lightgrey', borderRadius: 5 }}>
              <ThemedText>Location: {locationStatus || 'Checking...'}</ThemedText>
              {locationStatus !== Location.PermissionStatus.GRANTED && (
                  <ThemedText style={{ fontSize: 12, color: 'grey' }}>Needed for nearby features.</ThemedText>
              )}
          </View>
          <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'lightgrey', borderRadius: 5 }}>
              <ThemedText>Notifications: {notificationStatus || 'Checking...'}</ThemedText>
               {notificationStatus !== Notifications.PermissionStatus.GRANTED && (
                  <ThemedText style={{ fontSize: 12, color: 'grey' }}>Allows us to send updates.</ThemedText>
              )}
          </View>
          <Button
            title={locationStatus === 'granted' && notificationStatus === 'granted' ? "Permissions Granted" : "Grant Permissions"}
            onPress={requestPermissions}
            disabled={isLoading || (locationStatus === 'granted' && notificationStatus === 'granted')}
          />
      </View>

      {isLoading && <ActivityIndicator size="large" style={{ marginBottom: 15 }} />}

      {/* Replace Button with Tamagui Button if available */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '80%', marginBottom: 10 }}>
          <Button title="Back" onPress={handleBack} disabled={isLoading} />
          <Button title="Finish Setup" onPress={handleFinish} disabled={isLoading} />
      </View>
    </ThemedView>
  );
}
