import React from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';
import { Card, XStack, YStack, Text, Avatar, Button, H4, Paragraph } from 'tamagui';
import { useRouter } from 'expo-router';
import { MapPin, Calendar, Users, Clock } from '@tamagui/lucide-icons';
import { useEvent } from '../../contexts/EventContext';
import { Event, EventType, ParticipationStatus, EventPrivacy } from '@bikr/shared/src/types/event';
import { formatDate, formatTime } from '../../utils/date';

interface EventHeaderProps {
  event: Event;
  compact?: boolean;
  showParticipateButton?: boolean;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ 
  event, 
  compact = false,
  showParticipateButton = true
}) => {
  const router = useRouter();
  const { joinEvent, leaveEvent, canManageEvent } = useEvent();
  const [joining, setJoining] = React.useState(false);
  const [leaving, setLeaving] = React.useState(false);
  const [userParticipating, setUserParticipating] = React.useState(false);

  // Determine if user is participating in this event
  // In a real implementation, this would come from checking event participants
  // For now, this is just a placeholder
  React.useEffect(() => {
    // This would be replaced with actual code to check if user is a participant
    setUserParticipating(false);
  }, [event.id]);

  // Handle join event
  const handleJoin = async () => {
    try {
      setJoining(true);
      await joinEvent(event.id, ParticipationStatus.GOING);
      setUserParticipating(true);
    } catch (error) {
      console.error('Failed to join event:', error);
    } finally {
      setJoining(false);
    }
  };

  // Handle leave event
  const handleLeave = async () => {
    try {
      setLeaving(true);
      await leaveEvent(event.id);
      setUserParticipating(false);
    } catch (error) {
      console.error('Failed to leave event:', error);
    } finally {
      setLeaving(false);
    }
  };

  // Handle edit event (navigate to settings page)
  const handleEdit = () => {
    // Using the correct Expo Router navigation format with params
    router.push({
      pathname: '/event/[eventId]/settings',
      params: { eventId: event.id }
    } as any); // Cast to 'any' to bypass TypeScript issue with route type
  };

  // Get event type theme
  const getEventTypeTheme = (type: EventType): string => {
    switch (type) {
      case EventType.MEETUP:
        return 'blue';
      case EventType.GROUP_RIDE:
        return 'green';
      case EventType.TRACK_DAY:
        return 'red';
      case EventType.WORKSHOP:
        return 'purple';
      default:
        return 'gray';
    }
  };

  // Get event privacy theme
  const getPrivacyTheme = (privacy: EventPrivacy): string => {
    switch (privacy) {
      case EventPrivacy.PUBLIC:
        return 'green';
      case EventPrivacy.CLUB:
        return 'blue';
      case EventPrivacy.PRIVATE:
        return 'red';
      default:
        return 'gray';
    }
  };

  // Get human-readable event type
  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case EventType.MEETUP:
        return 'Meet-up';
      case EventType.GROUP_RIDE:
        return 'Group Ride';
      case EventType.TRACK_DAY:
        return 'Track Day';
      case EventType.WORKSHOP:
        return 'Workshop';
      default:
        return 'Event';
    }
  };

  // Get human-readable privacy setting
  const getPrivacyLabel = (privacy: EventPrivacy) => {
    switch (privacy) {
      case EventPrivacy.PUBLIC:
        return 'Public';
      case EventPrivacy.CLUB:
        return 'Club Members';
      case EventPrivacy.PRIVATE:
        return 'Private';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card bordered elevate size="$4" margin="$2">
      {event.coverImageUrl && !compact && (
        <Card.Background>
          <Image
            source={{ uri: event.coverImageUrl }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
        </Card.Background>
      )}
      
      <YStack padding="$4" space="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack space="$2" flex={1}>
            <Button size="$1" theme={getEventTypeTheme(event.type)} disabled chromeless>
              {getEventTypeLabel(event.type)}
            </Button>
            <Button size="$1" theme={getPrivacyTheme(event.privacy)} disabled chromeless>
              {getPrivacyLabel(event.privacy)}
            </Button>
            {event.isRecurring && (
              <Button size="$1" theme="yellow" disabled chromeless>
                Recurring
              </Button>
            )}
          </XStack>
          
          {canManageEvent(event) && (
            <Button size="$2" onPress={handleEdit} theme="gray">
              Edit
            </Button>
          )}
        </XStack>
        
        <H4>{event.title}</H4>
        
        {!compact && (
          <Paragraph theme="alt2" numberOfLines={2}>
            {event.description || 'No description provided'}
          </Paragraph>
        )}
        
        <XStack space="$3" flexWrap="wrap">
          <XStack space="$1" alignItems="center">
            <Calendar size={16} color="$color11" />
            <Text>{formatDate(new Date(event.startDate))}</Text>
          </XStack>
          
          <XStack space="$1" alignItems="center">
            <Clock size={16} color="$color11" />
            <Text>
              {formatTime(new Date(event.startDate))} - {event.endDate ? formatTime(new Date(event.endDate)) : 'TBD'}
            </Text>
          </XStack>
          
          <XStack space="$1" alignItems="center">
            <MapPin size={16} color="$color11" />
            <Text numberOfLines={1}>{event.location?.name || 'Location TBD'}</Text>
          </XStack>
          
          <XStack space="$1" alignItems="center">
            <Users size={16} color="$color11" />
            <Text>{event.participantCount || 0} participants</Text>
          </XStack>
        </XStack>
        
        {showParticipateButton && (
          <XStack marginTop="$2" space="$2">
            {userParticipating ? (
              <Button 
                flex={1} 
                theme="gray" 
                onPress={handleLeave}
                disabled={leaving}
              >
                {leaving ? 'Leaving...' : 'Leave Event'}
              </Button>
            ) : (
              <Button 
                flex={1} 
                theme="blue" 
                onPress={handleJoin}
                disabled={joining}
              >
                {joining ? 'Joining...' : 'Join Event'}
              </Button>
            )}
          </XStack>
        )}
      </YStack>
    </Card>
  );
};

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: 120,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
