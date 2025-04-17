import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native'; // Keep Alert, add ScrollView
import { useRouter } from 'expo-router';
import { YStack, XStack, Button, Switch, Paragraph, H2, H3, Separator, Spinner } from 'tamagui'; // Import Tamagui components, Added Spinner
import { ThemedView } from '@/components/ThemedView'; // Keep ThemedView for background

// TODO: Fetch current settings values (requires adding fields to User type/DB)
// TODO: Integrate with ProfileRepository or a dedicated SettingsRepository to save preferences
// TODO: Add more settings (Notifications, Account etc.)

export default function SettingsScreen() {
  const router = useRouter();
  // Example state for settings - these would ideally be fetched
  const [isProfilePrivate, setIsProfilePrivate] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Add saving state

  const handleBack = () => {
     if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('./'); // Use relative path for fallback
    }
  };

  const handleSaveSettings = async () => {
      // TODO: Call repository to save settings
      // Example: await profileRepository.updateProfile({ isPrivate: isProfilePrivate, shareLocation: shareLocation });
      setIsSaving(true);
      console.log('Saving settings:', { isProfilePrivate, shareLocation });
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 500));
      Alert.alert('TODO', 'Settings saving not fully implemented yet.');
      setIsSaving(false);
      // Optionally navigate back after saving
      // handleBack();
  };

  return (
    <ThemedView style={{ flex: 1 }}>
        <ScrollView>
            <YStack flex={1} padding="$4" space="$4">
                <H2 textAlign="center">Settings</H2>

                {/* Privacy Settings Section */}
                <YStack space="$3" borderWidth={1} borderColor="$gray6" borderRadius="$4" padding="$3">
                    <H3>Privacy</H3>
                    <XStack alignItems="center" justifyContent="space-between">
                        <Paragraph>Private Profile</Paragraph>
                        <Switch
                            checked={isProfilePrivate}
                            onCheckedChange={setIsProfilePrivate}
                            disabled={isSaving}
                            native // Use native switch for now
                            // Tamagui Switch requires specific setup for web/native consistency
                            // size="$3"
                        >
                            {/* Tamagui Switch requires specific setup */}
                            {/* <Switch.Thumb animation="quick" /> */}
                        </Switch>
                    </XStack>
                    <Separator />
                    <XStack alignItems="center" justifyContent="space-between">
                        <Paragraph>Share Live Location During Rides</Paragraph>
                         <Switch
                            checked={shareLocation}
                            onCheckedChange={setShareLocation}
                            disabled={isSaving}
                            native
                            // size="$3"
                        >
                            {/* <Switch.Thumb animation="quick" /> */}
                        </Switch>
                    </XStack>
                    {/* Add more privacy options */}
                </YStack>

                {/* Notification Settings Section (Placeholder) */}
                <YStack space="$2" borderWidth={1} borderColor="$gray6" borderRadius="$4" padding="$3">
                    <H3>Notifications</H3>
                    <Paragraph color="$gray10">(Notification preferences here)</Paragraph>
                    {/* Add notification toggles */}
                </YStack>

                {/* Account Settings Section (Placeholder) */}
                <YStack space="$2" borderWidth={1} borderColor="$gray6" borderRadius="$4" padding="$3">
                    <H3>Account</H3>
                    <Paragraph color="$gray10">(Change Password, Delete Account, etc.)</Paragraph>
                    {/* Add account action buttons */}
                </YStack>

                {/* Action Buttons */}
                <YStack space="$3" marginTop="$4">
                    <Button
                        onPress={handleSaveSettings}
                        disabled={isSaving}
                        theme="active"
                        icon={isSaving ? () => <Spinner /> : undefined}
                    >
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </Button>
                    <Button onPress={handleBack} disabled={isSaving} theme="alt1">
                        Back to Profile
                    </Button>
                </YStack>
            </YStack>
        </ScrollView>
    </ThemedView>
  );
}

// StyleSheet removed
