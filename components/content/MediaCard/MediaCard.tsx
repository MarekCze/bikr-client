import React, { useState, useCallback } from 'react'; // Add useState, useCallback
import { Stack, YStack, Spinner, Paragraph } from 'tamagui'; // Add Spinner, Paragraph
import { MediaCardProps } from './MediaCardTypes';
import { Comment } from 'bikr-shared/types/post'; // Import Comment type
import { SupabaseContentRepository } from '@/repositories/SupabaseContentRepository'; // Import repository
import { useAuth } from '@/hooks/useAuth'; // Import auth hook
import TextPostCard from './TextPostCard';
import ImageGalleryCard from './ImageGalleryCard';
import VideoPlayerCard from './VideoPlayerCard';
import PollCard from './PollCard';
import ContextBadge from './ContextBadge';
import { OwnerRibbon } from '../OwnerRibbon';
import { EngagementRibbon } from '../EngagementRibbon';
import { CommentList, CommentInput } from '../Comment'; // Import comment components

export default function MediaCard({
  post,
  onPress,
  onLongPress,
  showEngagementRibbon = true,
  showOwnerRibbon = true,
  testID,
}: MediaCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const { session } = useAuth(); // Get auth session for token

  // Instantiate repository (consider moving to context/DI later)
  const contentRepository = new SupabaseContentRepository();

  // Function to fetch comments
  const fetchComments = useCallback(async () => {
    if (!post.id) return; // Need post ID

    setIsLoadingComments(true);
    setCommentError(null);
    try {
      // Pass token if available (optional for GET comments based on server route)
      const fetchedComments = await contentRepository.getCommentsByPostId(
        post.id, 
        undefined, // limit
        undefined, // offset 
        session?.session?.access_token // Pass token
      );
      setComments(fetchedComments || []); // Ensure it's an array
    } catch (err: any) {
      console.error("Error fetching comments:", err);
      setCommentError(err.message || 'Failed to load comments.');
    } finally {
      setIsLoadingComments(false);
    }
  }, [post.id, session?.session?.access_token]); // Dependencies

  // Handler for pressing the comment button
  const handleCommentPress = () => {
    const newState = !showComments;
    setShowComments(newState);
    // Fetch comments only when opening and if they haven't been fetched yet
    if (newState && comments.length === 0) {
      fetchComments();
    }
  };

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
      // Remove the 'pressable' prop; onPress should handle it
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
            // Use camelCase props based on likely type definition
            likeCount={post.likeCount} 
            commentCount={post.commentCount} 
            bookmarkCount={post.bookmarkCount} 
            isLiked={post.userInteraction?.isLiked || false} 
            isBookmarked={post.userInteraction?.isBookmarked || false} 
            isEvent={post.contextType === 'Event'}
            // Pass the handler
            onCommentPress={handleCommentPress} 
          />
        )}

        {/* Conditionally render comments section */}
        {showComments && (
          <YStack marginTop="$3" space="$2">
            {isLoadingComments && <Spinner />}
            {commentError && <Paragraph color="$red10">{commentError}</Paragraph>}
            {!isLoadingComments && !commentError && (
              <>
                <CommentInput postId={post.id} onCommentAdded={fetchComments} />
                <CommentList comments={comments} />
              </>
            )}
          </YStack>
        )}
      </YStack>
    </Stack>
  );
}
