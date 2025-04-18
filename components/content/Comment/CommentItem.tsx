// Placeholder for CommentItem component
import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Comment } from 'bikr-shared/types/post'; // Use path alias
import { YStack, XStack, Button, Paragraph } from 'tamagui';
import { formatDistanceToNowStrict } from 'date-fns'; // For timestamp formatting

interface CommentItemProps {
  comment: Comment;
  // Add other props like onLike, onReply, onDelete, onEdit etc.
  // onLike: (commentId: string) => void; 
  // onReply: (commentId: string) => void;
}

export default function CommentItem({ comment }: CommentItemProps) {
  // Format timestamp (using createdAt)
  const timeAgo = comment.createdAt 
    ? formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true }) 
    : '';

  return (
    <YStack space="$2" padding="$3" borderBottomWidth={1} borderColor="$borderColor">
      <XStack space="$2" alignItems="center">
        {/* TODO: Add author avatar */}
        {/* Use Tamagui style props for fontWeight */}
        <ThemedText fow="bold">{comment.author?.username || 'Unknown User'}</ThemedText> 
        {/* Use Tamagui style props for fontSize */}
        <ThemedText fos="$2" color="$gray10">{timeAgo}</ThemedText> 
      </XStack>
      
      <Paragraph>{comment.content}</Paragraph>

      <XStack space="$3" marginTop="$2">
        <Button size="$2" chromeless /* onPress={() => onLike(comment.id)} */>
          {/* Use likeCount */}
          Like ({comment.likeCount || 0}) 
        </Button>
        <Button size="$2" chromeless /* onPress={() => onReply(comment.id)} */>
          Reply
        </Button>
        {/* Add Edit/Delete buttons conditionally based on ownership */}
      </XStack>
    </YStack>
  );
}
