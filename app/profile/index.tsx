import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { YStack, XStack, Button, Spinner, Paragraph, H2, Image, Separator, ScrollView } from 'tamagui'; // Import Tamagui components
import { useAuth } from '@/hooks/useAuth';
import { SupabaseProfileRepository } from '@/repositories/SupabaseProfileRepository';
import { User } from 'bikr-shared';
import { ThemedView } from '@/components/ThemedView'; // Keep ThemedView for background

// TODO: Display more profile info (bio) - Added interests/experience
// TODO: Handle Blob/File conversion for upload if needed in repo

const profileRepository = new SupabaseProfileRepository();

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data
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
        setProfile(fetchedProfile);
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setError(err.message || 'Failed to load profile.');
        // Alert.alert('Error', 'Could not load your profile.'); // Avoid alert for initial load error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Navigation functions
  const goToEditProfile = () => router.push('./edit');
  const goToGarage = () => router.push('./garage');
  const goToSettings = () => router.push('./settings');

  // Avatar change handler
  const handleChangeAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Allow access to photos to change avatar.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (pickerResult.canceled) return;

    const selectedImageUri = pickerResult.assets[0].uri;
    setIsUploadingAvatar(true);
    setError(null);
    try {
      const newAvatarUrl = await profileRepository.uploadAvatar(selectedImageUri);
      if (newAvatarUrl && profile) {
        setProfile({ ...profile, avatarUrl: newAvatarUrl });
        Alert.alert('Success', 'Avatar updated!');
      } else {
        Alert.alert('Upload Issue', 'Avatar uploaded, but failed to update profile link.');
      }
    } catch (uploadError: any) {
      console.error("Failed to upload avatar:", uploadError);
      Alert.alert('Upload Failed', uploadError.message || 'Could not upload avatar.');
      setError(uploadError.message || 'Could not upload avatar.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Render profile content
  const renderProfileDetails = () => {
    if (isLoading) {
      return <Spinner size="large" marginVertical="$4" />;
    }
    if (error && !profile) {
      return <Paragraph color="$red10" textAlign="center">Error loading profile: {error}</Paragraph>;
    }
    if (!profile) {
      return <Paragraph textAlign="center">No profile data found. Maybe complete onboarding?</Paragraph>;
    }

    return (
      <YStack alignItems="center" space="$3">
        <Image
          source={profile.avatarUrl ? { uri: profile.avatarUrl, width: 100, height: 100 } : require('@/assets/images/icon.png')}
          width={100}
          height={100}
          borderRadius={50}
          backgroundColor="$gray5" // Placeholder background
        />
        <Button onPress={handleChangeAvatar} disabled={isUploadingAvatar} size="$3" icon={isUploadingAvatar ? () => <Spinner /> : undefined}>
          {isUploadingAvatar ? 'Uploading...' : 'Change Avatar'}
        </Button>
        {error && !isLoading && <Paragraph color="$red10" fontSize="$2" marginTop="$1">Upload Error: {error}</Paragraph>}

        <Separator marginVertical="$3" width="90%" />

        <YStack alignSelf="stretch" space="$2" paddingHorizontal="$2">
          <XStack justifyContent='space-between'>
            <Paragraph fontWeight="bold">Username:</Paragraph>
            <Paragraph>{profile.username || 'Not set'}</Paragraph>
          </XStack>
          <XStack justifyContent='space-between'>
            <Paragraph fontWeight="bold">Email:</Paragraph>
            <Paragraph>{profile.email}</Paragraph>
          </XStack>
          <XStack justifyContent='space-between'>
            <Paragraph fontWeight="bold">Full Name:</Paragraph>
            <Paragraph>{profile.fullName || 'Not set'}</Paragraph>
          </XStack>
          <XStack justifyContent='space-between'>
            <Paragraph fontWeight="bold">Experience:</Paragraph>
            <Paragraph>{profile.experienceLevel || 'Not set'}</Paragraph>
          </XStack>
          <YStack>
            <Paragraph fontWeight="bold">Interests:</Paragraph>
            {profile.interests && profile.interests.length > 0 ? (
              <XStack flexWrap='wrap' space="$1" marginTop="$1">
                {profile.interests.map(interest => (
                  <Paragraph key={interest} size="$2" paddingHorizontal="$2" paddingVertical="$1" backgroundColor="$blue5" borderRadius="$2" color="$blue11">
                    {interest}
                  </Paragraph>
                ))}
              </XStack>
            ) : (
              <Paragraph size="$2" color="$gray10">Not set</Paragraph>
            )}
          </YStack>
          {/* Add Bio, etc. */}
        </YStack>
      </YStack>
    );
  };

  return (
    // Use ThemedView for potential theme background, YStack for layout
    <ThemedView style={{ flex: 1 }}>
        <ScrollView>
            <YStack flex={1} padding="$4" space="$4">
                <H2 textAlign="center">My Profile</H2>

                {/* Display profile details */}
                <YStack borderWidth={1} borderColor="$gray6" borderRadius="$4" padding="$3" minHeight={150}>
                    {renderProfileDetails()}
                </YStack>

                {/* Navigation Buttons */}
                <YStack space="$3">
                    <Button onPress={goToEditProfile} disabled={!profile || isLoading || isUploadingAvatar} theme="active">
                        Edit Profile
                    </Button>
                    <Button onPress={goToGarage}>
                        My Garage
                    </Button>
                    <Button onPress={goToSettings}>
                        Settings
                    </Button>
                </YStack>
            </YStack>
        </ScrollView>
    </ThemedView>
  );
}

// Remove StyleSheet - styling is done inline with Tamagui props
