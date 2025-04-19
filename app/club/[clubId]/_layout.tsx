import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, Tabs } from 'expo-router';
import { YStack, Spinner, H3, Button } from 'tamagui';
import { ClubHeader, JoinLeaveButton } from '../../../components/club';
import { Club, ClubMembershipStatus, ClubRole } from 'bikr-shared';
import { useClub } from '../../../contexts/ClubContext';
import { ArrowLeft, Users, Info, Settings } from '@tamagui/lucide-icons';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Layout for club profile screens with tabs for different sections
 */
export default function ClubProfileLayout() {
  const { clubId } = useLocalSearchParams();
  const { session } = useAuth();
  const clubRepository = useClub();
  
  const [club, setClub] = useState<Club | null>(null);
  const [membershipStatus, setMembershipStatus] = useState<ClubMembershipStatus | null>(null);
  const [memberCount, setMemberCount] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Determine if current user is admin or owner
  const [memberRole, setMemberRole] = useState<ClubRole | null>(null);
  const isAdmin = club?.owner_id === session?.user?.id || memberRole === ClubRole.ADMIN;

  useEffect(() => {
    async function loadClubData() {
      if (!clubId || typeof clubId !== 'string') return;
      
      try {
        setLoading(true);
        
        // Fetch club details
        const clubData = await clubRepository.getClubById(clubId);
        if (!clubData) {
          setError('Club not found');
          return;
        }
        
        setClub(clubData);
        
        // Fetch membership status if user is logged in
        if (session?.user) {
          try {
            const membership = await clubRepository.getMembership(clubId, session.user.id);
            if (membership) {
              setMembershipStatus(membership.status || null);
              setMemberRole(membership.role || null);
            }
          } catch (membershipError) {
            console.error('Error fetching membership status:', membershipError);
            // Non-critical error, continue showing the club
          }
        }
      } catch (err) {
        console.error('Error loading club data:', err);
        setError('Failed to load club data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    loadClubData();
  }, [clubId, session?.user]);

  // Handle membership status change (join/leave)
  const handleMembershipChange = (clubId: string, newStatus: ClubMembershipStatus | null) => {
    setMembershipStatus(newStatus);
    
    // Update the count if needed
    if (newStatus && !membershipStatus) {
      setMemberCount((prev) => (prev !== undefined ? prev + 1 : undefined));
    } else if (!newStatus && membershipStatus) {
      setMemberCount((prev) => (prev !== undefined && prev > 0 ? prev - 1 : undefined));
    }
  };

  // Loading state
  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4">
        <Spinner size="large" />
        <H3>Loading club...</H3>
      </YStack>
    );
  }

  // Error state
  if (error || !club) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4" padding="$4">
        <H3>Could not load club</H3>
        <Button onPress={() => history.back()}>Go Back</Button>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Club header - will be present on all tabs */}
      <ClubHeader
        club={club}
        membershipStatus={membershipStatus}
        memberCount={memberCount}
        onMembershipChange={handleMembershipChange}
        isAdmin={isAdmin}
      />
      
      {/* Tab Navigation */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '$blue10',
          tabBarInactiveTintColor: '$gray10',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Feed',
            tabBarIcon: ({ color }) => <ArrowLeft size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="members"
          options={{
            title: 'Members',
            tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="details"
          options={{
            title: 'Details',
            tabBarIcon: ({ color }) => <Info size={24} color={color} />,
          }}
        />
        {isAdmin && (
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
            }}
          />
        )}
      </Tabs>
    </YStack>
  );
}
