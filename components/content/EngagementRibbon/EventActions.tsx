import React from 'react';
import { Button, YStack, Text } from 'tamagui';
import { EventActionsProps } from './EngagementRibbonTypes';

export default function EventActions({ 
  isAttending = false, 
  onRidingTherePress, 
  testID 
}: EventActionsProps) {
  return (
    <YStack space="$2" marginTop="$2" testID={testID}>
      <Button
        size="$3"
        backgroundColor={isAttending ? '$green9' : '$primary'}
        onPress={onRidingTherePress}
        justifyContent="center"
        alignItems="center"
      >
        <Text color="white" fontWeight="500">
          {isAttending ? 'You\'re Riding There! 🏍️' : 'Riding There? 🏍️'}
        </Text>
      </Button>
      
      {/* Additional event actions could be added here */}
      {/* For example: directions, calendar add, etc. */}
    </YStack>
  );
}
