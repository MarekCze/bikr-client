import React from 'react';
import { ScrollView } from 'react-native';
import { Separator, YStack, H3 } from 'tamagui';
import { MediaCard } from '../MediaCard';
import { DetailedPost, MediaType, ContextType } from '../../../../shared/src/types/post';

// Example media post
const textPostExample = {
  id: 'post1',
  userId: 'user1',
  content: 'Just got my new Triumph Street Triple today! Can\'t wait to hit some twisty roads this weekend. Any recommendations for good routes near San Francisco?',
  type: 'TEXT',
  createdAt: '2025-04-12T10:00:00.000Z',
  updatedAt: '2025-04-12T10:00:00.000Z',
  published: true,
  likeCount: 24,
  commentCount: 7,
  shareCount: 3,
  isLikedByUser: false,
  isBookmarkedByUser: false,
  location: {
    name: 'San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194
  },
  author: {
    id: 'user1',
    username: 'riderlady',
    displayName: 'Amanda Rider',
    avatarUrl: null,
  },
  media: [],
  tags: [
    { id: 'tag1', name: 'triumph', type: 'BIKE' },
    { id: 'tag2', name: 'newbike', type: 'GENERAL' },
    { id: 'tag3', name: 'streettriple', type: 'BIKE' }
  ]
};

// Example post with images
const imagePostExample = {
  id: 'post2',
  userId: 'user2',
  content: 'Perfect day for a ride through the mountains! The views were incredible.',
  type: 'PHOTO',
  createdAt: '2025-04-10T16:30:00.000Z',
  updatedAt: '2025-04-10T16:30:00.000Z',
  published: true,
  likeCount: 87,
  commentCount: 12,
  shareCount: 15,
  isLikedByUser: true,
  isBookmarkedByUser: true,
  location: {
    name: 'Blue Ridge Mountains',
    latitude: 35.7796,
    longitude: -82.2665
  },
  contextType: ContextType.CLUB,
  contextId: 'club1',
  author: {
    id: 'user2',
    username: 'mountainrider',
    displayName: 'John Mountain',
    avatarUrl: null,
    isVerified: true,
  },
  media: [
    {
      id: 'media1',
      url: 'https://images.unsplash.com/photo-1594551849319-584e19bf0b18',
      type: MediaType.IMAGE,
      order: 0,
    },
    {
      id: 'media2',
      url: 'https://images.unsplash.com/photo-1602345397613-0934a8812d23',
      type: MediaType.IMAGE,
      order: 1,
    },
  ],
  tags: [
    { id: 'tag7', name: 'mountains', type: 'LOCATION' },
    { id: 'tag8', name: 'scenery', type: 'GENERAL' },
    { id: 'tag9', name: 'adventure', type: 'GENERAL' }
  ]
};

// Example poll post
const pollPostExample = {
  id: 'post3',
  userId: 'user3',
  content: 'What\'s your preferred motorcycle for long-distance touring?',
  type: 'POLL',
  createdAt: '2025-04-09T14:15:00.000Z',
  updatedAt: '2025-04-09T14:15:00.000Z',
  published: true,
  likeCount: 42,
  commentCount: 31,
  shareCount: 8,
  isLikedByUser: false,
  isBookmarkedByUser: false,
  author: {
    id: 'user3',
    username: 'tourguide',
    displayName: 'Tour Guide',
    avatarUrl: null,
  },
  media: [],
  poll: {
    id: 'poll1',
    question: 'What\'s your preferred motorcycle for long-distance touring?',
    options: [
      {
        id: 'option1',
        text: 'BMW R1250GS',
        voteCount: 156,
        percentage: 31,
        isSelectedByUser: false
      },
      {
        id: 'option2',
        text: 'Harley-Davidson Road Glide',
        voteCount: 142,
        percentage: 28,
        isSelectedByUser: false
      },
      {
        id: 'option3',
        text: 'Honda Gold Wing',
        voteCount: 118,
        percentage: 23,
        isSelectedByUser: true
      },
      {
        id: 'option4',
        text: 'Kawasaki Versys',
        voteCount: 87,
        percentage: 18,
        isSelectedByUser: false
      },
    ],
    expiresAt: '2025-04-16T14:15:00.000Z',
    allowMultipleChoices: false,
    userHasVoted: true
  },
  tags: [
    { id: 'tag4', name: 'touring', type: 'GENERAL' },
    { id: 'tag5', name: 'motorcycles', type: 'BIKE' },
    { id: 'tag6', name: 'poll', type: 'GENERAL' }
  ]
};

export default function MediaCardExamples() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <YStack padding="$4" space="$6">
        <H3>Text Post</H3>
        <MediaCard
          post={textPostExample as unknown as DetailedPost}
          onPress={() => console.log('Post pressed')}
        />
        
        <Separator marginVertical="$4" />
        
        <H3>Image Gallery Post</H3>
        <MediaCard
          post={imagePostExample as unknown as DetailedPost}
          onPress={() => console.log('Image post pressed')}
          onImagePress={(index) => console.log(`Image ${index} pressed`)}
        />
        
        <Separator marginVertical="$4" />
        
        <H3>Poll Post</H3>
        <MediaCard
          post={pollPostExample as unknown as DetailedPost}
          onPress={() => console.log('Poll post pressed')}
          onVote={(optionId) => console.log(`Voted for option ${optionId}`)}
        />
      </YStack>
    </ScrollView>
  );
}
