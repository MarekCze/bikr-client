import React from 'react';
import { XStack, Text, Button } from 'tamagui';
import { ShareButtonProps } from './EngagementRibbonTypes';

export default function ShareButton({ onPress, testID }: ShareButtonProps) {
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
        <Text color="$gray11">🔄</Text>
        <Text fontSize="$2" color="$gray11">
          Share
        </Text>
      </XStack>
    </Button>
  );
}
