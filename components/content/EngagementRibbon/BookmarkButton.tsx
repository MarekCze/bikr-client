import React from 'react';
import { Text, Button } from 'tamagui';
import { BookmarkButtonProps } from './EngagementRibbonTypes';

export default function BookmarkButton({ isActive = false, onPress, testID }: BookmarkButtonProps) {
  return (
    <Button
      backgroundColor="transparent"
      padding="$0"
      alignItems="center"
      onPress={onPress}
      testID={testID}
    >
      {/* In a real app, use a proper icon component */}
      <Text color={isActive ? '$primary' : '$gray11'} fontSize="$4">
        {isActive ? '🔖' : '🔖'}
      </Text>
    </Button>
  );
}
