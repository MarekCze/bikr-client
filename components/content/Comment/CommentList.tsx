// Placeholder for CommentList component
import React from 'react';
import { View, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import CommentItem from './CommentItem';
import { Comment } from 'bikr-shared/types/post'; // Use path alias

interface CommentListProps {
  comments: Comment[];
  // Add props for loading state, error handling, fetching more, etc.
}

export default function CommentList({ comments }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <View>
        <ThemedText>No comments yet.</ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CommentItem comment={item} />}
      // Add props for ListHeaderComponent (e.g., CommentInput), ListFooterComponent (loading indicator), onEndReached, etc.
    />
  );
}
