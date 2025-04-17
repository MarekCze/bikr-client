import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Input, Text, XStack, YStack, Avatar } from 'tamagui';
import { apiClient } from '../../../services/api';
import { CommentInput } from './CommentInput';
import { timeSince } from '../../../utils/date';

interface Author {
  id: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
}

interface CommentData {
  id: string;
  postId: string;
  userId: string;
  parentId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLikedByUser: boolean;
  author?: Author;
}

interface CommentItemProps {
  comment: CommentData;
  replies: CommentData[];
  postId: string;
  level?: number;
  onDelete?: (commentId: string) => void;
  onUpdate?: (commentId: string, content: string) => void;
  onReplyAdded?: (reply: CommentData) => void;
}

export const CommentItem = ({ 
  comment, 
  replies, 
  postId, 
  level = 0,
  onDelete,
  onUpdate,
  onReplyAdded 
}: CommentItemProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [visibleReplies, setVisibleReplies] = useState<CommentData[]>([]);
  const [showAllReplies, setShowAllReplies] = useState(false);
  
  // Mock for now - in reality, check against current user
  const isAuthor = true;
  
  const handleReply = () => {
    setShowReplyInput(!showReplyInput);
  };

  const handleShowReplies = () => {
    if (showAllReplies) {
      setVisibleReplies([]);
    } else {
      setVisibleReplies(replies);
    }
    setShowAllReplies(!showAllReplies);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const token = ''; // TODO: Get from auth context
      const updatedComment = await apiClient.content.updateComment(
        comment.id, 
        editedContent, 
        token
      );
      
      setIsEditing(false);
      
      if (onUpdate) {
        onUpdate(comment.id, editedContent);
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
      // TODO: Show error toast
    }
  };

  const handleDelete = async () => {
    try {
      const token = ''; // TODO: Get from auth context
      await apiClient.content.deleteComment(comment.id, token);
      
      if (onDelete) {
        onDelete(comment.id);
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      // TODO: Show error toast
    }
  };

  const handleLike = async () => {
    try {
      const token = ''; // TODO: Get from auth context
      
      if (comment.isLikedByUser) {
        await apiClient.content.unlikeComment(comment.id, token);
      } else {
        await apiClient.content.likeComment(comment.id, token);
      }
      
      // TODO: Update UI to reflect like status change
    } catch (error) {
      console.error('Failed to like/unlike comment:', error);
    }
  };

  const handleReplyAdded = (newReply: CommentData) => {
    if (onReplyAdded) {
      onReplyAdded(newReply);
    }
    
    setVisibleReplies(prev => [newReply, ...prev]);
    setShowReplyInput(false);
    setShowAllReplies(true);
  };

  return (
    <YStack 
      space="$2" 
      padding="$2" 
      marginLeft={level * 16}
      borderLeftWidth={level > 0 ? 1 : 0}
      borderLeftColor="$borderColor"
    >
      <XStack space="$2" alignItems="center">
        {comment.author?.avatarUrl && (
          <Avatar circular size="$2">
            <Avatar.Image src={comment.author.avatarUrl} />
            <Avatar.Fallback backgroundColor="$gray5" />
          </Avatar>
        )}
        <Text fontWeight="bold">{comment.author?.displayName || 'User'}</Text>
        <Text color="$gray10" fontSize="$1">{timeSince ? timeSince(new Date(comment.createdAt)) : comment.createdAt}</Text>
      </XStack>
      
      {isEditing ? (
        <YStack space="$2">
          <Input 
            value={editedContent}
            onChangeText={setEditedContent}
            multiline
          />
          <XStack space="$2">
            <Button size="$2" onPress={() => setIsEditing(false)}>Cancel</Button>
            <Button size="$2" onPress={handleUpdate} themeInverse>Save</Button>
          </XStack>
        </YStack>
      ) : (
        <Text>{comment.content}</Text>
      )}
      
      <XStack space="$4" alignItems="center">
        <Button 
          size="$2" 
          onPress={handleLike}
          chromeless
        >
          {comment.isLikedByUser ? '❤️' : '🤍'} {comment.likeCount > 0 ? comment.likeCount : ''}
        </Button>
        
        <Button size="$2" onPress={handleReply} chromeless>Reply</Button>
        
        {isAuthor && (
          <>
            <Button size="$2" onPress={handleEdit} chromeless>Edit</Button>
            <Button size="$2" onPress={handleDelete} chromeless theme="red">Delete</Button>
          </>
        )}
      </XStack>
      
      {showReplyInput && (
        <CommentInput 
          postId={postId} 
          parentId={comment.id}
          onCommentAdded={handleReplyAdded}
        />
      )}
      
      {replies.length > 0 && (
        <Button size="$2" onPress={handleShowReplies} chromeless>
          {showAllReplies ? 'Hide replies' : `Show ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
        </Button>
      )}
      
      {visibleReplies.map(reply => (
        <CommentItem 
          key={reply.id}
          comment={reply}
          replies={[]} // No nested replies beyond level 2 for simplicity
          postId={postId}
          level={level + 1}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </YStack>
  );
};
