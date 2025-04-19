import React, { useState } from 'react';
import { Avatar, Button, H4, Paragraph, Image, XStack, YStack, ZStack, Circle, Text } from 'tamagui';
import { Club, ClubMembershipStatus, ClubPrivacy, ClubRole } from 'bikr-shared';
import { Map, Users, Lock, Settings, MoreVertical } from '@tamagui/lucide-icons';
import { useClub } from '../../contexts/ClubContext';
import { useRouter } from 'expo-router';
import { JoinLeaveButton } from './JoinLeaveButton';

interface ClubHeaderProps {
  club: Club;
  membershipStatus?: ClubMembershipStatus | null;
  memberCount?: number;
  onMembershipChange?: (clubId: string, newStatus: ClubMembershipStatus | null) => void;
  isAdmin?: boolean;
  compact?: boolean; // Compact mode for smaller header (less padding, smaller fonts)
}

/**
 * Club header component showing banner, avatar, name, description, and action buttons.
 * Used at the top of club profile screens.
 */
export const ClubHeader: React.FC<ClubHeaderProps> = ({
  club,
  membershipStatus,
  memberCount,
  onMembershipChange,
  isAdmin = false,
  compact = false,
}) => {
  const router = useRouter();
  
  // Fallback count if not provided directly
  const displayMemberCount = memberCount ?? club.member_count ?? 0;
  
  const handleSettingsPress = () => {
    // Using as any to avoid TypeScript errors until the routes are created
    router.push({
      pathname: `/club/[clubId]/settings` as any,
      params: { clubId: club.id }
    });
  };

  const handleMembersPress = () => {
    // Using as any to avoid TypeScript errors until the routes are created
    router.push({
      pathname: `/club/[clubId]/members` as any,
      params: { clubId: club.id }
    });
  };

  // Default banner if none provided
  const bannerUrl = club.banner_url || 'https://placehold.co/900x200/005FFF/FFFFFF?text=Club+Banner';

  // Determine vertical padding based on compact mode
  const verticalPadding = compact ? '$2' : '$4';
  
  return (
    <YStack>
      {/* Banner with Avatar overlay */}
      <ZStack>
        {/* Banner Image */}
        <Image
          source={{ uri: bannerUrl }}
          width="100%"
          height={compact ? 120 : 180}
          resizeMode="cover"
        />
        
        {/* Gradient overlay to ensure text readability */}
        <YStack
          position="absolute"
          bottom={0}
          width="100%"
          height="50%"
          backgroundColor="rgba(0,0,0,0.4)"
          opacity={0.7}
        />
        
        {/* Club Avatar - positioned at bottom edge of banner */}
        <Avatar
          size={compact ? '$8' : '$10'}
          position="absolute"
          bottom={-25}
          left={20}
          borderColor="$background"
          borderWidth={3}
        >
          {club.avatar_url ? (
            <Avatar.Image accessibilityLabel={`${club.name} club avatar`} src={club.avatar_url} />
          ) : null}
          <Avatar.Fallback backgroundColor="$blue6">
            <Users size={compact ? '$6' : '$8'} color="$blue11" />
          </Avatar.Fallback>
        </Avatar>
        
        {/* Privacy indicator - top right */}
        {club.privacy === ClubPrivacy.PRIVATE && (
          <Circle 
            size="$4" 
            backgroundColor="$gray8"
            position="absolute"
            top={10}
            right={10}
          >
            <Lock size="$2" color="white" />
          </Circle>
        )}
        
        {/* Admin action buttons - conditional rendering */}
        {isAdmin && (
          <XStack 
            space="$2" 
            position="absolute" 
            bottom={10} 
            right={10}
          >
            <Button
              size="$3"
              circular
              icon={<Settings size="$1" />}
              onPress={handleSettingsPress}
              backgroundColor="$gray8"
              opacity={0.9}
            />
            <Button
              size="$3"
              circular
              icon={<MoreVertical size="$1" />}
              backgroundColor="$gray8"
              opacity={0.9}
            />
          </XStack>
        )}
      </ZStack>
      
      {/* Club Info Section - padded to account for avatar overflow */}
      <YStack paddingTop="$6" paddingHorizontal="$4" paddingBottom={verticalPadding} space="$1">
        {/* Club name and privacy row */}
        <XStack alignItems="center" justifyContent="space-between">
          <H4 paddingLeft="$6">{club.name}</H4>
          
          {/* Join/Leave Button */}
          <JoinLeaveButton
            clubId={club.id}
            membershipStatus={membershipStatus}
            onMembershipChange={onMembershipChange}
            size={compact ? 'small' : 'medium'}
          />
        </XStack>
        
        {/* Member count and location */}
        <XStack space="$3" marginTop="$1" paddingLeft="$6">
          <XStack space="$1" alignItems="center">
            <Users size="$3" opacity={0.7} />
            <Text fontSize="$2" color="$gray11">
              {displayMemberCount} {displayMemberCount === 1 ? 'member' : 'members'}
            </Text>
          </XStack>
          
          {/* Location information - temporarily removed until added to Club schema */}
          {/*
          <XStack space="$1" alignItems="center">
            <Map size="$3" opacity={0.7} />
            <Text fontSize="$2" color="$gray11">Location</Text>
          </XStack>
          */}
        </XStack>
        
        {/* Club description */}
        {club.description && (
          <Paragraph
            marginTop="$2"
            paddingLeft="$6"
            paddingRight="$2"
            numberOfLines={compact ? 2 : undefined}
            opacity={0.9}
          >
            {club.description}
          </Paragraph>
        )}
      </YStack>
    </YStack>
  );
};
