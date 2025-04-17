import React from 'react';
import { Text, Stack } from 'tamagui';
import { PostMetadataProps } from './OwnerRibbonTypes';

export default function PostMetadata({ postDate, isEdited = false, testID }: PostMetadataProps) {
  // Format the date in a relative way (would use date-fns in a real app)
  const getRelativeTime = (dateString: string) => {
    // Simple implementation - in a real app, use a library like date-fns
    try {
      const postDateTime = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - postDateTime.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return postDateTime.toLocaleDateString();
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  const formattedDate = getRelativeTime(postDate);
  
  return (
    <Stack testID={testID}>
      <Text fontSize="$2" color="$gray11">
        {formattedDate} {isEdited && '(edited)'}
      </Text>
    </Stack>
  );
}
