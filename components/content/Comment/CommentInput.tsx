import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Input, YStack } from 'tamagui';
import { apiClient } from '../../../services/api';

interface CommentInputProps {
  postId: string;
  parentId?: string;
  onCommentAdded?: (comment: any) => void;
}

export const CommentInput = ({ postId, parentId, onCommentAdded }: CommentInputProps) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const token = ''; // TODO: Get token from auth context
      const newComment = await apiClient.content.createComment(postId, {
        content: comment,
        parentId,
      }, token);
      
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
      
      setComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <YStack space="$2" padding="$2">
      <Input
        placeholder="Add a comment..."
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <Button 
        onPress={handleSubmit} 
        disabled={!comment.trim() || isSubmitting}
        themeInverse
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </Button>
    </YStack>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
  button: {
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
