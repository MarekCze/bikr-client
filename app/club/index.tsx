import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { YStack, Input, XStack, Text, Button, Spinner, H4, Paragraph, View, Select } from 'tamagui';
import { useRouter } from 'expo-router';
import { Search, Users, Plus, Filter } from '@tamagui/lucide-icons';
import { useClub } from '../../contexts/ClubContext';
import { useAuth } from '../../hooks/useAuth';
import { ClubListItem } from '../../components/club';
import { Club, ClubPrivacy, ClubMembershipStatus, GetClubsQueryInput } from 'bikr-shared';

const ITEMS_PER_PAGE = 20;

/**
 * Club discovery screen - shows available clubs and allows searching/filtering
 */
export default function ClubDiscoveryScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const clubRepository = useClub();
  
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalClubs, setTotalClubs] = useState<number | undefined>(undefined);
  
  // Club memberships for quickly showing membership status
  const [memberships, setMemberships] = useState<Record<string, ClubMembershipStatus>>({});
  
  // Filters
  const [privacyFilter, setPrivacyFilter] = useState<ClubPrivacy | ''>('');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  
  // Initial data load
  useEffect(() => {
    loadClubs();
    
    // If user is logged in, fetch their memberships
    if (session?.user) {
      fetchUserMemberships();
    }
  }, [session?.user]);

  const fetchUserMemberships = async () => {
    if (!session?.user) return;
    
    try {
      // In a real implementation, there would be an API to fetch all user memberships in one call
      // Here we'll just use a placeholder that would be replaced with the actual API call
      // const userMemberships = await clubRepository.getUserMemberships(session.user.id);
      
      // For now, we'll just simulate it with an empty object
      setMemberships({});
    } catch (error) {
      console.error('Error fetching user memberships:', error);
    }
  };

  const loadClubs = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setCurrentPage(0);
      } else if (!refresh && !hasMorePages) {
        return; // Don't load more if we're at the end and not refreshing
      } else {
        setLoading(true);
      }
      
      const page = refresh ? 0 : currentPage;
      
      // Prepare query params
      const queryParams: GetClubsQueryInput = {
        limit: ITEMS_PER_PAGE,
        offset: page * ITEMS_PER_PAGE,
      };
      
      // Add filters if set
      if (searchQuery) {
        queryParams.search = searchQuery;
      }
      
      if (privacyFilter) {
        queryParams.privacy = privacyFilter;
      }
      
      const response = await clubRepository.getClubs(queryParams);
      
      // Update clubs list
      if (refresh || page === 0) {
        setClubs(response.items);
      } else {
        setClubs(prev => [...prev, ...response.items]);
      }
      
      // Update pagination state
      setHasMorePages(response.items.length === ITEMS_PER_PAGE);
      setCurrentPage(page + 1);
      
      // Update total count if available in the response
      if (response.meta?.totalItems !== undefined) {
        setTotalClubs(response.meta.totalItems);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading clubs:', err);
      setError('Failed to load clubs. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    loadClubs(true);
  };
  
  const handleLoadMore = () => {
    if (!loading && hasMorePages) {
      loadClubs();
    }
  };
  
  const handleSearch = () => {
    setCurrentPage(0);
    loadClubs(true);
  };
  
  const handleCreateClub = () => {
    // Use 'as any' to avoid TypeScript errors until the route is created
    router.push('/club/create' as any);
  };
  
  const handleFilterChange = () => {
    setCurrentPage(0);
    loadClubs(true);
  };
  
  const handleMembershipChange = (clubId: string, newStatus: ClubMembershipStatus | null) => {
    // Update the membership status for this club
    setMemberships(prev => {
      if (!newStatus) {
        // Remove from memberships
        const { [clubId]: removed, ...rest } = prev;
        return rest;
      } else {
        // Add or update membership
        return { ...prev, [clubId]: newStatus };
      }
    });
  };
  
  // Error state
  if (error && !clubs.length) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4" padding="$4">
        <Text>Error: {error}</Text>
        <Button onPress={handleRefresh}>Try Again</Button>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Search Bar and Create Button */}
      <XStack padding="$3" space="$2">
        <Input
          flex={1}
          placeholder="Search clubs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button icon={<Search />} onPress={handleSearch} />
        <Button 
          icon={<Plus />} 
          onPress={handleCreateClub}
          theme="blue"
        />
      </XStack>
      
      {/* Filters */}
      <XStack paddingHorizontal="$4" paddingBottom="$2" alignItems="center" justifyContent="space-between">
        <XStack space="$2" alignItems="center">
          <Users size="$1" />
          <Text color="$gray11">
            {totalClubs !== undefined ? `${totalClubs} clubs` : 'Clubs'}
          </Text>
        </XStack>
        
        <Button
          icon={<Filter size="$1" />}
          chromeless
          onPress={() => setShowFilterOptions(!showFilterOptions)}
        >
          Filter
        </Button>
      </XStack>
      
      {/* Filter Options (collapsible) */}
      {showFilterOptions && (
        <YStack padding="$2" backgroundColor="$gray2" borderRadius="$2" margin="$2">
          <XStack space="$2" alignItems="center">
            <Text>Privacy:</Text>
            <Select
              value={privacyFilter}
              onValueChange={(value) => {
                setPrivacyFilter(value as ClubPrivacy | '');
                handleFilterChange();
              }}
              disablePreventBodyScroll
            >
              <Select.Trigger width={140}>
                <Select.Value placeholder="All" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item index={0} value="">
                  <Select.ItemText>All</Select.ItemText>
                </Select.Item>
                <Select.Item index={1} value={ClubPrivacy.PUBLIC}>
                  <Select.ItemText>Public</Select.ItemText>
                </Select.Item>
                <Select.Item index={2} value={ClubPrivacy.PRIVATE}>
                  <Select.ItemText>Private</Select.ItemText>
                </Select.Item>
              </Select.Content>
            </Select>
          </XStack>
        </YStack>
      )}
      
      {/* Club List */}
      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClubListItem
            club={item}
            membershipStatus={memberships[item.id]}
            onJoinLeaveToggle={(clubId, isMember) => {
              // Convert boolean to ClubMembershipStatus
              const newStatus = isMember ? ClubMembershipStatus.APPROVED : null;
              handleMembershipChange(clubId, newStatus);
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View height={1} backgroundColor="$gray5" />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={
          loading ? (
            <YStack padding="$4" alignItems="center">
              <Spinner size="large" />
            </YStack>
          ) : (
            <YStack padding="$10" alignItems="center">
              <Paragraph>No clubs found</Paragraph>
            </YStack>
          )
        }
        ListFooterComponent={
          loading && !refreshing && clubs.length > 0 ? (
            <YStack padding="$4" alignItems="center">
              <Spinner />
            </YStack>
          ) : null
        }
      />
    </YStack>
  );
}
