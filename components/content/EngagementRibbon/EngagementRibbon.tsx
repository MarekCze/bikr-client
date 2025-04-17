import React from 'react';
import { XStack, Stack } from 'tamagui';
import { EngagementRibbonProps } from './EngagementRibbonTypes';
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import ShareButton from './ShareButton';
import BookmarkButton from './BookmarkButton';
import EventActions from './EventActions';

export default function EngagementRibbon({
  postId,
  likeCount,
  commentCount,
  bookmarkCount,
  isLiked,
  isBookmarked,
  isEvent,
  isAttending,
  onLikePress,
  onCommentPress,
  onSharePress,
  onBookmarkPress,
  onRidingTherePress,
}: EngagementRibbonProps) {
  return (
    <Stack space="$2">
      <XStack justifyContent="space-between" alignItems="center">
        <XStack space="$4">
          <LikeButton 
            count={likeCount} 
            isActive={isLiked} 
            onPress={onLikePress} 
          />
          <CommentButton 
            count={commentCount} 
            onPress={onCommentPress} 
          />
          <ShareButton 
            onPress={onSharePress} 
          />
        </XStack>
        
        <BookmarkButton 
          isActive={isBookmarked} 
          onPress={onBookmarkPress}
        />
      </XStack>
      
      {/* Conditional event-specific actions */}
      {isEvent && (
        <EventActions
          isAttending={isAttending}
          onRidingTherePress={onRidingTherePress}
          testID="event-actions"
        />
      )}
    </Stack>
  );
}
