import React from 'react';
import { XStack, Text, View } from 'tamagui';
import { RiderStatusProps } from './OwnerRibbonTypes';

export default function RiderStatus({ isRiding, testID }: RiderStatusProps) {
  return (
    <XStack
      backgroundColor={isRiding ? '$green2' : '$gray2'}
      borderRadius="$1"
      paddingHorizontal="$1"
      paddingVertical="$0.5"
      alignItems="center"
      space="$1"
      testID={testID}
    >
      {/* Status indicator dot */}
      <View
        width={6}
        height={6}
        borderRadius={3}
        backgroundColor={isRiding ? '$green9' : '$gray9'}
      />
      
      <Text
        fontSize="$1"
        color={isRiding ? '$green9' : '$gray9'}
        fontWeight="500"
      >
        {isRiding ? 'Currently Riding' : 'Not Riding'}
      </Text>
    </XStack>
  );
}
