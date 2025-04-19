import React from 'react';
import { Avatar, Button, Paragraph, Text, XStack, YStack, Spinner, Circle } from 'tamagui';
import { Club, ClubMembershipStatus, ClubPrivacy } from 'bikr-shared';
import { Users, Lock } from '@tamagui/lucide-icons';
import { useClub } from '../../contexts/ClubContext';
import { useRouter } from 'expo-router';
import { SupabaseClubRepository } from '../../repositories/SupabaseClubRepository';

interface ClubListItemProps {
  club: Club;
  membershipStatus?: ClubMembershipStatus | null; // Whether the current user is a member
  onJoinLeaveToggle?: (clubId: string, isMember: boolean) => void; // Optional callback
  isLoading?: boolean; // For join/leave button loading state
  showMemberCount?: boolean; // Whether to show member count
}

export const ClubListItem: React.FC<ClubListItemProps> = ({
  club,
  membershipStatus,
  onJoinLeaveToggle,
  isLoading = false,
  showMemberCount = true,
}) => {
  const router = useRouter();
  const clubRepository = useClub();

  const isMember = !!membershipStatus && membershipStatus === ClubMembershipStatus.APPROVED;
  const isPending = !!membershipStatus && membershipStatus === ClubMembershipStatus.PENDING;
  
  const handleJoinLeaveToggle = async () => {
    if (onJoinLeaveToggle) {
      onJoinLeaveToggle(club.id, isMember);
      return;
    }
    
    // Default implementation if no callback provided
    try {
      // Cast to access the convenience methods
      const repository = clubRepository as SupabaseClubRepository;
      if (isMember) {
        await repository.leaveClub(club.id);
      } else {
        await repository.joinClub(club.id);
      }
      // Note: In a real implementation, you'd probably want to update the local state/context
      // after a successful join/leave, but that would depend on how the parent component manages state
    } catch (error) {
      console.error('Error joining/leaving club:', error);
      // Consider showing a toast notification for errors
    }
  };
  
  const handlePress = () => {
    // Since the club routes might not be set up yet, we'll use a simple alert for now
    // In a real implementation, this would navigate to the club page
    // router.push({ pathname: '/club/[clubId]', params: { clubId: club.id } });
    alert(`Navigating to club: ${club.name}`);
  };

  const getButtonText = () => {
    if (isLoading) return <Spinner size="small" />;
    if (isPending) return 'Requested';
    return isMember ? 'Leave' : 'Join';
  };

  return (
    <XStack 
      space="$3" 
      alignItems="center" 
      paddingVertical="$2" 
      paddingHorizontal="$3"
      pressStyle={{ opacity: 0.8 }}
      onPress={handlePress}
    >
      <Avatar circular size="$4">
        {club.avatar_url ? (
          <Avatar.Image accessibilityLabel={`${club.name} club avatar`} src={club.avatar_url} />
        ) : null}
        <Avatar.Fallback backgroundColor="$blue6">
          <Users size="$2" color="$blue11" />
        </Avatar.Fallback>
      </Avatar>
      <YStack flex={1} space="$1">
        <XStack alignItems="center" space="$2">
          <Paragraph fontWeight="bold" fontSize="$4">{club.name}</Paragraph>
          {club.privacy === ClubPrivacy.PRIVATE && (
            <Circle size="$2" backgroundColor="$gray8">
              <Lock size="$1" color="white" />
            </Circle>
          )}
        </XStack>
        
        {club.description && (
          <Paragraph 
            numberOfLines={2} 
            theme="alt2" 
            fontSize="$3"
          >
            {club.description}
          </Paragraph>
        )}
        
        <XStack space="$3" paddingTop="$1">
          {showMemberCount && club.member_count !== undefined && (
            <Text fontSize="$2" color="$gray11">
              👥 {club.member_count} {club.member_count === 1 ? 'member' : 'members'}
            </Text>
          )}
        </XStack>
      </YStack>
      
      {membershipStatus !== undefined && (
        <Button
          size="$3"
          theme={isMember ? 'active' : undefined}
          backgroundColor={isPending ? '$yellow8' : undefined}
          onPress={handleJoinLeaveToggle}
          disabled={isLoading || isPending}
        >
          {getButtonText()}
        </Button>
      )}
    </XStack>
  );
};
