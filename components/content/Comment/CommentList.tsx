import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Comment } from '../../../../bikr-shared/src/types/post'; // Adjust path as needed
import CommentItem from './CommentItem';
import { IContentRepository } from '@/repositories/IContentRepository'; // Assuming path
import { useAuth } from '@/hooks/useAuth'; // Assuming path

interface CommentListProps {
  postId: string;
  contentRepository: IContentRepository; // Pass repository instance
  // Add props for handling reply/edit actions if needed at this level
  onStartReply: (comment: Comment) => void;
  onStartEdit: (comment: Comment) => void;
}

export const CommentList: React.FC<CommentListProps> = ({
  postId,
  contentRepository,
  onStartReply,
  onStartEdit,
}) => {
  const { user, session } = useAuth(); // Get current user and session
  const token = session?.session?.access_token; // Correct path to token
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  // TODO: Add state for pagination (offset, hasMore)

  const fetchComments = useCallback(async (isRefreshing = false) => {
    if (!isRefreshing) {
      setIsLoading(true);
    }
    setError(null);
    try {
      // TODO: Implement pagination (limit, offset) - Repo method doesn't take token
      const fetchedComments = await contentRepository.getCommentsByPostId(postId, undefined, undefined);
      setComments(fetchedComments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError("Could not load comments. Please try again.");
      Alert.alert("Error", "Could not load comments.");
    } finally {
      setIsLoading(false);
      if (isRefreshing) {
        setRefreshing(false);
      }
    }
  }, [postId, contentRepository, token]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchComments(true);
  }, [fetchComments]);

  // --- Action Handlers ---
  // These will call the repository methods and update the state optimistically or after refresh

  const handleLike = async (commentId: string) => {
    // Optimistic update (optional)
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, isLikedByUser: true, likeCount: (c.likeCount || 0) + 1 } : c
      ));
    try {
      if (!token) {
        Alert.alert("Error", "You must be logged in to like comments.");
        throw new Error("User not authenticated");
      }
      // Pass token as required by interface
      await contentRepository.likeComment(commentId, token);
      // Optionally re-fetch for consistency, or rely on optimistic update
    } catch (err) {
      console.error("Failed to like comment:", err);
      Alert.alert("Error", "Failed to like comment.");
      // Revert optimistic update
      setComments(prev => prev.map(c =>
        c.id === commentId ? { ...c, isLikedByUser: false, likeCount: (c.likeCount || 1) - 1 } : c
      ));
    }
  };

  const handleUnlike = async (commentId: string) => {
    if (!token) {
      Alert.alert("Error", "You must be logged in to unlike comments.");
      return;
    }
    // Optimistic update (optional)
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, isLikedByUser: false, likeCount: (c.likeCount || 1) - 1 } : c
    ));
    try {
      // Pass token as required by interface
      await contentRepository.unlikeComment(commentId, token);
    } catch (err) {
      console.error("Failed to unlike comment:", err);
      Alert.alert("Error", "Failed to unlike comment.");
      // Revert optimistic update
      setComments(prev => prev.map(c =>
        c.id === commentId ? { ...c, isLikedByUser: true, likeCount: (c.likeCount || 0) + 1 } : c
      ));
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!token) {
      Alert.alert("Error", "You must be logged in to delete comments.");
      return;
    }
    // Optimistic update
    const originalComments = comments;
    setComments(prev => prev.filter(c => c.id !== commentId));
    try {
      // Pass token as required by interface
      await contentRepository.deleteComment(commentId, token);
    } catch (err) {
      console.error("Failed to delete comment:", err);
      Alert.alert("Error", "Failed to delete comment.");
      // Revert optimistic update
      setComments(originalComments);
    }
  };

  // --- Render ---

  if (isLoading && comments.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="defaultSemiBold">{error}</ThemedText>
        {/* Add a retry button? */}
      </ThemedView>
    );
  }

  if (comments.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>No comments yet. Be the first!</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CommentItem
          comment={item}
          currentUserId={user?.id}
          onLike={handleLike}
          onUnlike={handleUnlike}
          onReply={onStartReply} // Pass down from props
          onEdit={onStartEdit}   // Pass down from props
          onDelete={handleDelete}
        />
      )}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      // TODO: Add onEndReached for pagination/infinite scroll
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    flex: 1,
  },
});

export default CommentList;
