import React from 'react';
import { Text, YStack } from 'tamagui';
import { TextPostCardProps } from './MediaCardTypes';

export default function TextPostCard({ content, onPress }: TextPostCardProps) {
  return (
    <YStack 
      space="$2" 
      onPress={onPress} 
      pressStyle={{ opacity: 0.8 }}
      aria-label="Text post content"
    >
      <Text>{content}</Text>
    </YStack>
  );
}
