import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { YStack, H3, H4, Spinner, Text, Button, View, Paragraph } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { Club, Post, ClubMembershipStatus } from 'bikr-shared';
import { useClub } from '../../../contexts/ClubContext';
import { useAuth } from '../../../hooks/useAuth';
import { JoinLeaveButton } from '../../../components/club';
import { AlertTriangle, MessageCircle, Calendar, Info } from '@tamagui/lucide-icons';

/**
 * Club profile main page with feed of club posts and activity
 */
export default function ClubProfileScreen() {
  const { clubId } = useLocalSearchParams();
  const { session } = useAuth();
  const clubRepository = useClub();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  
  // We use the parent layout to manage club data and membership status
  // This page just focuses on displaying the feed

  useEffect(() => {
    loadFeed();
  }, [clubId]);
  
  const loadFeed = async (refresh = false) => {
    if (!clubId || typeof clubId !== 'string') return;
    
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Here we would fetch club posts but the API might not be implemented yet
      // For now, we'll just use an empty array
      setPosts([]);
      
      setError(null);
    } catch (err) {
      console.error('Error loading club feed:', err);
      setError('Failed to load club feed. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    loadFeed(true);
  };
  
  // Empty state - no posts yet
  if (!loading && posts.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4" padding="$4">
        <YStack alignItems="center" space="$2">
          <MessageCircle size="$10" opacity={0.3} />
          <H4>No Posts Yet</H4>
          <Paragraph textAlign="center" color="$gray11">
            This club doesn't have any posts yet. Once members start sharing, their posts will appear here.
          </Paragraph>
        </YStack>
        
        {/* Show different options for members vs non-members */}
        <YStack space="$2" marginTop="$4">
          <Button
            theme="blue"
            onPress={handleRefresh}
          >
            Refresh Feed
          </Button>
        </YStack>
      </YStack>
    );
  }
  
  // Loading state
  if (loading && !refreshing) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4">
        <Spinner size="large" />
        <Text>Loading club feed...</Text>
      </YStack>
    );
  }
  
  // Error state
  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4" padding="$4">
        <AlertTriangle size="$8" color="$red10" />
        <H3>Could not load feed</H3>
        <Text textAlign="center">{error}</Text>
        <Button onPress={handleRefresh} theme="blue" marginTop="$4">
          Try Again
        </Button>
      </YStack>
    );
  }
  
  // Main feed view
  return (
    <YStack flex={1} backgroundColor="$background">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View padding="$4" marginVertical="$2" backgroundColor="$background">
            <Text>Post placeholder for ID: {item.id}</Text>
            {/* Use proper post component here when available */}
          </View>
        )}
        ItemSeparatorComponent={() => <View height={1} backgroundColor="$gray5" />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <YStack height={400} justifyContent="center" alignItems="center">
            <Text>No posts to show</Text>
          </YStack>
        }
        
        // Use contentContainerStyle for padding the bottom
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </YStack>
  );
}
