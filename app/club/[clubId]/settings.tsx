import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { YStack, Spinner, Button, Text } from 'tamagui';
import { useClub } from '../../../contexts/ClubContext';
import { SupabaseClubRepository } from '../../../repositories/SupabaseClubRepository';
import { ClubSettingsForm } from '../../../components/club';
import { Club, ClubRole, UpdateClubInput } from 'bikr-shared';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Club Settings Screen
 * Allows club owner/admins to edit club details or delete the club
 */
export default function ClubSettingsScreen() {
  const [club, setClub] = useState<Club | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const params = useLocalSearchParams();
  const clubId = typeof params.clubId === 'string' ? params.clubId : '';
  const router = useRouter();
  const clubRepository = useClub() as SupabaseClubRepository;
  const { user } = useAuth();

  // Fetch club data and check permissions
  useEffect(() => {
    async function loadClub() {
      if (!clubId || !user?.id) {
        router.back();
        return;
      }

      try {
        setIsLoading(true);
        
        // Get club details
        const clubData = await clubRepository.getClubById(clubId);
        if (!clubData) {
          Alert.alert('Error', 'Club not found');
          router.back();
          return;
        }
        
        // Check user permissions
        const membership = await clubRepository.getMembership(clubId, user.id);
        const hasPermission = membership && 
          (membership.role === ClubRole.OWNER || membership.role === ClubRole.ADMIN);
        
        if (!hasPermission) {
          Alert.alert('Error', 'You do not have permission to edit this club');
          router.back();
          return;
        }
        
        setClub(clubData);
        setIsAdmin(true);
      } catch (error) {
        console.error('Error loading club for settings:', error);
        Alert.alert('Error', 'Failed to load club details');
        router.back();
      } finally {
        setIsLoading(false);
      }
    }
    
    loadClub();
  }, [clubId, user?.id, clubRepository, router]);

  // Handle form submission
  const handleSubmit = useCallback(async (data: any) => {
    if (!club || !clubId) return;
    
    try {
      setIsSubmitting(true);
      
      // TODO: Add image upload logic here for avatar_url and banner_url
      // For now, we'll just use the URIs directly (from form) or leave them blank
      
      // Update the club
      await clubRepository.updateClub(clubId, data as UpdateClubInput);
      
      // Return to club details
      Alert.alert('Success', 'Club updated successfully');
      router.back();
    } catch (error) {
      console.error('Error updating club:', error);
      Alert.alert('Error', 'Failed to update club details');
    } finally {
      setIsSubmitting(false);
    }
  }, [club, clubId, clubRepository, router]);

  // Handle delete club button press
  const handleDeletePress = useCallback(() => {
    Alert.alert(
      'Delete Club',
      'Are you sure you want to delete this club? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: handleDeleteConfirm
        },
      ]
    );
  }, []);

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(async () => {
    if (!clubId) return;
    
    try {
      setIsDeleting(true);
      
      // Delete the club
      await clubRepository.deleteClub(clubId);
      
      // Navigate back to club list
      Alert.alert('Success', 'Club deleted successfully');
      router.back(); // This will navigate back to the club list
    } catch (error) {
      console.error('Error deleting club:', error);
      Alert.alert('Error', 'Failed to delete club');
    } finally {
      setIsDeleting(false);
    }
  }, [clubId, clubRepository, router]);

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  if (!club) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$6">
        <Text fontSize="$5" textAlign="center">Club not found or permission denied</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <ClubSettingsForm
        club={club}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
      
      {/* Delete Club Button (Owner Only) */}
      {club.owner_id === user?.id && (
        <Button
          marginTop="$6"
          theme="red"
          onPress={handleDeletePress}
          disabled={isDeleting}
          icon={isDeleting ? () => <Spinner size="small" color="white" /> : undefined}
        >
          Delete Club
        </Button>
      )}
    </YStack>
  );
}
