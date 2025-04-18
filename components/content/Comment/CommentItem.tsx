import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Comment } from '../../../../bikr-shared/src/types/post'; // Corrected path again
import { formatDistanceToNowStrict } from 'date-fns'; // For relative time

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string; // To check if the current user is the author
  onLike: (commentId: string) => Promise<void>;
  onUnlike: (commentId: string) => Promise<void>;
  onReply: (comment: Comment) => void; // Pass the comment to potentially prefill reply input
  onEdit: (comment: Comment) => void; // Pass the comment to potentially prefill edit input
  onDelete: (commentId: string) => Promise<void>;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onLike,
  onUnlike,
  onReply,
  onEdit,
  onDelete,
}) => {
  const isAuthor = comment.userId === currentUserId;

  const handleLikeToggle = async () => {
    try {
      if (comment.isLikedByUser) {
        await onUnlike(comment.id);
      } else {
        await onLike(comment.id);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      Alert.alert("Error", "Could not update like status.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await onDelete(comment.id);
            } catch (error) {
              console.error("Failed to delete comment:", error);
              Alert.alert("Error", "Could not delete comment.");
            }
          },
        },
      ]
    );
  };

  const formattedDate = comment.createdAt
    ? formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true })
    : 'just now'; // Fallback

  return (
    <ThemedView style={styles.container}>
      <Image
        source={{ uri: comment.author?.avatarUrl || 'https://via.placeholder.com/40' }} // Placeholder avatar
        style={styles.avatar}
      />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <ThemedText style={styles.authorName} type="subtitle">
            {comment.author?.displayName || comment.author?.username || 'Anonymous'}
          </ThemedText>
          {/* Removed invalid type="caption" prop */}
          <ThemedText style={styles.timestamp}>
            {formattedDate}
          </ThemedText>
        </View>
        <ThemedText style={styles.commentText}>{comment.content}</ThemedText>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleLikeToggle} style={styles.actionButton}>
            <ThemedText style={styles.actionText}>
              {comment.isLikedByUser ? 'Unlike' : 'Like'} ({comment.likeCount || 0})
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onReply(comment)} style={styles.actionButton}>
            <ThemedText style={styles.actionText}>Reply</ThemedText>
          </TouchableOpacity>
          {isAuthor && (
            <>
              <TouchableOpacity onPress={() => onEdit(comment)} style={styles.actionButton}>
                <ThemedText style={styles.actionText}>Edit</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                <ThemedText style={[styles.actionText, styles.deleteText]}>Delete</ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Example border color
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  authorName: {
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#888', // Example color
    fontSize: 12,
  },
  commentText: {
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    marginRight: 15,
  },
  actionText: {
    fontSize: 12,
    color: '#555', // Example color
  },
  deleteText: {
    color: 'red', // Example color
  },
});

export default CommentItem;
