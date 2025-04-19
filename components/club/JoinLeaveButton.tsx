import React, { useState } from 'react';
import { Button, Spinner } from 'tamagui';
import { Club, ClubMembershipStatus, ClubRole } from 'bikr-shared';
import { useClub } from '../../contexts/ClubContext';

interface JoinLeaveButtonProps {
  clubId: string;
  membershipStatus?: ClubMembershipStatus | null;
  onMembershipChange?: (clubId: string, newStatus: ClubMembershipStatus | null) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined';
}

/**
 * A reusable join/leave button for clubs that handles different membership states
 * and provides visual feedback during loading.
 */
export const JoinLeaveButton: React.FC<JoinLeaveButtonProps> = ({
  clubId,
  membershipStatus,
  onMembershipChange,
  size = 'medium',
  variant = 'default',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const clubRepository = useClub();
  const isMember = !!membershipStatus && membershipStatus === ClubMembershipStatus.APPROVED;
  const isPending = !!membershipStatus && membershipStatus === ClubMembershipStatus.PENDING;
  // We'll only show this button to members, not owners, but check anyway
  const isOwner = false; // Ownership would be determined at a higher level

  // Map size prop to Tamagui button size
  const buttonSize = {
    'small': '$3',
    'medium': '$4',
    'large': '$5'
  }[size];

  const handlePress = async () => {
    if (isOwner) {
      console.warn("As the owner, you cannot leave the club. Transfer ownership first.");
      return;
    }

    if (isLoading || isPending) return;
    
    setIsLoading(true);
    
    try {
      if (isMember) {
        // Cast to access convenience methods
        const repo = clubRepository as any;
        await repo.leaveClub(clubId);
        if (onMembershipChange) {
          onMembershipChange(clubId, null);
        }
        console.log("Left club: You are no longer a member");
      } else {
        // Cast to access convenience methods
        const repo = clubRepository as any;
        await repo.joinClub(clubId);
        // The status might be APPROVED or PENDING based on club privacy
        // The repository should return the new status, but for now we'll assume APPROVED
        const newStatus = ClubMembershipStatus.APPROVED;
        if (onMembershipChange) {
          onMembershipChange(clubId, newStatus);
        }
        console.log("Joined club: You are now a member");
      }
    } catch (error: any) {
      console.error('Error joining/leaving club:', error);
      console.error(`Failed to ${isMember ? 'leave' : 'join'} club: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Different states based on membership
  if (isOwner) {
    return (
      <Button
        size={buttonSize}
        theme="dark"
        disabled
      >
        Owner
      </Button>
    );
  }

  if (isPending) {
    return (
      <Button
        size={buttonSize}
        backgroundColor="$yellow8"
        disabled
      >
        Requested
      </Button>
    );
  }

  return (
    <Button
      size={buttonSize}
      theme={isMember ? 'active' : undefined}
      variant={variant === 'outlined' ? 'outlined' : undefined}
      onPress={handlePress}
      disabled={isLoading}
    >
      {isLoading ? <Spinner size="small" /> : isMember ? 'Leave' : 'Join'}
    </Button>
  );
};
