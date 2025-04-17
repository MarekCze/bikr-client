import React, { useState } from 'react';
import { View, Text, Button, Switch, StyleSheet, Alert } from 'react-native'; // Import Alert
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

// TODO: Fetch current settings values
// TODO: Integrate with ProfileRepository or a dedicated SettingsRepository to save preferences
// TODO: Add more settings (Notifications, Account etc.)

export default function SettingsScreen() {
  const router = useRouter();
  // Example state for settings
  const [isProfilePrivate, setIsProfilePrivate] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);

  const handleBack = () => {
     if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('./'); // Use relative path for fallback
    }
  };

  const handleSaveSettings = () => {
      // TODO: Call repository to save settings
      console.log('Saving settings:', { isProfilePrivate, shareLocation });
      Alert.alert('TODO', 'Settings saving not implemented yet.');
      // Optionally navigate back after saving
      // handleBack();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Settings</ThemedText>

      {/* Privacy Settings Section */}
      <View style={styles.section}>
          <ThemedText type="subtitle">Privacy</ThemedText>
          <View style={styles.settingItem}>
              <ThemedText>Private Profile</ThemedText>
              <Switch
                  value={isProfilePrivate}
                  onValueChange={setIsProfilePrivate}
                  // Add trackColor, thumbColor for theming if needed
              />
          </View>
           <View style={styles.settingItem}>
              <ThemedText>Share Live Location During Rides</ThemedText>
              <Switch
                  value={shareLocation}
                  onValueChange={setShareLocation}
              />
          </View>
          {/* Add more privacy options */}
      </View>

       {/* Notification Settings Section (Placeholder) */}
       <View style={styles.section}>
          <ThemedText type="subtitle">Notifications</ThemedText>
          <ThemedText style={styles.placeholderText}>(Notification preferences here)</ThemedText>
       </View>

        {/* Account Settings Section (Placeholder) */}
       <View style={styles.section}>
          <ThemedText type="subtitle">Account</ThemedText>
           <ThemedText style={styles.placeholderText}>(Change Password, Delete Account, etc.)</ThemedText>
       </View>


      {/* Replace Button with Tamagui Button if available */}
      <View style={styles.buttonContainer}>
          <Button title="Save Settings" onPress={handleSaveSettings} />
          <View style={{ height: 10 }} />
          <Button title="Back to Profile" onPress={handleBack} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        marginBottom: 20,
    },
    section: {
        marginBottom: 25,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee', // Use theme color
    },
    placeholderText: {
        color: 'grey',
        marginTop: 5,
    },
    buttonContainer: {
        marginTop: 'auto', // Push buttons to the bottom
        paddingBottom: 10,
    }
});
