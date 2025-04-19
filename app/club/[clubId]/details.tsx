import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, H4, Paragraph, Separator, Card, Button, Avatar } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { Users, MapPin, Calendar, Shield, Info, Link, Edit3 } from '@tamagui/lucide-icons';
import { Club, ClubRole, ClubPrivacy } from 'bikr-shared';
import { useClub } from '../../../contexts/ClubContext';
import { useAuth } from '../../../hooks/useAuth';
import { formatDate } from '../../../utils/date';

/**
 * Screen showing detailed club information
 */
export default function ClubDetailsScreen() {
  const { clubId } = useLocalSearchParams();
  const { session } = useAuth();
  const clubRepository = useClub();
  
  // We get the basic club data from the parent layout
  // This page just adds more detailed information

  const [club, setClub] = useState<Club | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadClubDetails();
  }, [clubId]);
  
  const loadClubDetails = async () => {
    if (!clubId || typeof clubId !== 'string') return;
    
    try {
      setLoading(true);
      
      // In a real implementation, we'd fetch more detailed club info
      // But for now, we'll just fetch the basic club info
      const clubData = await clubRepository.getClubById(clubId);
      setClub(clubData);
      
      // Check if user is an admin or owner
      if (clubData && session?.user) {
        try {
          const membership = await clubRepository.getMembership(clubId, session.user.id);
          setIsAdmin(
            clubData.owner_id === session.user.id || 
            (membership?.role === ClubRole.ADMIN || membership?.role === ClubRole.OWNER)
          );
        } catch (error) {
          console.error('Error checking user role:', error);
        }
      }
    } catch (error) {
      console.error('Error loading club details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!club) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Info size={32} opacity={0.5} />
        <Paragraph marginTop="$4">Club information not available</Paragraph>
      </YStack>
    );
  }
  
  const createdDate = club.created_at ? formatDate(new Date(club.created_at)) : 'Unknown';
  
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack padding="$4" space="$6">
        {/* Club Description */}
        <YStack space="$2">
          <H4>About</H4>
          <Paragraph>
            {club.description || 'No description provided.'}
          </Paragraph>
        </YStack>
        
        <Separator />
        
        {/* Club Information */}
        <YStack space="$4">
          <H4>Information</H4>
          
          <XStack space="$4" alignItems="center">
            <Calendar size={20} opacity={0.7} />
            <YStack>
              <Text fontWeight="bold">Founded</Text>
              <Text color="$gray11">{createdDate}</Text>
            </YStack>
          </XStack>
          
          <XStack space="$4" alignItems="center">
            <Users size={20} opacity={0.7} />
            <YStack>
              <Text fontWeight="bold">Members</Text>
              <Text color="$gray11">{club.member_count || 0} members</Text>
            </YStack>
          </XStack>
          
          {/* Location would be here once it's added to the Club model */}
          
          <XStack space="$4" alignItems="center">
            <Shield size={20} opacity={0.7} />
            <YStack>
              <Text fontWeight="bold">Privacy</Text>
              <Text color="$gray11">
                {club.privacy === ClubPrivacy.PUBLIC ? 'Public Club' : 'Private Club'}
              </Text>
            </YStack>
          </XStack>
          
          {/* Website would be here once it's added to the Club model */}
        </YStack>
        
        <Separator />
        
        {/* Club Rules - if applicable */}
        <YStack space="$2">
          <H4>Club Rules</H4>
          <Paragraph>
            No specific rules provided by the club administrators.
          </Paragraph>
        </YStack>
        
        {/* Admin Actions - only shown to admins */}
        {isAdmin && (
          <>
            <Separator />
            <YStack space="$2">
              <H4>Admin Actions</H4>
              <Card padding="$3" bordered>
                <YStack space="$2">
                  <Button
                    icon={<Edit3 size="$1" />}
                    onPress={() => {/* Navigate to edit screen */}}
                  >
                    Edit Club Details
                  </Button>
                </YStack>
              </Card>
            </YStack>
          </>
        )}
      </YStack>
    </ScrollView>
  );
}
