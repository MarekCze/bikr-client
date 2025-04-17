import React, { useState, ReactNode } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { Stack, YStack, Text, Button } from 'tamagui';
import { MediaCard } from '../MediaCard';
import { DetailedPost, MediaType } from '../../../../shared/src/types/post';

// Mock data for the feed example
const MOCK_POSTS: DetailedPost[] = [
  {
    id: 'post1',
    user_id: 'user1',
    content: 'Just got my new bike today! Can\'t wait to hit the road this weekend.',
    location_name: 'Motorcycle Dealership',
    location_lat: 37.7749,
    location_lng: -122.4194,
    is_poll: false,
    context_type: null,
    context_id: null,
    created_at: '2025-04-12T09:00:00Z',
    updated_at: '2025-04-12T09:00:00Z',
    author: {
      id: 'user1',
      username: 'riderlady',
      display_name: 'Amanda Rider',
      avatar_url: null,
    },
    media: [],
    tags: [],
    like_count: 24,
    comment_count: 7,
    bookmark_count: 3,
    poll_options: null,
    user_interaction: {
      is_liked: false,
      is_bookmarked: false,
      voted_option_id: null,
    },
  },
  {
    id: 'post2',
    user_id: 'user2',
    content: 'Check out these shots from our weekend ride through the mountains!',
    location_name: 'Sierra Mountains',
    location_lat: 38.8,
    location_lng: -120.2,
    is_poll: false,
    context_type: 'Club',
    context_id: 'club1',
    created_at: '2025-04-11T18:30:00Z',
    updated_at: '2025-04-11T18:30:00Z',
    author: {
      id: 'user2',
      username: 'mtnrider',
      display_name: 'Mountain Rider Club',
      avatar_url: null,
    },
    media: [
      {
        id: 'media1',
        url: 'https://example.com/image1.jpg',
        type: MediaType.Image,
        position: 0,
      },
      {
        id: 'media2',
        url: 'https://example.com/image2.jpg',
        type: MediaType.Image,
        position: 1,
      },
    ],
    tags: [],
    like_count: 87,
    comment_count: 12,
    bookmark_count: 15,
    poll_options: null,
    user_interaction: {
      is_liked: true,
      is_bookmarked: true,
      voted_option_id: null,
    },
  },
  {
    id: 'post3',
    user_id: 'user3',
    content: 'What\'s your preferred motorcycle for long-distance touring?',
    location_name: null,
    location_lat: null,
    location_lng: null,
    is_poll: true,
    context_type: null,
    context_id: null,
    created_at: '2025-04-10T14:15:00Z',
    updated_at: '2025-04-10T14:15:00Z',
    author: {
      id: 'user3',
      username: 'tourguide',
      display_name: 'Tour Guide',
      avatar_url: null,
    },
    media: [],
    tags: [],
    like_count: 42,
    comment_count: 31,
    bookmark_count: 8,
    poll_options: [
      {
        id: 'option1',
        text: 'BMW R1250GS',
        vote_count: 156,
        position: 0,
      },
      {
        id: 'option2',
        text: 'Harley-Davidson Road Glide',
        vote_count: 142,
        position: 1,
      },
      {
        id: 'option3',
        text: 'Honda Gold Wing',
        vote_count: 118,
        position: 2,
      },
      {
        id: 'option4',
        text: 'Kawasaki Versys',
        vote_count: 87,
        position: 3,
      },
    ],
    user_interaction: {
      is_liked: false,
      is_bookmarked: false,
      voted_option_id: 'option3',
    },
  },
];

interface FeedExampleProps {
  header?: ReactNode;
  emptyState?: ReactNode;
  testID?: string;
}

// Empty state component as a separate React component
const EmptyStateComponent = ({ onRefresh }: { onRefresh: () => void }) => (
  <YStack padding="$6" alignItems="center" justifyContent="center">
    <Text fontSize="$5" textAlign="center" marginBottom="$4">
      No posts yet
    </Text>
    <Button onPress={onRefresh}>
      Refresh
    </Button>
  </YStack>
);

export default function FeedExample({ header, emptyState, testID }: FeedExampleProps) {
  const [posts, setPosts] = useState<DetailedPost[]>(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  
  // Simulate a refresh operation
  const handleRefresh = () => {
    setRefreshing(true);
    // In a real app, fetch new data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  // Handle post interaction
  const handleLike = (postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post => {
        if (post.id === postId) {
          // Only proceed if user_interaction exists
          if (!post.user_interaction) return post;
          
          const isLiked = !post.user_interaction.is_liked;
          return {
            ...post,
            like_count: post.like_count + (isLiked ? 1 : -1),
            user_interaction: {
              ...post.user_interaction,
              is_liked: isLiked,
            },
          } as DetailedPost; // Type assertion to ensure compatibility
        }
        return post;
      })
    );
  };
  
  // Handle post bookmark
  const handleBookmark = (postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post => {
        if (post.id === postId) {
          // Only proceed if user_interaction exists
          if (!post.user_interaction) return post;
          
          const isBookmarked = !post.user_interaction.is_bookmarked;
          return {
            ...post,
            bookmark_count: post.bookmark_count + (isBookmarked ? 1 : -1),
            user_interaction: {
              ...post.user_interaction,
              is_bookmarked: isBookmarked,
            },
          } as DetailedPost; // Type assertion to ensure compatibility
        }
        return post;
      })
    );
  };
  
  // Render a single post
  const renderPost: ListRenderItem<DetailedPost> = ({ item }) => (
    <MediaCard
      post={item}
      onPress={() => console.log(`Post ${item.id} pressed`)}
      onLongPress={() => console.log(`Post ${item.id} long pressed`)}
    />
  );
  
  // For empty state, use either provided empty state or default component
  const emptyStateElement = emptyState || <EmptyStateComponent onRefresh={handleRefresh} />;
  
  return (
    <Stack flex={1} testID={testID}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={header ? () => <>{header}</> : undefined}
        ListEmptyComponent={emptyStateElement}
        contentContainerStyle={{ 
          flexGrow: 1, 
          padding: 16,
        }}
      />
    </Stack>
  );
}
