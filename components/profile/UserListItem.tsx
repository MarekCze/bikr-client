import React from 'react';
import { Avatar, Button, Paragraph, XStack, YStack } from 'tamagui';
import { User } from 'bikr-shared';
import { User as UserIcon } from '@tamagui/lucide-icons'; // Placeholder icon

interface UserListItemProps {
  user: User;
  isFollowing?: boolean; // Optional: Indicates if the current user is following this user
  onFollowToggle?: (userId: string, currentlyFollowing: boolean) => void; // Optional: Callback for follow/unfollow action
  isLoading?: boolean; // Optional: Indicates if the follow/unfollow action is in progress
}

export const UserListItem: React.FC<UserListItemProps> = ({
  user,
  isFollowing,
  onFollowToggle,
  isLoading = false,
}) => {
  const handleFollowToggle = () => {
    if (onFollowToggle) {
      onFollowToggle(user.id, !!isFollowing);
    }
  };

  return (
    <XStack space="$3" alignItems="center" paddingVertical="$2" paddingHorizontal="$3">
      <Avatar circular size="$4">
        {user.avatarUrl ? (
          <Avatar.Image accessibilityLabel={user.username || 'User avatar'} src={user.avatarUrl} />
        ) : null}
        <Avatar.Fallback backgroundColor="$gray6">
          <UserIcon size="$2" color="$gray11" />
        </Avatar.Fallback>
      </Avatar>
      <YStack flex={1}>
        <Paragraph fontWeight="bold">{user.username || 'Unknown User'}</Paragraph>
        {user.fullName && <Paragraph theme="alt2" size="$3">{user.fullName}</Paragraph>}
      </YStack>
      {onFollowToggle && ( // Only show button if callback is provided
        <Button
          size="$3"
          theme={isFollowing ? 'active' : undefined} // Use 'active' theme for unfollow? Or just change text?
          onPress={handleFollowToggle}
          disabled={isLoading}
          // Consider adding an icon based on follow state
        >
          {isLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      )}
    </XStack>
  );
};
