import React from 'react';
import { XStack, Button, Text } from 'tamagui';
import { UserActionsProps } from './OwnerRibbonTypes';

export default function UserActions({ 
  userId, 
  isFollowed, 
  onFollowPress, 
  onMorePress,
  testID
}: UserActionsProps) {
  return (
    <XStack space="$2" alignItems="center" testID={testID}>
      {/* Follow/Unfollow Button */}
      <Button
        size="$2"
        backgroundColor={isFollowed ? 'transparent' : '$primary'}
        borderColor={isFollowed ? '$gray8' : undefined}
        borderWidth={isFollowed ? 1 : 0}
        color={isFollowed ? '$gray11' : 'white'}
        onPress={onFollowPress}
      >
        <Text fontSize="$2">
          {isFollowed ? 'Following' : 'Follow'}
        </Text>
      </Button>
      
      {/* More Options Button */}
      <Button
        size="$2"
        backgroundColor="transparent"
        padding="$0"
        onPress={onMorePress}
      >
        <Text fontSize="$4" color="$gray11">⋯</Text>
      </Button>
    </XStack>
  );
}
