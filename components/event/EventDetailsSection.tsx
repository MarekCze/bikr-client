import React from 'react';
import { StyleSheet, Linking } from 'react-native';
import { YStack, Card, Text, Paragraph, Button, XStack, Separator } from 'tamagui';
import { MapPin, Calendar, Clock, Info, Users, Map } from '@tamagui/lucide-icons';
import { Event, EventType } from '@bikr/shared/src/types/event';
import { formatDate, formatTime } from '../../utils/date';

// Extended event type with optional fields for different event types
interface ExtendedEventInfo {
  routeInfo?: {
    distance?: number;
    estimatedDuration?: number;
    elevationGain?: number;
  };
  experienceLevel?: string;
  trackLength?: number;
  topics?: string[];
  instructor?: string;
  materialsRequired?: string;
}

interface EventDetailsSectionProps {
  event: Event;
  onShowRoute?: () => void;
  onShowMap?: () => void;
}

export const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  event,
  onShowRoute,
  onShowMap,
}) => {
  // Create a cast of event to include optional type-specific fields
  const extendedEvent = event as unknown as Event & ExtendedEventInfo;
  
  // Format event description with line breaks
  const formattedDescription = event.description
    ? event.description.split('\n').map((line, index) => (
        <Paragraph key={index} marginVertical="$1">
          {line}
        </Paragraph>
      ))
    : <Paragraph>No description provided.</Paragraph>;

  // Open location in maps app
  const openInMaps = () => {
    if (event.location) {
      const { latitude, longitude, name } = event.location;
      const url = `https://maps.google.com/?q=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  // Get event type specific details
  const renderEventTypeDetails = () => {
    switch (event.type) {
      case EventType.GROUP_RIDE:
        return (
          <Card bordered marginTop="$3">
            <Card.Header>
              <XStack alignItems="center" space="$2">
                <Map size={20} color="$blue10" />
                <Text fontSize={16} fontWeight="bold">
                  Route Information
                </Text>
              </XStack>
            </Card.Header>
            <Card.Footer padding="$3">
              <YStack space="$3" width="100%">
                <XStack space="$2" alignItems="center">
                  <Text theme="alt2">Distance:</Text>
                  <Text>{extendedEvent.routeInfo?.distance || 'TBD'} km</Text>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <Text theme="alt2">Estimated Duration:</Text>
                  <Text>{extendedEvent.routeInfo?.estimatedDuration || 'TBD'} min</Text>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <Text theme="alt2">Elevation Gain:</Text>
                  <Text>{extendedEvent.routeInfo?.elevationGain || 'TBD'} m</Text>
                </XStack>
                <Button onPress={onShowRoute} theme="blue" marginTop="$2">
                  View Route Map
                </Button>
              </YStack>
            </Card.Footer>
          </Card>
        );
      case EventType.TRACK_DAY:
        return (
          <Card bordered marginTop="$3">
            <Card.Header>
              <XStack alignItems="center" space="$2">
                <Info size={20} color="$red10" />
                <Text fontSize={16} fontWeight="bold">
                  Track Day Details
                </Text>
              </XStack>
            </Card.Header>
            <Card.Footer padding="$3">
              <YStack space="$3" width="100%">
                <XStack space="$2" alignItems="center">
                  <Text theme="alt2">Track:</Text>
                  <Text>{event.location?.name}</Text>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <Text theme="alt2">Experience Level:</Text>
                  <Text>{extendedEvent.experienceLevel || 'All Levels'}</Text>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <Text theme="alt2">Track Length:</Text>
                  <Text>{extendedEvent.trackLength || 'TBD'} km</Text>
                </XStack>
              </YStack>
            </Card.Footer>
          </Card>
        );
      case EventType.WORKSHOP:
        return (
          <Card bordered marginTop="$3">
            <Card.Header>
              <XStack alignItems="center" space="$2">
                <Info size={20} color="$purple10" />
                <Text fontSize={16} fontWeight="bold">
                  Workshop Details
                </Text>
              </XStack>
            </Card.Header>
            <Card.Footer padding="$3">
              <YStack space="$3" width="100%">
                <XStack space="$2" alignItems="center">
                  <Text theme="alt2">Topics:</Text>
                  <Text>{extendedEvent.topics?.join(', ') || 'TBD'}</Text>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <Text theme="alt2">Instructor:</Text>
                  <Text>{extendedEvent.instructor || 'TBD'}</Text>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <Text theme="alt2">Materials Required:</Text>
                  <Text>{extendedEvent.materialsRequired || 'None'}</Text>
                </XStack>
              </YStack>
            </Card.Footer>
          </Card>
        );
      default:
        return null;
    }
  };

  // Render schedule items if available
  const renderSchedule = () => {
    if (!event.schedule || event.schedule.length === 0) {
      return null;
    }

    return (
      <Card bordered marginTop="$3">
        <Card.Header>
          <XStack alignItems="center" space="$2">
            <Clock size={20} color="$color" />
            <Text fontSize={16} fontWeight="bold">
              Event Schedule
            </Text>
          </XStack>
        </Card.Header>
        <YStack padding="$3" space="$3">
          {event.schedule?.map((item, index) => (
            <YStack key={index} space="$1">
              <Text fontWeight="bold">{item.title}</Text>
              <XStack space="$2" alignItems="center">
                <Clock size={14} color="$color11" />
                <Text fontSize={14}>
                  {formatTime(new Date(item.startTime))}
                  {item.endTime ? ` - ${formatTime(new Date(item.endTime))}` : ''}
                </Text>
              </XStack>
              {item.description && (
                <Paragraph theme="alt2" fontSize={14}>
                  {item.description}
                </Paragraph>
              )}
              {event.schedule && index < event.schedule.length - 1 && <Separator marginVertical="$2" />}
            </YStack>
          ))}
        </YStack>
      </Card>
    );
  };

  return (
    <YStack space="$3" padding="$2">
      {/* Description Section */}
      <Card bordered>
        <Card.Header>
          <XStack alignItems="center" space="$2">
            <Info size={20} color="$color" />
            <Text fontSize={16} fontWeight="bold">
              About This Event
            </Text>
          </XStack>
        </Card.Header>
        <Card.Footer padding="$3">
          <YStack>
            {formattedDescription}
          </YStack>
        </Card.Footer>
      </Card>

      {/* Date & Time Details */}
      <Card bordered>
        <Card.Header>
          <XStack alignItems="center" space="$2">
            <Calendar size={20} color="$color" />
            <Text fontSize={16} fontWeight="bold">
              Date & Time
            </Text>
          </XStack>
        </Card.Header>
        <Card.Footer padding="$3">
          <YStack space="$3">
            <XStack space="$2" alignItems="center">
              <Text theme="alt2">Date:</Text>
              <Text>{formatDate(new Date(event.startDate))}</Text>
            </XStack>
            <XStack space="$2" alignItems="center">
              <Text theme="alt2">Time:</Text>
              <Text>
                {formatTime(new Date(event.startDate))} - {event.endDate ? formatTime(new Date(event.endDate)) : 'TBD'}
              </Text>
            </XStack>
            {event.isRecurring && (
              <XStack space="$2" alignItems="center">
                <Text theme="alt2">Recurring:</Text>
                <Text>{event.recurringPattern || 'Yes'}</Text>
              </XStack>
            )}
          </YStack>
        </Card.Footer>
      </Card>

      {/* Location Details */}
      <Card bordered>
        <Card.Header>
          <XStack alignItems="center" space="$2">
            <MapPin size={20} color="$color" />
            <Text fontSize={16} fontWeight="bold">
              Location
            </Text>
          </XStack>
        </Card.Header>
        <Card.Footer padding="$3">
          <YStack space="$3" width="100%">
            <Text fontWeight="bold">{event.location?.name || 'Location TBD'}</Text>
            <Text>
              {event.location?.address}
              {event.location?.city && `, ${event.location.city}`}
              {event.location?.state && `, ${event.location.state}`}
              {event.location?.zipCode && ` ${event.location.zipCode}`}
            </Text>
            <XStack space="$2">
              <Button flex={1} onPress={openInMaps} theme="blue">
                Open in Maps
              </Button>
              {onShowMap && (
                <Button flex={1} onPress={onShowMap} theme="gray">
                  View Map
                </Button>
              )}
            </XStack>
          </YStack>
        </Card.Footer>
      </Card>

      {/* Event Type Specific Details */}
      {renderEventTypeDetails()}

      {/* Schedule if available */}
      {renderSchedule()}

      {/* Participant Information */}
      <Card bordered marginTop="$2">
        <Card.Header>
          <XStack alignItems="center" space="$2">
            <Users size={20} color="$color" />
            <Text fontSize={16} fontWeight="bold">
              Participants
            </Text>
          </XStack>
        </Card.Header>
        <Card.Footer padding="$3">
          <YStack space="$3" width="100%">
            <XStack space="$2" alignItems="center">
              <Text theme="alt2">Attendees:</Text>
              <Text>{event.participantCount || 0}</Text>
            </XStack>
            {event.maxParticipants && (
              <XStack space="$2" alignItems="center">
                <Text theme="alt2">Maximum Capacity:</Text>
                <Text>{event.maxParticipants}</Text>
              </XStack>
            )}
            <Button theme="gray" marginTop="$2" onPress={() => {}}>
              View All Participants
            </Button>
          </YStack>
        </Card.Footer>
      </Card>
    </YStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
