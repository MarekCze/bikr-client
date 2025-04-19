import React, { useState } from 'react';
import { Avatar, Button, Card, XStack, YStack, Text, Paragraph, Popover, View, Spinner } from 'tamagui';
import { ClubMembershipStatus, ClubRole, ClubMembership } from 'bikr-shared';
import { Users, Crown, Shield, UserMinus, Settings, MoreVertical } from '@tamagui/lucide-icons';
import { useClub } from '../../contexts/ClubContext';
import { useRouter } from 'expo-router';

interface ClubMemberListItemProps {
  clubId: string;
  membership: ClubMembership;
  currentUserRole?: ClubRole; // The current user's role in the club (used for showing admin actions)
  onRoleChange?: (userId: string, newRole: ClubRole) => void;
  onRemoveMember?: (userId: string) => void;
}

/**
 * Component for displaying a club member in a list with role status
 * and admin capabilities to manage roles
 */
export const ClubMemberListItem: React.FC<ClubMemberListItemProps> = ({
  clubId,
  membership,
  currentUserRole,
  onRoleChange,
  onRemoveMember,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const clubRepository = useClub();
  const router = useRouter();

  // Extract user data from the membership
  const { user_id, role, profile } = membership;
  const userName = profile?.username || profile?.fullName || 'Unknown User';
  const userAvatar = profile?.avatarUrl || undefined;
  
  // Check if current user is an admin or owner
  const canManageMember = 
    currentUserRole === ClubRole.ADMIN || 
    currentUserRole === ClubRole.OWNER;

  // Owners can only be managed by other owners
  const canManageThisMember = 
    canManageMember && 
    !(role === ClubRole.OWNER && currentUserRole !== ClubRole.OWNER);

  const handlePromoteToAdmin = async () => {
    if (!canManageThisMember) return;
    
    setIsLoading(true);
    try {
      // Cast to use the concrete repository type with more methods
      const repo = clubRepository as any;
      await repo.updateMembership(clubId, user_id, { 
        role: ClubRole.ADMIN 
      });
      
      if (onRoleChange) {
        onRoleChange(user_id, ClubRole.ADMIN);
      }
    } catch (error) {
      console.error('Error promoting member:', error);
    } finally {
      setIsLoading(false);
      setIsMenuOpen(false);
    }
  };

  const handleDemoteToMember = async () => {
    if (!canManageThisMember) return;
    
    setIsLoading(true);
    try {
      // Cast to use the concrete repository type with more methods
      const repo = clubRepository as any;
      await repo.updateMembership(clubId, user_id, { 
        role: ClubRole.MEMBER 
      });
      
      if (onRoleChange) {
        onRoleChange(user_id, ClubRole.MEMBER);
      }
    } catch (error) {
      console.error('Error demoting member:', error);
    } finally {
      setIsLoading(false);
      setIsMenuOpen(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!canManageThisMember) return;
    
    setIsLoading(true);
    try {
      // Cast to use the concrete repository type with more methods
      const repo = clubRepository as any;
      await repo.removeMembership(clubId, user_id);
      
      if (onRemoveMember) {
        onRemoveMember(user_id);
      }
    } catch (error) {
      console.error('Error removing member:', error);
    } finally {
      setIsLoading(false);
      setIsMenuOpen(false);
    }
  };

  const handleUserPress = () => {
    router.push({
      pathname: '/profile/[userId]' as any,
      params: { userId: user_id }
    });
  };

  // Get icon and color based on member role
  const getRoleIcon = () => {
    switch (role) {
      case ClubRole.OWNER:
        return <Crown size="$1" color="$yellow9" />;
      case ClubRole.ADMIN:
        return <Shield size="$1" color="$blue9" />;
      default:
        return null;
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case ClubRole.OWNER:
        return 'Owner';
      case ClubRole.ADMIN:
        return 'Admin';
      default:
        return 'Member';
    }
  };

  return (
    <XStack 
      space="$3"
      paddingVertical="$2"
      paddingHorizontal="$3"
      alignItems="center"
      pressStyle={{ opacity: 0.7 }}
      onPress={handleUserPress}
    >
      {/* User Avatar */}
      <Avatar circular size="$5">
        {userAvatar ? (
          <Avatar.Image src={userAvatar} />
        ) : null}
        <Avatar.Fallback backgroundColor="$blue5">
          <Users size="$2" color="$blue11" />
        </Avatar.Fallback>
      </Avatar>
      
      {/* User and Role Info */}
      <YStack flex={1}>
        <XStack alignItems="center" space="$1">
          <Text fontWeight="bold" fontSize="$4">{userName}</Text>
          {getRoleIcon()}
        </XStack>
        
        <Text color="$gray10" fontSize="$2">
          {getRoleLabel()}
        </Text>
      </YStack>
      
      {/* Admin Actions (only shown if current user can manage members) */}
      {canManageThisMember && (
        <>
          {isMenuOpen ? (
            <XStack space="$1">
              {/* Close button */}
              <Button
                circular
                size="$2.5"
                backgroundColor="$gray4"
                onPress={() => setIsMenuOpen(false)}
                disabled={isLoading}
              >
                <Text fontSize="$1">X</Text>
              </Button>
              
              {/* Action buttons */}
              {role !== ClubRole.ADMIN && (
                <Button
                  size="$2.5"
                  backgroundColor="$blue5"
                  onPress={handlePromoteToAdmin}
                  disabled={isLoading}
                >
                  <Shield size="$1" />
                </Button>
              )}
              
              {role === ClubRole.ADMIN && (
                <Button
                  size="$2.5"
                  backgroundColor="$gray5"
                  onPress={handleDemoteToMember}
                  disabled={isLoading}
                >
                  <Users size="$1" />
                </Button>
              )}
              
              {role !== ClubRole.OWNER && (
                <Button
                  size="$2.5"
                  backgroundColor="$red5"
                  onPress={handleRemoveMember}
                  disabled={isLoading}
                >
                  <UserMinus size="$1" />
                </Button>
              )}
            </XStack>
          ) : (
            <Button
              circular
              size="$2.5"
              backgroundColor="transparent"
              onPress={() => setIsMenuOpen(true)}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="small" /> : <MoreVertical size="$1" />}
            </Button>
          )}
        </>
      )}
    </XStack>
  );
};
