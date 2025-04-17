import React from 'react';
import { Stack, YStack } from 'tamagui';
import { MediaCardProps } from './MediaCardTypes';
import TextPostCard from './TextPostCard';
import ImageGalleryCard from './ImageGalleryCard';
import VideoPlayerCard from './VideoPlayerCard';
import PollCard from './PollCard';
import ContextBadge from './ContextBadge';
import { OwnerRibbon } from '../OwnerRibbon';
import { EngagementRibbon } from '../EngagementRibbon';

export default function MediaCard({
  post,
  onPress,
  onLongPress,
  showEngagementRibbon = true,
  showOwnerRibbon = true,
  testID,
}: MediaCardProps) {
  // Helper function to determine the content based on post type
  const renderContent = () => {
    // Check if post has poll options
    if (post.poll_options && post.poll_options.length > 0) {
      return (
        <PollCard
          question={post.content || ''}
          options={post.poll_options}
          userVotedOptionId={post.user_interaction?.voted_option_id || null}
        />
      );
    }
    
    // Check if post has media
    if (post.media && post.media.length > 0) {
      // If it's a video post (single media item of type video)
      if (post.media.length === 1 && post.media[0].type === 'video') {
        return <VideoPlayerCard media={post.media[0]} />;
      }
      
      // Otherwise, render as image gallery
      return <ImageGalleryCard media={post.media} />;
    }
    
    // Default to text post
    return <TextPostCard content={post.content || ''} />;
  };

  return (
    <Stack 
      testID={testID}
      padding="$4" 
      marginVertical="$2"
      borderRadius="$4"
      backgroundColor="$backgroundStrong"
      pressable={!!onPress}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <YStack space="$4">
        {/* Context Badge if applicable */}
        {post.context_type && post.context_type !== 'None' && (
          <ContextBadge 
            type={post.context_type as any} 
            contextId={post.context_id || undefined} 
          />
        )}
        
        {/* Owner information */}
        {showOwnerRibbon && (
          <OwnerRibbon
            userId={post.user_id}
            username={post.author?.username}
            displayName={post.author?.display_name}
            avatarUrl={post.author?.avatar_url}
            postDate={post.created_at}
            isEdited={post.created_at !== post.updated_at}
          />
        )}
        
        {/* Post content */}
        {renderContent()}
        
        {/* Engagement actions */}
        {showEngagementRibbon && (
          <EngagementRibbon
            postId={post.id}
            likeCount={post.like_count}
            commentCount={post.comment_count}
            bookmarkCount={post.bookmark_count}
            isLiked={post.user_interaction?.is_liked || false}
            isBookmarked={post.user_interaction?.is_bookmarked || false}
            isEvent={post.context_type === 'Event'}
          />
        )}
      </YStack>
    </Stack>
  );
}
