import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { YStack, Button, Input, XStack } from 'tamagui';
import { Search, Users } from '@tamagui/lucide-icons';
import { useEvent } from '../../../contexts/EventContext';
import { useAuth } from '../../../hooks/useAuth';
import EventParticipantListItem from '../../../components/event/EventParticipantListItem';
import { ThemedView } from '../../../components/ThemedView';
import { ThemedText } from '../../../components/ThemedText';
import { EventParticipation, ParticipationStatus, UUID } from '@bikr/shared/src/types/event';

export default function EventParticipantsScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { fetchEventParticipants, currentEvent, updateParticipantStatus, removeParticipant, canManageEvent } = useEvent();
  const { user } = useAuth();
  const [participants, setParticipants] = useState<EventParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isOrganizer = currentEvent ? canManageEvent(currentEvent) : false;
  
  // Filter participants based on search query
  const filteredParticipants = participants.filter(participant => {
    const fullName = participant.user?.fullName || '';
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const loadParticipants = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      const response = await fetchEventParticipants(eventId);
      setParticipants(response.items || []);
    } catch (err) {
      console.error('Error loading participants:', err);
      setError('Failed to load participants. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadParticipants();
  };
  
  // Handle status change
  const handleStatusChange = async (userId: UUID, status: ParticipationStatus) => {
    if (!eventId) return;
    
    try {
      await updateParticipantStatus(eventId, userId, status);
      
      // Update local state to reflect the change
      setParticipants(prev => 
        prev.map(p => 
          p.userId === userId ? { ...p, status } : p
        )
      );
    } catch (err) {
      console.error('Error updating participant status:', err);
      alert('Failed to update participant status. Please try again.');
    }
  };
  
  // Handle remove participant
  const handleRemoveParticipant = async (userId: UUID) => {
    if (!eventId) return;
    
    try {
      await removeParticipant(eventId, userId);
      
      // Remove from local state
      setParticipants(prev => prev.filter(p => p.userId !== userId));
    } catch (err) {
      console.error('Error removing participant:', err);
      alert('Failed to remove participant. Please try again.');
    }
  };
  
  // Load participants when component mounts
  useEffect(() => {
    loadParticipants();
  }, [eventId]);
  
  // Render participant item
  const renderParticipant = ({ item }: { item: EventParticipation }) => (
    <EventParticipantListItem
      participant={item}
      isOrganizer={isOrganizer}
      onStatusChange={handleStatusChange}
      onRemove={handleRemoveParticipant}
    />
  );
  
  // Render empty state
  const renderEmpty = () => (
    <YStack alignItems="center" justifyContent="center" padding="$4" space="$2">
      <Users size={40} color="#999" />
      {searchQuery ? (
        <ThemedText style={{ textAlign: 'center' }}>No participants found matching "{searchQuery}"</ThemedText>
      ) : (
        <ThemedText style={{ textAlign: 'center' }}>No participants have joined this event yet</ThemedText>
      )}
    </YStack>
  );
  
  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }
  
  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <Button onPress={loadParticipants} theme="blue">
          Try Again
        </Button>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <YStack space="$3" padding="$3">
        <XStack alignItems="center" space="$2">
          <ThemedText>Participants ({participants.length})</ThemedText>
          
          {isOrganizer && (
            <Button 
              size="$3" 
              theme="blue" 
              icon={<Users size={16} />}
              onPress={() => {
                // This would normally open a modal to invite users
                alert('Invite participants feature will be implemented in a future update');
              }}
            >
              Invite
            </Button>
          )}
        </XStack>
        
        <XStack alignItems="center" space="$2" backgroundColor="$gray3" paddingLeft="$2" borderRadius="$4">
          <Search size={16} color="$gray9" />
          <Input
            placeholder="Search participants..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            flex={1}
            borderWidth={0}
            backgroundColor="transparent"
          />
        </XStack>
        
        <FlatList
          data={filteredParticipants}
          renderItem={renderParticipant}
          keyExtractor={item => `${item.eventId}-${item.userId}`}
          ListEmptyComponent={renderEmpty}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </YStack>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    color: 'red',
  },
  list: {
    flex: 1,
  },
});
