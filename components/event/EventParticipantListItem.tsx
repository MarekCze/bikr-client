import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar, Button, XStack, Text, YStack } from 'tamagui';
import { EventParticipation, ParticipationStatus, UUID } from '@bikr/shared/src/types/event';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useAuth } from '../../hooks/useAuth';

type EventParticipantListItemProps = {
  participant: EventParticipation;
  isOrganizer?: boolean;
  onStatusChange?: (userId: UUID, status: ParticipationStatus) => void;
  onRemove?: (userId: UUID) => void;
};

export default function EventParticipantListItem({
  participant,
  isOrganizer = false,
  onStatusChange,
  onRemove,
}: EventParticipantListItemProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isCurrentUser = user?.id === participant.userId;

  const handleProfilePress = () => {
    // Navigate to profile page safely
    if (participant.userId) {
      router.push(`/profile`);
    }
  };

  // Format the participation status for display
  const getStatusText = (status: ParticipationStatus) => {
    switch (status) {
      case ParticipationStatus.GOING:
        return 'Going';
      case ParticipationStatus.INTERESTED:
        return 'Interested';
      case ParticipationStatus.NOT_GOING:
        return 'Not Going';
      case ParticipationStatus.INVITED:
        return 'Invited';
      case ParticipationStatus.WAITLISTED:
        return 'Waitlisted';
      default:
        return 'Unknown';
    }
  };

  // Get color based on status
  const getStatusColor = (status: ParticipationStatus) => {
    switch (status) {
      case ParticipationStatus.GOING:
        return '#4CAF50'; // Green
      case ParticipationStatus.INTERESTED:
        return '#2196F3'; // Blue
      case ParticipationStatus.NOT_GOING:
        return '#F44336'; // Red
      case ParticipationStatus.INVITED:
        return '#9C27B0'; // Purple
      case ParticipationStatus.WAITLISTED:
        return '#FF9800'; // Orange
      default:
        return '#757575'; // Grey
    }
  };

  // Safe access to user properties with fallbacks
  const userFullName = participant.user?.fullName || 'Unknown User';
  const avatarUrl = participant.user?.avatarUrl;
  const displayInitial = userFullName.charAt(0) || 'U';

  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={handleProfilePress}>
        <XStack alignItems="center" space="$3">
          <Avatar circular size="$6">
            {avatarUrl ? (
              <Avatar.Image src={avatarUrl} />
            ) : (
              <Avatar.Fallback>
                <Text fontSize="$4">{displayInitial}</Text>
              </Avatar.Fallback>
            )}
          </Avatar>
          
          <YStack flex={1}>
            <ThemedText numberOfLines={1} style={{ fontWeight: '500', fontSize: 16 }}>
              {userFullName}
            </ThemedText>
            <XStack alignItems="center" space="$2">
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(participant.status) }]} />
              <ThemedText style={{ fontSize: 14, color: '$gray10' }}>
                {getStatusText(participant.status)}
              </ThemedText>
            </XStack>
          </YStack>
          
          {isOrganizer && !isCurrentUser && (
            <XStack space="$2">
              {onStatusChange && (
                <Button 
                  size="$3"
                  variant="outlined" 
                  onPress={() => {
                    // In a real app, this would show a dropdown or modal to select status
                    onStatusChange(participant.userId, 
                      participant.status === ParticipationStatus.GOING 
                        ? ParticipationStatus.NOT_GOING 
                        : ParticipationStatus.GOING);
                  }}
                >
                  Status
                </Button>
              )}
              
              {onRemove && (
                <Button 
                  size="$3"
                  variant="outlined" 
                  theme="red"
                  onPress={() => onRemove(participant.userId)}
                >
                  Remove
                </Button>
              )}
            </XStack>
          )}
        </XStack>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
