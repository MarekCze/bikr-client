import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface CommentInputProps {
  postId: string; // The ID of the post being commented on
  parentId?: string; // Optional: The ID of the parent comment if this is a reply
  onSubmit: (commentText: string) => Promise<void>; // Function to call when submitting
  placeholder?: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  postId,
  parentId,
  onSubmit,
  placeholder = "Add a comment...",
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      Alert.alert("Error", "Comment cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(commentText);
      setCommentText(''); // Clear input on successful submission
    } catch (error) {
      console.error("Failed to submit comment:", error);
      Alert.alert("Error", "Could not submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={commentText}
        onChangeText={setCommentText}
        multiline
        // Add theme-aware styling if needed
        placeholderTextColor="#999" // Example placeholder color
      />
      <Button
        title={isSubmitting ? "Submitting..." : "Submit"}
        onPress={handleSubmit}
        disabled={isSubmitting || !commentText.trim()}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee', // Example border color
    // Add theme-aware background color if needed
  },
  input: {
    flex: 1,
    borderColor: '#ccc', // Example border color
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100, // Limit height for multiline
    // Add theme-aware text color, background color, border color
  },
});

// Export the component for use
export default CommentInput;
