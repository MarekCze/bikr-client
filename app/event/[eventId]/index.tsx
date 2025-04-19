import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useEvent } from '../../../contexts/EventContext';
import { useAuth } from '../../../hooks/useAuth';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { EventParticipation, ParticipationStatus } from '@bikr/shared/src/types/event';

/**
 * Event detail screen that displays a specific event's information
 */
export default function EventDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { 
    currentEvent, 
    loadingEvent, 
    fetchEventById, 
    joinEvent, 
    leaveEvent,
    fetchEventParticipants,
    canManageEvent
  } = useEvent();
  
  const [participants, setParticipants] = useState<EventParticipation[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const eventId = params.eventId as string;
  
  // Load event details on component mount
  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId);
      loadParticipants();
    }
  }, [eventId]);
  
  // Check if current user is a participant
  useEffect(() => {
    if (user && participants.length > 0) {
      const userParticipation = participants.find(p => p.userId === user.id);
      setIsParticipant(!!userParticipation);
    } else {
      setIsParticipant(false);
    }
  }, [user, participants]);
  
  // Load event participants
  const loadParticipants = async () => {
    if (!eventId) return;
    
    setLoadingParticipants(true);
    try {
      const response = await fetchEventParticipants(eventId);
      setParticipants(response.items || []);
    } catch (error) {
      console.error('Error loading participants:', error);
    } finally {
      setLoadingParticipants(false);
    }
  };
  
  // Handle joining an event
  const handleJoin = async () => {
    if (!eventId || !user) return;
    
    try {
      await joinEvent(eventId);
      // Reload participants to see updated list
      loadParticipants();
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };
  
  // Handle leaving an event
  const handleLeave = async () => {
    if (!eventId || !user) return;
    
    try {
      await leaveEvent(eventId);
      // Reload participants to see updated list
      loadParticipants();
    } catch (error) {
      console.error('Error leaving event:', error);
    }
  };
  
  // Handle editing an event (for organizers)
  const handleEdit = () => {
    router.push({
      pathname: './edit',
    });
  };
  
  // Render loading state
  if (loadingEvent || !currentEvent) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <ThemedText style={styles.loadingText}>Loading event details...</ThemedText>
      </ThemedView>
    );
  }
  
  // Format dates for display
  const formattedDate = format(new Date(currentEvent.startDate), 'EEEE, MMMM d, yyyy');
  const formattedTime = format(new Date(currentEvent.startDate), 'h:mm a');
  const formattedEndTime = currentEvent.endDate 
    ? format(new Date(currentEvent.endDate), 'h:mm a')
    : null;
  
  // Determine if user can manage this event
  const canManage = canManageEvent(currentEvent);
  
  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        {/* Event Cover */}
        <View style={styles.coverContainer}>
          {currentEvent.coverImageUrl ? (
            <View style={styles.coverImageContainer}>
              <Ionicons name="image" size={80} color="#ffffff" />
            </View>
          ) : (
            <View style={styles.defaultCover}>
              <Ionicons name="calendar" size={80} color="#ffffff" />
            </View>
          )}
        </View>
        
        {/* Event Title */}
        <ThemedText style={styles.title}>{currentEvent.title}</ThemedText>
        
        {/* Organizer Info */}
        <View style={styles.organizerContainer}>
          <Ionicons name="person-outline" size={16} color="#777777" />
          <ThemedText style={styles.organizerText}>
            Organized by {currentEvent.organizer?.username || 'Unknown'}
          </ThemedText>
        </View>
        
        {/* Date and Time */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#777777" />
            <ThemedText style={styles.infoText}>{formattedDate}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#777777" />
            <ThemedText style={styles.infoText}>
              {formattedTime}{formattedEndTime ? ` - ${formattedEndTime}` : ''}
            </ThemedText>
          </View>
        </View>
        
        {/* Location */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#777777" />
            <ThemedText style={styles.infoText}>{currentEvent.location.name}</ThemedText>
          </View>
          {currentEvent.location.address && (
            <ThemedText style={styles.addressText}>
              {currentEvent.location.address}
            </ThemedText>
          )}
        </View>
        
        {/* Description */}
        {currentEvent.description && (
          <View style={styles.descriptionSection}>
            <ThemedText style={styles.sectionTitle}>About</ThemedText>
            <ThemedText style={styles.descriptionText}>
              {currentEvent.description}
            </ThemedText>
          </View>
        )}
        
        {/* Participants */}
        <View style={styles.participantsSection}>
          <ThemedText style={styles.sectionTitle}>
            Participants ({participants.length})
          </ThemedText>
          
          {loadingParticipants ? (
            <ActivityIndicator size="small" color="#6200ee" />
          ) : (
            <View style={styles.participantsList}>
              {participants.length === 0 ? (
                <ThemedText style={styles.emptyText}>
                  No participants yet. Be the first to join!
                </ThemedText>
              ) : (
                participants.slice(0, 5).map((participant) => (
                  <View key={participant.userId} style={styles.participantItem}>
                    <View style={styles.participantAvatar}>
                      <Ionicons name="person" size={20} color="#ffffff" />
                    </View>
                    <ThemedText style={styles.participantName}>
                      {participant.user?.username || 'Anonymous'}
                    </ThemedText>
                  </View>
                ))
              )}
              
              {participants.length > 5 && (
                <TouchableOpacity 
                  style={styles.showMoreButton}
                  onPress={() => router.push('./participants')}
                >
                  <ThemedText style={styles.showMoreText}>
                    Show all participants
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {canManage ? (
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]} 
              onPress={handleEdit}
            >
              <Ionicons name="create-outline" size={16} color="white" />
              <ThemedText style={styles.actionButtonText}>Edit Event</ThemedText>
            </TouchableOpacity>
          ) : isParticipant ? (
            <TouchableOpacity 
              style={[styles.actionButton, styles.leaveButton]} 
              onPress={handleLeave}
            >
              <Ionicons name="exit-outline" size={16} color="white" />
              <ThemedText style={styles.actionButtonText}>Leave Event</ThemedText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.actionButton, styles.joinButton]} 
              onPress={handleJoin}
            >
              <Ionicons name="add-circle-outline" size={16} color="white" />
              <ThemedText style={styles.actionButtonText}>Join Event</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  coverContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  coverImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  organizerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#777777',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  addressText: {
    marginLeft: 30,
    fontSize: 14,
    color: '#777777',
  },
  descriptionSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  participantsSection: {
    marginBottom: 16,
  },
  participantsList: {
    marginTop: 8,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  participantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  participantName: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    color: '#777777',
    fontStyle: 'italic',
  },
  showMoreButton: {
    marginTop: 8,
  },
  showMoreText: {
    color: '#6200ee',
    fontSize: 14,
  },
  actionContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  joinButton: {
    backgroundColor: '#6200ee',
  },
  leaveButton: {
    backgroundColor: '#f44336',
  },
  editButton: {
    backgroundColor: '#2196f3',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
