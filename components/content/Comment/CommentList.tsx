import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { ScrollView, YStack, Text } from 'tamagui';
import { apiClient } from '../../../services/api';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';

interface CommentListProps {
  postId: string;
  initialComments?: any[];
  initialTotalCount?: number;
}

export const CommentList = ({
  postId,
  initialComments = [],
  initialTotalCount = 0,
}: CommentListProps) => {
  const [comments, setComments] = useState<any[]>(initialComments);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialComments.length < initialTotalCount);

  // Organize comments into top-level and replies
  const rootComments = comments.filter(c => !c.parentId);
  const repliesMap = comments.reduce((acc, comment) => {
    if (comment.parentId) {
      if (!acc[comment.parentId]) {
        acc[comment.parentId] = [];
      }
      acc[comment.parentId].push(comment);
    }
    return acc;
  }, {} as Record<string, any[]>);

  const loadComments = async (refresh = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const token = ''; // TODO: Get from auth context
      const offset = refresh ? 0 : comments.length;
      const limit = 20;
      
      const fetchedComments = await apiClient.content.getCommentsByPostId(
        postId,
        token,
        limit,
        offset
      );
      
      if (refresh) {
        setComments(fetchedComments);
      } else {
        setComments(prev => [...prev, ...fetchedComments]);
      }
      
      // Setting hasMore based on whether we got fewer results than asked for
      setHasMore(fetchedComments.length === limit);
      
      if (refresh) {
        setPage(1);
      } else {
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
      setError('Failed to load comments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialComments.length) {
      loadComments();
    }
  }, [postId]);

  const handleCommentAdded = (newComment: any) => {
    setComments(prev => [newComment, ...prev]);
    setTotalCount(prev => prev + 1);
  };

  const handleCommentDeleted = (commentId: string) => {
    // Remove the comment and its replies
    setComments(prev => prev.filter(c => c.id !== commentId && c.parentId !== commentId));
    setTotalCount(prev => prev - 1); // This is an approximation as we're not counting deleted replies
  };

  const handleCommentUpdated = (commentId: string, content: string) => {
    setComments(prev => 
      prev.map(c => 
        c.id === commentId ? { ...c, content, updatedAt: new Date().toISOString() } : c
      )
    );
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      loadComments();
    }
  };

  return (
    <YStack space="$3" padding="$3">
      <Text fontWeight="bold" fontSize="$5">
        Comments ({totalCount})
      </Text>
      
      <CommentInput 
        postId={postId}
        onCommentAdded={handleCommentAdded}
      />
      
      {/* Show error if any */}
      {error ? <Text color="$red10">{error}</Text> : null}
      
      {/* Display comments */}
      <ScrollView>
        <YStack space="$3">
          {rootComments.length === 0 && !isLoading ? (
            <Text color="$gray11">No comments yet. Be the first to comment!</Text>
          ) : (
            rootComments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={repliesMap[comment.id] || []}
                postId={postId}
                onDelete={handleCommentDeleted}
                onUpdate={handleCommentUpdated}
              />
            ))
          )}
          
          {/* Load more button */}
          {hasMore && !isLoading && (
            <Text 
              onPress={handleLoadMore} 
              color="$blue10"
              textAlign="center"
              padding="$2"
            >
              Load more comments
            </Text>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <ActivityIndicator style={{ marginVertical: 16 }} />
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
};
