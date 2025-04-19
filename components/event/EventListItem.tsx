import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Event, EventPrivacy } from '@bikr/shared/src/types/event';
import { useEvent } from '../../contexts/EventContext';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

interface EventListItemProps {
  event: Event;
  showJoinButton?: boolean;
  onPress?: () => void;
}

/**
 * A card component for displaying an event in a list
 */
export const EventListItem: React.FC<EventListItemProps> = ({ 
  event, 
  showJoinButton = true,
  onPress 
}) => {
  const router = useRouter();
  const { joinEvent, leaveEvent } = useEvent();
  
  // Format dates for display
  const formattedDate = format(new Date(event.startDate), 'MMM d, yyyy');
  const formattedTime = format(new Date(event.startDate), 'h:mm a');
  
  // Determine privacy icon
  const getPrivacyIcon = () => {
    switch (event.privacy) {
      case EventPrivacy.PRIVATE:
        return 'lock-closed-outline';
      case EventPrivacy.CLUB:
        return 'people-outline';
      case EventPrivacy.PUBLIC:
      default:
        return 'globe-outline';
    }
  };
  
  // Handle navigation to event details
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // For now, just console.log as we haven't created the event route yet
      console.log('Navigate to event:', event.id);
      // When routes are set up, we'll use:
      // router.push({
      //   pathname: '/event/[eventId]',
      //   params: { eventId: event.id }
      // });
    }
  };
  
  // Handle joining the event
  const handleJoin = async (e: any) => {
    e.stopPropagation && e.stopPropagation();
    try {
      await joinEvent(event.id);
    } catch (error) {
      console.error('Failed to join event:', error);
      // Show toast or error notification
    }
  };
  
  // Handle leaving the event
  const handleLeave = async (e: any) => {
    e.stopPropagation && e.stopPropagation();
    try {
      await leaveEvent(event.id);
    } catch (error) {
      console.error('Failed to leave event:', error);
      // Show toast or error notification
    }
  };
  
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <ThemedView style={styles.container}>
        {/* Event image or default cover */}
        <View style={styles.imageContainer}>
          {event.coverImageUrl ? (
            <Image 
              source={{ uri: event.coverImageUrl }} 
              style={styles.image} 
              resizeMode="cover" 
            />
          ) : (
            <View style={styles.defaultCover}>
              <Ionicons name="calendar-outline" size={40} color="#ffffff" />
            </View>
          )}
        </View>
        
        {/* Event details */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {event.title}
            </ThemedText>
            <Ionicons name={getPrivacyIcon()} size={16} color="#777777" />
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={14} color="#777777" />
              <ThemedText style={styles.detailText}>{formattedDate}</ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={14} color="#777777" />
              <ThemedText style={styles.detailText}>{formattedTime}</ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={14} color="#777777" />
              <ThemedText style={styles.detailText} numberOfLines={1}>
                {event.location.name}
              </ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="people-outline" size={14} color="#777777" />
              <ThemedText style={styles.detailText}>
                {event.participantCount || 0} {event.participantCount === 1 ? 'person' : 'people'} going
              </ThemedText>
            </View>
          </View>
          
          {/* Join/Leave button (optional) */}
          {showJoinButton && (
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.joinButton} 
                onPress={handleJoin}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.joinButtonText}>Join</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  defaultCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  detailsContainer: {
    marginVertical: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 6,
    color: '#777777',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  joinButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
