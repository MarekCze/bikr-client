import React from 'react';
import { Stack, Paragraph, H2, YStack } from 'tamagui'; // Import YStack
import { useLocalSearchParams } from 'expo-router';
// Remove ThemedView import if no longer needed, or keep if used elsewhere

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

  // TODO: Fetch the actual post data using the postId
  // For now, just display the ID

  return (
    // Use YStack for layout and padding
    <YStack flex={1} padding="$4" backgroundColor="$background"> 
      <Stack space="$4">
        <H2>Post Detail</H2>
        <Paragraph>Post ID: {postId}</Paragraph>
        {/* Add loading indicator while fetching */}
        {/* Display post content once fetched */}
        {/* Consider using MediaCard here eventually */}
      </Stack>
    </YStack>
  );
}
