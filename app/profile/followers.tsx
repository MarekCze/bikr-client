import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { YStack, Text, View, Separator } from 'tamagui';
import { Stack, useLocalSearchParams } from 'expo-router';
import { User } from 'bikr-shared';

import { SupabaseSocialRepository } from '@/repositories/SupabaseSocialRepository';
import { UserListItem } from '@/components/profile/UserListItem';
import { useAuth } from '@/hooks/useAuth'; // Assuming useAuth provides current user ID

// TODO: Implement pagination/infinite scroll

export default function FollowersScreen() {
  const { user } = useAuth(); // Get current authenticated user
  const params = useLocalSearchParams<{ userId?: string }>();
  const targetUserId = params.userId || user?.id; // Default to logged-in user if no userId param

  const [followers, setFollowers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Need to fetch following status for the *current* user relative to these followers
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});
  const [isTogglingFollow, setIsTogglingFollow] = useState<Record<string, boolean>>({});

  const socialRepository = useMemo(() => new SupabaseSocialRepository(), []);

  const fetchFollowers = useCallback(async () => {
    if (!targetUserId) {
      setError("User ID not found.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const results = await socialRepository.getFollowers(targetUserId); // Add pagination later
      setFollowers(results.items);
      // TODO: Fetch initial following status for these users relative to the logged-in user
    } catch (err) {
      console.error('Failed to fetch followers:', err);
      setError('Could not load followers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, socialRepository]);

  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  const handleFollowToggle = useCallback(async (userIdToToggle: string, currentlyFollowing: boolean) => {
    // Prevent following/unfollowing the profile owner if viewing someone else's list? No, allow interaction.
    setIsTogglingFollow(prev => ({ ...prev, [userIdToToggle]: true }));
    try {
      if (currentlyFollowing) {
        await socialRepository.unfollowUser(userIdToToggle);
        setFollowingStatus(prev => ({ ...prev, [userIdToToggle]: false })); // Optimistic update
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
      isFollowing={followingStatus[item.id] ?? false}
      onFollowToggle={handleFollowToggle} // Only allow toggle if viewing own profile's list? Or always? Always for now.
      isLoading={isTogglingFollow[item.id] ?? false}
    />
  );

  return (
    <YStack flex={1} backgroundColor="$background">
      <Stack.Screen options={{ title: 'Followers' }} />

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

      {!isLoading && !error && followers.length === 0 && (
         <View flex={1} alignItems="center" justifyContent="center" padding="$4">
           <Text color="$gray10" textAlign="center">No followers yet.</Text>
         </View>
      )}

      {!isLoading && !error && followers.length > 0 && (
        <FlatList
          data={followers}
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
