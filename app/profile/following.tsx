import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { YStack, Text, View, Separator } from 'tamagui';
import { Stack, useLocalSearchParams } from 'expo-router';
import { User } from 'bikr-shared';

import { SupabaseSocialRepository } from '@/repositories/SupabaseSocialRepository';
import { UserListItem } from '@/components/profile/UserListItem';
import { useAuth } from '@/hooks/useAuth'; // Assuming useAuth provides current user ID

// TODO: Implement pagination/infinite scroll

export default function FollowingScreen() {
  const { user } = useAuth(); // Get current authenticated user
  const params = useLocalSearchParams<{ userId?: string }>();
  const targetUserId = params.userId || user?.id; // Default to logged-in user if no userId param

  const [following, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Need to fetch following status for the *current* user relative to these users
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});
  const [isTogglingFollow, setIsTogglingFollow] = useState<Record<string, boolean>>({});

  const socialRepository = useMemo(() => new SupabaseSocialRepository(), []);

  const fetchFollowing = useCallback(async () => {
    if (!targetUserId) {
      setError("User ID not found.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Call getFollowing instead of getFollowers
      const results = await socialRepository.getFollowing(targetUserId); // Add pagination later
      setFollowing(results.items);
      // TODO: Fetch initial following status for these users relative to the logged-in user
      // Set all to true initially if viewing own list? Or fetch? Fetch is better.
      if (targetUserId === user?.id) {
         const initialStatus = results.items.reduce((acc, u) => {
           acc[u.id] = true; // If it's my following list, I follow all of them
           return acc;
         }, {} as Record<string, boolean>);
         setFollowingStatus(initialStatus);
      } else {
        // TODO: If viewing someone else's list, need to fetch which ones *I* follow
      }

    } catch (err) {
      console.error('Failed to fetch following:', err);
      setError('Could not load following list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, socialRepository, user?.id]);

  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  const handleFollowToggle = useCallback(async (userIdToToggle: string, currentlyFollowing: boolean) => {
    setIsTogglingFollow(prev => ({ ...prev, [userIdToToggle]: true }));
    try {
      if (currentlyFollowing) {
        await socialRepository.unfollowUser(userIdToToggle);
        setFollowingStatus(prev => ({ ...prev, [userIdToToggle]: false })); // Optimistic update
        // If viewing own list, remove from the displayed list? Or just update button? Just update button for now.
      } else {
        await socialRepository.followUser(userIdToToggle);
        setFollowingStatus(prev => ({ ...prev, [userIdToToggle]: true })); // Optimistic update
      }
    } catch (err) {
      console.error('Follow/Unfollow failed:', err);
      setFollowingStatus(prev => ({ ...prev, [userIdToToggle]: currentlyFollowing })); // Revert optimistic update
      // Show error message
    } finally {
      setIsTogglingFollow(prev => ({ ...prev, [userIdToToggle]: false }));
    }
  }, [socialRepository]);


  const renderItem = ({ item }: { item: User }) => (
    <UserListItem
      user={item}
      // Determine follow status based on fetched/updated state
      isFollowing={followingStatus[item.id] ?? false}
      onFollowToggle={handleFollowToggle}
      isLoading={isTogglingFollow[item.id] ?? false}
    />
  );

  return (
    <YStack flex={1} backgroundColor="$background">
      <Stack.Screen options={{ title: 'Following' }} />

      {isLoading && (
        <View flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" />
        </View>
      )}

      {error && (
        <View flex={1} alignItems="center" justifyContent="center" padding="$4">
          <Text color="$red10" textAlign="center">{error}</Text>
        </View>
      )}

      {!isLoading && !error && following.length === 0 && (
         <View flex={1} alignItems="center" justifyContent="center" padding="$4">
           <Text color="$gray10" textAlign="center">Not following anyone yet.</Text>
         </View>
      )}

      {!isLoading && !error && following.length > 0 && (
        <FlatList
          data={following}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Separator marginVertical="$2" />}
          // onEndReached={loadMore} // TODO: Implement pagination
          // onEndReachedThreshold={0.5}
          // ListFooterComponent={renderFooter} // TODO: Implement loading indicator for pagination
        />
      )}
    </YStack>
  );
}
