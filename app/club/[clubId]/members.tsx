import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { YStack, Input, XStack, Text, Button, Spinner, H3, Paragraph, View, ScrollView } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { Search, Users } from '@tamagui/lucide-icons';
import { useClub } from '../../../contexts/ClubContext';
import { useAuth } from '../../../hooks/useAuth';
import { ClubMemberListItem } from '../../../components/club';
import { ClubMembership, ClubRole } from 'bikr-shared';

const ITEMS_PER_PAGE = 20;

/**
 * Screen for viewing and managing club members
 */
export default function ClubMembersScreen() {
  const { clubId } = useLocalSearchParams();
  const { session } = useAuth();
  const clubRepository = useClub();
  
  const [members, setMembers] = useState<ClubMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [memberCount, setMemberCount] = useState<number | undefined>(undefined);
  
  // Current user role state
  const [currentUserRole, setCurrentUserRole] = useState<ClubRole | null>(null);
  const isAdmin = currentUserRole === ClubRole.ADMIN || currentUserRole === ClubRole.OWNER;
  
  // Initial data load
  useEffect(() => {
    if (!clubId || typeof clubId !== 'string') return;
    
    loadMembers();
    
    // Also check current user's role in the club if logged in
    if (session?.user) {
      checkUserRole();
    }
  }, [clubId, session?.user]);

  const checkUserRole = async () => {
    if (!session?.user || !clubId || typeof clubId !== 'string') return;
    
    try {
      const membership = await clubRepository.getMembership(clubId, session.user.id);
      if (membership) {
        setCurrentUserRole(membership.role || null);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const loadMembers = async (refresh = false) => {
    if (!clubId || typeof clubId !== 'string') return;
    
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
      const response = await clubRepository.getClubMembers(clubId, {
        limit: ITEMS_PER_PAGE,
        offset: page * ITEMS_PER_PAGE,
        search: searchQuery || undefined,
      });
      
      // Update member lists
      if (refresh || page === 0) {
        setMembers(response.items);
      } else {
        setMembers(prev => [...prev, ...response.items]);
      }
      
      // Update pagination state
      setHasMorePages(response.items.length === ITEMS_PER_PAGE);
      setCurrentPage(page + 1);
      
      // Update total count if available in the response
      if (response.meta?.totalItems !== undefined) {
        setMemberCount(response.meta.totalItems);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading club members:', err);
      setError('Failed to load members. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    loadMembers(true);
  };
  
  const handleLoadMore = () => {
    if (!loading && hasMorePages) {
      loadMembers();
    }
  };
  
  const handleSearch = () => {
    setCurrentPage(0);
    loadMembers(true);
  };
  
  const handleRoleChange = (userId: string, newRole: ClubRole) => {
    // Update the local member list with the new role
    setMembers(prevMembers => 
      prevMembers.map(member => 
        member.user_id === userId ? { ...member, role: newRole } : member
      )
    );
  };
  
  const handleRemoveMember = (userId: string) => {
    // Remove the member from the local list
    setMembers(prevMembers => 
      prevMembers.filter(member => member.user_id !== userId)
    );
    
    // Update the count if we have it
    if (memberCount !== undefined) {
      setMemberCount(prevCount => (prevCount ?? 0) - 1);
    }
  };
  
  // Error state
  if (error && !members.length) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4" padding="$4">
        <Text>Error: {error}</Text>
        <Button onPress={handleRefresh}>Try Again</Button>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Search Bar */}
      <XStack padding="$3" space="$2">
        <Input
          flex={1}
          placeholder="Search members..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button icon={<Search />} onPress={handleSearch} />
      </XStack>
      
      {/* Member count display */}
      <XStack paddingHorizontal="$4" paddingBottom="$2" alignItems="center">
        <Users size="$1" />
        <Text paddingLeft="$2" color="$gray11">
          {memberCount !== undefined ? `${memberCount} members` : 'Members'}
        </Text>
      </XStack>
      
      {/* Member List */}
      <FlatList
        data={members}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => (
          <ClubMemberListItem
            clubId={clubId as string}
            membership={item}
            currentUserRole={currentUserRole || undefined}
            onRoleChange={handleRoleChange}
            onRemoveMember={handleRemoveMember}
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
              <Paragraph>No members found</Paragraph>
            </YStack>
          )
        }
        ListFooterComponent={
          loading && !refreshing && members.length > 0 ? (
            <YStack padding="$4" alignItems="center">
              <Spinner />
            </YStack>
          ) : null
        }
      />
    </YStack>
  );
}
