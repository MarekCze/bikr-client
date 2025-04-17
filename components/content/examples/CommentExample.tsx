import React from 'react';
import { ScrollView } from 'react-native';
import { Text, YStack, Card, Separator } from 'tamagui';
import { CommentList } from '../Comment';

// Mock data for demonstration purposes
const MOCK_POST_ID = '123456';

const MOCK_COMMENTS = [
  {
    id: '1',
    postId: MOCK_POST_ID,
    userId: 'user1',
    content: 'This is a great post! I love how you captured the mountain trail.',
    createdAt: '2025-04-10T14:30:00Z',
    updatedAt: '2025-04-10T14:30:00Z',
    likeCount: 12,
    isLikedByUser: true,
    author: {
      id: 'user1',
      username: 'trailrider',
      displayName: 'Trail Rider',
      avatarUrl: 'https://i.pravatar.cc/150?u=user1'
    }
  },
  {
    id: '2',
    postId: MOCK_POST_ID,
    userId: 'user2',
    content: 'I rode that same trail last weekend! The descent is challenging but so worth it.',
    createdAt: '2025-04-11T10:15:00Z',
    updatedAt: '2025-04-11T10:15:00Z',
    likeCount: 5,
    isLikedByUser: false,
    author: {
      id: 'user2',
      username: 'mountainbiker',
      displayName: 'Mountain Biker',
      avatarUrl: 'https://i.pravatar.cc/150?u=user2'
    }
  },
  {
    id: '3',
    postId: MOCK_POST_ID,
    userId: 'user3',
    parentId: '1',
    content: 'Agreed! The lighting in this shot is perfect!',
    createdAt: '2025-04-11T15:45:00Z',
    updatedAt: '2025-04-11T15:45:00Z',
    likeCount: 2,
    isLikedByUser: false,
    author: {
      id: 'user3',
      username: 'bikephotographer',
      displayName: 'Bike Photographer',
      avatarUrl: 'https://i.pravatar.cc/150?u=user3'
    }
  },
  {
    id: '4',
    postId: MOCK_POST_ID,
    userId: 'user4',
    content: 'What kind of bike were you riding for this trail?',
    createdAt: '2025-04-12T09:20:00Z',
    updatedAt: '2025-04-12T09:20:00Z',
    likeCount: 1,
    isLikedByUser: false,
    author: {
      id: 'user4',
      username: 'biketechie',
      displayName: 'Bike Techie',
      avatarUrl: 'https://i.pravatar.cc/150?u=user4'
    }
  },
  {
    id: '5',
    postId: MOCK_POST_ID,
    userId: 'user1',
    parentId: '4',
    content: 'I was on my Trek Fuel EX 9.8. It handled the trail beautifully!',
    createdAt: '2025-04-12T10:05:00Z',
    updatedAt: '2025-04-12T10:05:00Z',
    likeCount: 3,
    isLikedByUser: true,
    author: {
      id: 'user1',
      username: 'trailrider',
      displayName: 'Trail Rider',
      avatarUrl: 'https://i.pravatar.cc/150?u=user1'
    }
  }
];

export const CommentExample = () => {
  return (
    <ScrollView>
      <YStack padding="$4" space="$4">
        <Text fontSize="$6" fontWeight="bold">Comment System Example</Text>
        <Text>This example demonstrates the commenting functionality for posts.</Text>
        
        <Card size="$4" bordered>
          <Card.Header>
            <Text fontSize="$5" fontWeight="bold">Mountain Trail Ride</Text>
            <Text color="$gray10">Posted by Trail Rider • 2 days ago</Text>
          </Card.Header>
          
          <Card.Footer padded>
            <Text>Conquered the challenging Alpine Trail today! The views were breathtaking and the descent was thrilling. Who else has ridden this trail?</Text>
          </Card.Footer>
        </Card>
        
        <Separator />
        
        <CommentList 
          postId={MOCK_POST_ID}
          initialComments={MOCK_COMMENTS}
          initialTotalCount={MOCK_COMMENTS.length}
        />
      </YStack>
    </ScrollView>
  );
};

export default CommentExample;
