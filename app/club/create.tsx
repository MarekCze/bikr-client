import React, { useCallback, useState } from 'react';
import { ClubSettingsForm } from '../../components/club';
import { CreateClubInput } from 'bikr-shared';
import { useClub } from '../../contexts/ClubContext';
import { SupabaseClubRepository } from '../../repositories/SupabaseClubRepository';
import { YStack } from 'tamagui';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

/**
 * Club Creation Screen
 * Allows users to create a new club with name, description, avatar, etc.
 */
export default function CreateClubScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const clubRepository = useClub() as SupabaseClubRepository;
  const { user } = useAuth();

  const handleSubmit = useCallback(async (data: CreateClubInput) => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to create a club');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // TODO: Add image upload logic here for avatar_url and banner_url
      // For now, we'll just use the URIs directly (from form) or leave them blank
      
      // Create the club
      const newClub = await clubRepository.createClub(user.id, data);
      
      // Navigate to the new club's page
      router.back(); // For now just go back to club list
      // NOTE: Ideally we'd use router.push or replace, but there are type issues
      // Will need a proper navigation setup with type-safe routes
    } catch (error) {
      console.error('Error creating club:', error);
      Alert.alert(
        'Error Creating Club',
        'There was an error creating your club. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [clubRepository, router, user?.id]);

  const handleCancel = () => {
    router.back();
  };

  return (
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <ClubSettingsForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </YStack>
  );
}
