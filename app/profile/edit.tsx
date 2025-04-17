import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ActivityIndicator, Alert } from 'react-native'; // Or use Tamagui components
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/hooks/useAuth';
import { SupabaseProfileRepository } from '@/repositories/SupabaseProfileRepository';
import { User } from 'bikr-shared';

// TODO: Replace TextInput with Tamagui Input if available
// TODO: Add fields for bio, etc.
// TODO: Implement better loading/error states for form
// TODO: Handle avatar upload separately

const profileRepository = new SupabaseProfileRepository();

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<Partial<User>>({});
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
          setProfileData({
            username: fetchedProfile.username,
            fullName: fetchedProfile.fullName,
            // Add other editable fields here (e.g., bio)
          });
        } else {
          setError('Profile not found.');
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

  const handleInputChange = (field: keyof Partial<User>, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profileData || Object.keys(profileData).length === 0) {
        Alert.alert('No Changes', 'No changes detected to save.');
        return;
    }
    setIsSaving(true);
    setError(null);
    try {
        const updatedProfile = await profileRepository.updateProfile(profileData);
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
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <ThemedText>Loading profile...</ThemedText>
        </ThemedView>
    );
  }

  if (error && !profileData) { // Show error only if loading failed completely
     return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <ThemedText style={{ color: 'red', marginBottom: 15 }}>Error: {error}</ThemedText>
            <Button title="Go Back" onPress={handleCancel} />
        </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title">Edit Profile</ThemedText>

      {/* Placeholder for profile edit form */}
      <View style={{ marginVertical: 20, padding: 15 }}>
          <ThemedText>Username:</ThemedText>
          <TextInput
            value={profileData.username || ''}
            onChangeText={(text) => handleInputChange('username', text)}
            placeholder="Enter username"
            style={styles.input} // Add basic styling
          />
          <ThemedText style={{ marginTop: 10 }}>Full Name:</ThemedText>
           <TextInput
            value={profileData.fullName || ''}
            onChangeText={(text) => handleInputChange('fullName', text)}
            placeholder="Enter full name"
            style={styles.input} // Add basic styling
          />
          {/* Add other fields like Bio */}
          {error && <ThemedText style={{ color: 'red', marginTop: 10 }}>Error: {error}</ThemedText>}
      </View>

      {/* Replace Button with Tamagui Button if available */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '80%', alignSelf: 'center' }}>
          <Button title="Cancel" onPress={handleCancel} disabled={isSaving} />
          <Button title="Save Changes" onPress={handleSave} disabled={isSaving} />
      </View>
      {isSaving && <ActivityIndicator style={{ marginTop: 10 }} />}
    </ThemedView>
  );
}

// Basic styling (replace with Tamagui styles if preferred)
const styles = {
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        marginTop: 5,
        borderRadius: 5,
        // Add color based on theme if needed
    }
};
// REMOVE DUPLICATED CODE BLOCK BELOW THIS LINE
