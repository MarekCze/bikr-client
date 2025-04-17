import React, { useState, useEffect } from 'react';
import { Alert, ScrollView } from 'react-native'; // Keep Alert, add ScrollView
import { useRouter } from 'expo-router';
import { YStack, XStack, Button, Spinner, Paragraph, H2, Input, Label, TextArea } from 'tamagui'; // Import Tamagui components
import { ThemedView } from '@/components/ThemedView'; // Keep ThemedView for background
import { useAuth } from '@/hooks/useAuth';
import { SupabaseProfileRepository } from '@/repositories/SupabaseProfileRepository';
import { User } from 'bikr-shared';

// TODO: Add fields for bio, etc. - Added basic fields
// TODO: Handle avatar upload separately (done in profile/index.tsx)

const profileRepository = new SupabaseProfileRepository();

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  // State for editable fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  // State to hold the full profile for display purposes (non-editable fields)
  const [fullProfile, setFullProfile] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current profile data to pre-fill form
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setError('User not authenticated.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProfile = await profileRepository.getProfile(user.id);
        if (fetchedProfile) {
          setFullProfile(fetchedProfile); // Store full profile
          // Set state for editable fields
          setUsername(fetchedProfile.username || '');
          setFullName(fetchedProfile.fullName || '');
          // Add other editable fields here if needed in the future
        } else {
          setError('Profile not found.');
          Alert.alert('Error', 'Could not load profile data.');
        }
      } catch (err: any) {
        console.error("Failed to fetch profile for editing:", err);
        setError(err.message || 'Failed to load profile data.');
        Alert.alert('Error', 'Could not load profile data for editing.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleSave = async () => {
    // Basic validation could be added here (e.g., check username length)
    if (!username && !fullName) {
        Alert.alert('No Changes', 'Please enter a username or full name.');
        return;
    }

    setIsSaving(true);
    setError(null);
    try {
        // Only send editable fields that have actually changed
        const dataToSave: Partial<User> = {};
        if (username !== (fullProfile?.username || '')) {
            dataToSave.username = username;
        }
        if (fullName !== (fullProfile?.fullName || '')) {
            dataToSave.fullName = fullName;
        }
        // Add other fields if they become editable

        if (Object.keys(dataToSave).length === 0) {
             Alert.alert('No Changes', 'No changes detected to save.');
             setIsSaving(false);
             return;
        }

        const updatedProfile = await profileRepository.updateProfile(dataToSave);
        console.log('Profile updated:', updatedProfile);
        Alert.alert('Success', 'Profile updated successfully!');
        // Navigate back to profile view on success
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('./'); // Use relative path for fallback
        }
    } catch (err: any) {
        console.error("Failed to update profile:", err);
        setError(err.message || 'Failed to save profile.');
        Alert.alert('Error', 'Could not save profile changes.');
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
     if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('./'); // Use relative path for fallback
    }
  };

  if (isLoading) {
    return (
        // Use ThemedView for background, YStack for centering
        <ThemedView style={{ flex: 1 }}>
            <YStack flex={1} justifyContent="center" alignItems="center">
                <Spinner size="large" />
                <Paragraph marginTop="$2">Loading profile...</Paragraph>
            </YStack>
        </ThemedView>
    );
  }

  // Check if essential data is missing due to error
  if (error && !fullProfile) {
     return (
        // Use ThemedView for background, YStack for centering
        <ThemedView style={{ flex: 1 }}>
            <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" space="$3">
                <Paragraph color="$red10" textAlign="center">Error: {error}</Paragraph>
                {/* Use Tamagui Button */}
                <Button onPress={handleCancel}>Go Back</Button>
            </YStack>
        </ThemedView>
    );
  }

  // Main content rendering using Tamagui
  return (
    // Use ThemedView for background, add ScrollView for content
    <ThemedView style={{ flex: 1 }}>
        <ScrollView>
            <YStack flex={1} padding="$4" space="$4">
                <H2 textAlign="center">Edit Profile</H2>

                {/* Form using YStack */}
                <YStack space="$3" borderWidth={1} borderColor="$gray6" borderRadius="$4" padding="$3">
                    <YStack>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter username"
                            disabled={isSaving}
                        />
                    </YStack>
                    <YStack>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter full name"
                            disabled={isSaving}
                        />
                    </YStack>
                    {/* Display non-editable fields */}
                     <YStack>
                        <Label>Email (Cannot Change)</Label>
                        <Paragraph color="$gray10">{fullProfile?.email || 'N/A'}</Paragraph>
                    </YStack>
                     <YStack>
                        <Label>Experience Level</Label>
                        <Paragraph>{fullProfile?.experienceLevel || 'Not set'}</Paragraph>
                    </YStack>
                     <YStack>
                        <Label>Interests</Label>
                        {fullProfile?.interests && fullProfile.interests.length > 0 ? (
                            <XStack flexWrap='wrap' space="$1" marginTop="$1">
                                {fullProfile.interests.map(interest => (
                                <Paragraph key={interest} size="$2" paddingHorizontal="$2" paddingVertical="$1" backgroundColor="$blue5" borderRadius="$2" color="$blue11">
                                    {interest}
                                </Paragraph>
                                ))}
                            </XStack>
                            ) : (
                            <Paragraph size="$2" color="$gray10">Not set</Paragraph>
                        )}
                    </YStack>
                    {/* Add other fields like Bio (e.g., using TextArea) */}
                    {/* <YStack>
                        <Label htmlFor="bio">Bio</Label>
                        <TextArea id="bio" placeholder="Tell us about yourself..." />
                    </YStack> */}

                    {/* Display save error */}
                    {error && <Paragraph color="$red10" textAlign="center">{error}</Paragraph>}
                </YStack>

                {/* Action Buttons */}
                <XStack justifyContent="space-around" marginTop="$3">
                    <Button onPress={handleCancel} disabled={isSaving} theme="alt1">
                        Cancel
                    </Button>
                    <Button onPress={handleSave} disabled={isSaving} theme="active" icon={isSaving ? () => <Spinner /> : undefined}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </XStack>

            </YStack>
        </ScrollView>
    </ThemedView>
  );
}
