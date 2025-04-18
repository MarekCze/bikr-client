import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Input, YStack, Text, Button, XStack, View, Spinner } from 'tamagui'; // Added Spinner
import { Search } from '@tamagui/lucide-icons';
import { User } from 'bikr-shared';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SupabaseSocialRepository } from '@/repositories/SupabaseSocialRepository'; // Adjust path if needed
import { UserListItem } from '@/components/profile/UserListItem'; // Adjust path if needed
import { useDebounce } from '@/hooks/useDebounce'; // Assuming a debounce hook exists or will be created

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState<Record<string, boolean>>({}); // Track loading state per user
  const [error, setError] = useState<string | null>(null);
  // TODO: Track actual follow status for users in search results
  // This currently requires fetching the current user's following list and comparing
  // or a dedicated API endpoint. For now, buttons will just toggle based on action.
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});

  const socialRepository = useMemo(() => new SupabaseSocialRepository(), []);
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce search input

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const results = await socialRepository.searchUsers(query);
      setSearchResults(results.items);
      // TODO: Fetch and set initial followingStatus for these results
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search for users. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [socialRepository]);

  // Trigger search when debounced query changes
  React.useEffect(() => {
    handleSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, handleSearch]);

  const handleFollowToggle = useCallback(async (userId: string, currentlyFollowing: boolean) => {
    setIsTogglingFollow(prev => ({ ...prev, [userId]: true }));
    try {
      if (currentlyFollowing) {
        await socialRepository.unfollowUser(userId);
        setFollowingStatus(prev => ({ ...prev, [userId]: false })); // Optimistic update
      } else {
        await socialRepository.followUser(userId);
        setFollowingStatus(prev => ({ ...prev, [userId]: true })); // Optimistic update
      }
      // Optionally refetch search results or user profile data if needed
    } catch (err) {
      console.error('Follow/Unfollow failed:', err);
      // Optionally revert optimistic update on error
      setFollowingStatus(prev => ({ ...prev, [userId]: currentlyFollowing }));
      // Show error message to user
    } finally {
      setIsTogglingFollow(prev => ({ ...prev, [userId]: false }));
    }
  }, [socialRepository]);

  const renderItem = ({ item }: { item: User }) => (
    <UserListItem
      user={item}
      isFollowing={followingStatus[item.id] ?? false} // Use tracked status, default to false
      onFollowToggle={handleFollowToggle}
      isLoading={isTogglingFollow[item.id] ?? false}
    />
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="magnifyingglass" // Changed icon
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore Users</ThemedText>
      </ThemedView>

      <YStack space="$3" paddingHorizontal="$3" marginTop="$4">
        {/* Wrap Input and Icon in XStack for proper layout */}
        <XStack space="$2" alignItems="center" borderWidth={1} borderColor="$borderColor" borderRadius="$4" paddingHorizontal="$3">
           <Search size="$1.5" color="$gray10" />
           <Input
             flex={1}
             placeholder="Search for users..."
             value={searchQuery}
             onChangeText={setSearchQuery}
             size="$4"
             borderWidth={0} // Remove default border
             backgroundColor="transparent" // Ensure input background doesn't clash
             focusStyle={{ // Remove focus ring if desired, or style it
               borderWidth: 0,
               outlineWidth: 0,
             }}
           />
        </XStack>

        {isLoading && !searchResults.length && (
           <View flex={1} alignItems="center" justifyContent="center" paddingVertical="$4">
             <Spinner size="large" color="$gray10" />
           </View>
        )}

        {error && <Text color="$red10" textAlign="center" marginTop="$2">{error}</Text>}

        {!isLoading && !error && searchQuery.trim() && !searchResults.length && (
           <Text color="$gray10" textAlign="center" marginTop="$4">No users found matching "{searchQuery}".</Text>
        )}

        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          // Add pull-to-refresh or pagination if needed later
        />
      </YStack>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16, // Added padding for title consistency
  },
  // Removed loadingIndicator style as Spinner is used directly
});
