import React from 'react';
import { XStack, Text, Button } from 'tamagui';
import { LikeButtonProps } from './EngagementRibbonTypes';

export default function LikeButton({ count = 0, isActive = false, onPress, testID }: LikeButtonProps) {
  return (
    <Button
      backgroundColor="transparent"
      padding="$0"
      alignItems="center"
      onPress={onPress}
      testID={testID}
    >
      <XStack space="$1" alignItems="center">
        {/* In a real app, use a proper icon component */}
        <Text color={isActive ? '$primary' : '$gray11'}>❤️</Text>
        <Text fontSize="$2" color={isActive ? '$primary' : '$gray11'}>
          {count > 0 ? count.toString() : 'Like'}
        </Text>
      </XStack>
    </Button>
  );
}
