import React from 'react';
import { XStack, Stack } from 'tamagui';
import { OwnerRibbonProps } from './OwnerRibbonTypes';
import UserInfo from './UserInfo';
import PostMetadata from './PostMetadata';
import UserActions from './UserActions';
import RiderStatus from './RiderStatus';

export default function OwnerRibbon({
  userId,
  username,
  displayName,
  avatarUrl,
  isVerified,
  postDate,
  isEdited,
  isCurrentlyRiding,
  isFollowed,
  onProfilePress,
  onFollowPress,
  onMorePress,
}: OwnerRibbonProps) {
  return (
    <Stack>
      <XStack justifyContent="space-between" alignItems="center">
        <XStack space="$2" alignItems="center">
          <UserInfo
            userId={userId}
            username={username}
            displayName={displayName}
            avatarUrl={avatarUrl}
            isVerified={isVerified}
            onPress={onProfilePress}
          />
          
          {isCurrentlyRiding && (
            <RiderStatus isRiding={true} />
          )}
        </XStack>
        
        <XStack space="$2" alignItems="center">
          <PostMetadata
            postDate={postDate}
            isEdited={isEdited}
          />
          
          <UserActions
            userId={userId}
            isFollowed={isFollowed || false}
            onFollowPress={onFollowPress}
            onMorePress={onMorePress}
          />
        </XStack>
      </XStack>
    </Stack>
  );
}
