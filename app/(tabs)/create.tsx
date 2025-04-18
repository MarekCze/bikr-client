import React, { useState } from 'react';
import { Button, Input, Paragraph, ScrollView, Separator, TextArea, XStack, YStack } from 'tamagui';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'tamagui'; // Import Image for preview
import { SupabaseContentRepository } from '@/repositories/SupabaseContentRepository'; // Import repository
import { CreatePostInput } from '../../../shared/src/types/post'; // Assuming type exists
import { MediaUploadResult } from '../../../shared/src/types/media'; // Assuming type exists
import { useAuth } from '@/hooks/useAuth'; // Import auth hook


// Instantiate repository (replace with DI or context later)
const contentRepository = new SupabaseContentRepository();

export default function CreatePostScreen() {
  const [postText, setPostText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<ImagePicker.ImagePickerAsset[]>([]); // Use picker's Asset type
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const handlePickMedia = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow images and videos
      allowsMultipleSelection: true, // Allow selecting multiple items
      quality: 0.8, // Adjust quality as needed
      // Consider adding aspect ratio or other options
    });

    if (!result.canceled) {
      setSelectedMedia((prev) => [...prev, ...result.assets]); // Append new assets
    }
  };

  const handleRemoveMedia = (uri: string) => { // Remove by URI as it should be unique
    setSelectedMedia((prev) => prev.filter((asset) => asset.uri !== uri));
  };

  const handleSubmit = async () => {
    if (!postText.trim() && selectedMedia.length === 0) {
      setError('Please enter some text or add media to create a post.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const { user } = useAuth(); // Get user from auth context
    const userId = user?.id; // Get the actual user ID

    if (!userId) {
        setError('User not authenticated. Please log in.');
        setIsSubmitting(false);
        return;
    }

    try {
      // 1. Upload media if selected
      const mediaUploadResults: MediaUploadResult[] = [];
      for (const media of selectedMedia) {
         // Pass the asset directly, repository handles extraction
        const result = await contentRepository.uploadMedia(media);
        mediaUploadResults.push(result);
        console.log('Uploaded media:', result.url);
      }

      // 2. Create post using Content Repository
      const newPostInput: CreatePostInput = {
        userId: userId,
        // Basic content type detection (refine as needed) - use 'type' property
        contentType: selectedMedia.length > 0 ? (selectedMedia[0].type === 'video' ? 'VIDEO' : 'IMAGE') : 'TEXT',
        textContent: postText || null, // Ensure null if empty
        mediaUrls: mediaUploadResults.map(r => r.url), // Pass uploaded media URLs
        // TODO: Add other fields like pollQuestion if implementing polls
        pollQuestion: null, // Example
        options: [], // Example
      };
      const createdPost = await contentRepository.createPost(newPostInput);
      console.log('Created Post:', createdPost);

      // 3. Clear form and navigate or show success message
      setPostText('');
      setSelectedMedia([]);
      // Potentially navigate back or to the feed
      console.log('Post submitted successfully (Placeholder)');

    } catch (err) {
      console.error('Failed to submit post:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1, paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <YStack space="$3">
          <ThemedText type="title">Create Post</ThemedText>

          <TextArea
            placeholder="What's on your mind?"
            value={postText}
            onChangeText={setPostText}
            numberOfLines={5}
            disabled={isSubmitting}
          />

          {/* Media Preview */}
          {selectedMedia.length > 0 && (
            <YStack space="$2">
              <ThemedText type="subtitle">Media:</ThemedText>
              <XStack flexWrap="wrap" alignItems="center" space="$2">
                {selectedMedia.map((media) => (
                  <YStack key={media.uri} position="relative">
                    <Image
                      source={{ uri: media.uri, width: 80, height: 80 }}
                      style={{ borderRadius: 4 }} // Add some styling
                    />
                    <Button
                      size="$2"
                      circular
                      icon={<ThemedText type="default">X</ThemedText>} // Use ThemedText for icon consistency
                      onPress={() => handleRemoveMedia(media.uri)} // Pass URI
                      position="absolute"
                      top="$1" // Adjust positioning as needed
                      right="$1"
                      backgroundColor="$red5" // Example styling
                    />
                  </YStack>
                ))}
              </XStack>
            </YStack>
          )}

          <Button onPress={handlePickMedia} disabled={isSubmitting}>
            Add Photo/Video
          </Button>

          {error && (
            <Paragraph color="$red10">{error}</Paragraph>
          )}

          <Separator />

          <Button
            theme="active"
            onPress={handleSubmit}
            disabled={isSubmitting || (!postText.trim() && selectedMedia.length === 0)}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </YStack>
      </ScrollView>
    </ThemedView>
  );
}
