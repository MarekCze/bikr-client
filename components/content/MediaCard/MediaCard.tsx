import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native'; // Import Alert from react-native
import { Stack, YStack, Spinner, Paragraph } from 'tamagui';
import * as Sharing from 'expo-sharing'; // Import expo-sharing
import { MediaCardProps } from './MediaCardTypes';
import { Comment, CreateCommentInput } from '../../../../bikr-shared/src/types/post'; // Corrected path and added CreateCommentInput
import { SupabaseContentRepository } from '@/repositories/SupabaseContentRepository';
import { IContentRepository } from '@/repositories/IContentRepository'; // Import interface
import { useAuth } from '@/hooks/useAuth';
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
  const { session } = useAuth();
  const token = session?.session?.access_token;

  // Instantiate repository (consider moving to context/DI later)
  // Use interface type for better practice
  const contentRepository: IContentRepository = new SupabaseContentRepository();

  // Function to fetch comments
  const fetchComments = useCallback(async () => {
    if (!post.id) return; // Need post ID

    setIsLoadingComments(true);
    setCommentError(null);
    try {
      // Repo method doesn't take token
      const fetchedComments = await contentRepository.getCommentsByPostId(
        post.id,
        undefined, // limit
        undefined // offset
      );
      setComments(fetchedComments || []);
    } catch (err: any) {
      console.error("Error fetching comments:", err);
      setCommentError(err.message || 'Failed to load comments.');
    } finally {
      setIsLoadingComments(false);
    }
  }, [post.id, contentRepository]); // Removed token dependency

  // Handler for pressing the comment button
  const handleCommentPress = () => {
    const newState = !showComments;
    setShowComments(newState);
    // Fetch comments only when opening and if they haven't been fetched yet
    if (newState && comments.length === 0) {
      fetchComments();
    }
  };

  // Handler for submitting a new comment
  const handleCommentSubmit = async (commentText: string) => {
    if (!token) {
      Alert.alert("Error", "You must be logged in to comment.");
      throw new Error("User not authenticated"); // Throw error to stop CommentInput processing
    }
    if (!post.id) {
      Alert.alert("Error", "Cannot determine which post to comment on.");
      throw new Error("Post ID is missing");
    }

    const commentInput: CreateCommentInput = {
      content: commentText,
      // parentId: null, // Add logic for replies later
    };

    try {
      // Pass token as required by interface
      await contentRepository.createComment(post.id, commentInput, token);
      // Refresh comments after successful submission
      fetchComments();
    } catch (error: any) {
      console.error("Failed to submit comment:", error);
      Alert.alert("Error", `Failed to submit comment: ${error.message}`);
      throw error; // Re-throw to let CommentInput know submission failed
    }
  };

  // Placeholder handlers for reply/edit actions
  const handleStartReply = (comment: Comment) => {
    console.log("Replying to comment:", comment.id);
    // TODO: Implement reply UI logic (e.g., focus input, set parentId state)
    Alert.alert("Reply", `Replying to comment by ${comment.author?.displayName || 'user'}`);
  };

  const handleStartEdit = (comment: Comment) => {
    console.log("Editing comment:", comment.id);
    // TODO: Implement edit UI logic (e.g., show edit input with comment content)
    Alert.alert("Edit", `Editing comment: ${comment.content}`);
  };

  // Handler for pressing the share button
  const handleSharePress = async () => {
    // TODO: Replace with actual deep link once post screen is created
    const shareUrl = `https://bikr.app/post/${post.id}`; // Placeholder URL
    const shareMessage = `Check out this post on Bikr: ${post.content?.substring(0, 50) || ''}...`; // Placeholder message

    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing not available", "Sharing is not available on this device.");
        return;
      }
      await Sharing.shareAsync(shareUrl, {
        dialogTitle: 'Share this post', // iOS only
        mimeType: 'text/plain', // Optional: Specify mime type
        // UTI: 'public.url', // Optional: iOS Uniform Type Identifier
      });
      // You could add tracking here if needed
    } catch (error: any) {
      console.error("Error sharing post:", error);
      Alert.alert("Error", `Could not share post: ${error.message}`);
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
            // Use correct camelCase props from DetailedPost type
            likeCount={post.like_count || 0}
            commentCount={post.comment_count || 0}
            bookmarkCount={post.bookmark_count || 0} // Assuming bookmark_count exists
            isLiked={post.user_interaction?.is_liked || false}
            isBookmarked={post.user_interaction?.is_bookmarked || false}
            isEvent={post.context_type === 'Event'} // Use snake_case from DB/RPC
            // Pass the handlers
            onCommentPress={handleCommentPress}
            onSharePress={handleSharePress} // Pass share handler
            // TODO: Pass other handlers (onLikePress, onBookmarkPress etc.) if needed
          />
        )}

        {/* Conditionally render comments section */}
        {showComments && (
          <YStack marginTop="$3" space="$2">
            {isLoadingComments && <Spinner size="large" />}
            {commentError && <Paragraph color="$red10">{commentError}</Paragraph>}
            {!isLoadingComments && !commentError && (
              <YStack space="$3">
                {/* Pass onSubmit handler */}
                <CommentInput postId={post.id} onSubmit={handleCommentSubmit} />
                {/* Pass required props */}
                <CommentList
                  postId={post.id}
                  contentRepository={contentRepository}
                  onStartReply={handleStartReply}
                  onStartEdit={handleStartEdit}
                  // Note: CommentList fetches its own comments internally now
                />
              </YStack>
            )}
          </YStack>
        )}
      </YStack>
    </Stack>
  );
}
