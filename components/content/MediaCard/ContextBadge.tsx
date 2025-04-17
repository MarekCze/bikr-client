import React from 'react';
import { XStack, Text, Stack } from 'tamagui';
import { ContextBadgeProps } from './MediaCardTypes';
import { PostContextType } from '../../../../shared/src/types/post';

export default function ContextBadge({ type, contextId, name, onPress }: ContextBadgeProps) {
  // Get context specific styling and icon
  const getContextDetails = (type: PostContextType) => {
    switch (type) {
      case 'Club':
        return {
          color: '$blue9',
          backgroundColor: '$blue2',
          label: name || 'Club'
        };
      case 'Event':
        return {
          color: '$green9',
          backgroundColor: '$green2',
          label: name || 'Event'
        };
      case 'Marketplace':
        return {
          color: '$orange9',
          backgroundColor: '$orange2',
          label: name || 'Marketplace'
        };
      default:
        return {
          color: '$gray9',
          backgroundColor: '$gray2',
          label: name || 'General'
        };
    }
  };
  
  const { color, backgroundColor, label } = getContextDetails(type);
  
  return (
    <XStack 
      backgroundColor={backgroundColor}
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$1"
      alignSelf="flex-start"
      {...(onPress ? { onPress } : {})}
    >
      {/* Would add an icon here in a real implementation */}
      <Text color={color} fontSize="$2" fontWeight="500">
        {label}
      </Text>
    </XStack>
  );
}
