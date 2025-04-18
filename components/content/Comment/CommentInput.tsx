import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Input, Button, XStack, Spinner } from 'tamagui';
import { SupabaseContentRepository } from '@/repositories/SupabaseContentRepository';
import { useAuth } from '@/hooks/useAuth';
import { CreateCommentInput } from 'bikr-shared/types/post'; // Use path alias

// Instantiate repository (replace with DI or context later)
const contentRepository = new SupabaseContentRepository();

interface CommentInputProps {
  postId: string;
  onCommentAdded?: () => void; // Optional callback after successful post
}

export default function CommentInput({ postId, onCommentAdded }: CommentInputProps) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuth(); // Get the full session which includes the token

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    if (!session?.session?.access_token) {
      Alert.alert('Error', 'You must be logged in to comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const input: CreateCommentInput = {
        content: commentText,
        // parent_comment_id can be added later for replies
      };
      
      // Pass postId, input, and the access token
      await contentRepository.createComment(postId, input, session.session.access_token);

      setCommentText(''); // Clear input on success
      Alert.alert('Success', 'Comment posted!');
      onCommentAdded?.(); // Call the callback if provided

    } catch (error: any) {
      console.error('Failed to post comment:', error);
      Alert.alert('Error', error.message || 'Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <XStack space="$2" alignItems="center" padding="$2">
      <Input
        flex={1}
        placeholder="Add a comment..."
        value={commentText}
        onChangeText={setCommentText}
        disabled={isSubmitting}
      />
      <Button 
        theme="active" 
        onPress={handleSubmit} 
        disabled={isSubmitting || !commentText.trim()}
        icon={isSubmitting ? <Spinner size="small" /> : undefined}
      >
        {isSubmitting ? '' : 'Post'}
      </Button>
    </XStack>
  );
}
