import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, Image, StyleSheet, Platform } from 'react-native'; // Or use Tamagui components
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // Import image picker
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/hooks/useAuth';
import { SupabaseProfileRepository } from '@/repositories/SupabaseProfileRepository'; // Adjust path if needed
import { User } from 'bikr-shared';

// TODO: Display more profile info (bio)
// TODO: Implement error handling more gracefully
// TODO: Handle Blob/File conversion for upload if needed

const profileRepository = new SupabaseProfileRepository();

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false); // Specific loading state for avatar
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
        Alert.alert('Error', 'Could not load your profile.'); // Simple error feedback
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]); // Refetch if user ID changes

  // Use relative paths for navigation within the same route group
  const goToEditProfile = () => router.push('./edit');
  const goToGarage = () => router.push('./garage');
  const goToSettings = () => router.push('./settings');

  const handleChangeAvatar = async () => {
    // Request media library permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "You need to allow access to your photos to change your avatar.");
      return;
    }

    // Launch image picker
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for avatars
      quality: 0.5, // Reduce quality to save storage/bandwidth
    });

    if (pickerResult.canceled) {
      console.log('Image selection cancelled.');
      return;
    }

    // Handle the selected image
    const selectedImageUri = pickerResult.assets[0].uri;
    console.log('Selected image URI:', selectedImageUri);

    // Upload the image
    setIsUploadingAvatar(true);
    setError(null); // Clear previous errors
    try {
      // Pass the URI directly, repository needs to handle conversion if necessary
      const newAvatarUrl = await profileRepository.uploadAvatar(selectedImageUri);
      if (newAvatarUrl && profile) {
         // Optimistically update UI
         setProfile({ ...profile, avatarUrl: newAvatarUrl });
         Alert.alert('Success', 'Avatar updated!');
      } else if (!newAvatarUrl) {
          // Handle case where upload succeeded but URL retrieval or profile update failed in repo
          Alert.alert('Upload Issue', 'Avatar uploaded, but failed to update profile link.');
      }
    } catch (uploadError: any) {
       console.error("Failed to upload avatar:", uploadError);
       Alert.alert('Upload Failed', uploadError.message || 'Could not upload avatar.');
       setError(uploadError.message || 'Could not upload avatar.'); // Show error state
    } finally {
       setIsUploadingAvatar(false);
    }
  };


  const renderProfileDetails = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" style={styles.centered} />;
    }
    // Show general loading indicator OR specific avatar upload indicator
    if (isUploadingAvatar) {
        return <ActivityIndicator size="large" style={styles.centered} />;
    }
    if (error && !profile) { // Show error only if profile failed to load initially
      return <ThemedText style={styles.errorText}>Error loading profile: {error}</ThemedText>;
    }
     if (!profile) {
      return <ThemedText style={styles.centered}>No profile data found. Maybe complete onboarding?</ThemedText>;
      // TODO: Potentially redirect to onboarding if profile is null?
    }
    // Profile loaded, potentially show upload error separately if needed
    return (
      <View style={styles.profileContainer}>
         <Image
            source={profile.avatarUrl ? { uri: profile.avatarUrl } : require('@/assets/images/icon.png')} // Use default icon as placeholder
            style={styles.avatar}
          />
          <Button title="Change Avatar" onPress={handleChangeAvatar} disabled={isUploadingAvatar} />
           {/* Display upload error if it occurred */}
           {error && <ThemedText style={[styles.errorText, { marginTop: 5 }]}>Upload Error: {error}</ThemedText>}
          <View style={styles.detailsText}>
              <ThemedText>Username: {profile.username || 'Not set'}</ThemedText>
              <ThemedText>Email: {profile.email}</ThemedText>
              <ThemedText>Full Name: {profile.fullName || 'Not set'}</ThemedText>
              {/* Add Bio, etc. */}
          </View>
      </View>
    );
  };

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title" style={styles.title}>My Profile</ThemedText>

      {/* Display profile details */}
      <View style={styles.detailsBox}>
        {renderProfileDetails()}
      </View>

      {/* Replace Button with Tamagui Button if available */}
      <View style={styles.buttonContainer}>
          <Button title="Edit Profile" onPress={goToEditProfile} disabled={!profile || isLoading} />
          <View style={styles.buttonSpacer} />
          <Button title="My Garage" onPress={goToGarage} />
          <View style={styles.buttonSpacer} />
          <Button title="Settings" onPress={goToSettings} />
      </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
    title: {
        marginBottom: 10,
    },
    detailsBox: {
        marginVertical: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: 'grey', // Use theme color later
        borderRadius: 8,
        minHeight: 150, // Adjust as needed
    },
    profileContainer: {
        alignItems: 'center', // Center avatar and button
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        backgroundColor: '#ccc', // Placeholder background
    },
    detailsText: {
        marginTop: 15,
        alignSelf: 'stretch', // Make text container take width
    },
    buttonContainer: {
        marginTop: 20,
    },
    buttonSpacer: {
        height: 10,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    }
});
