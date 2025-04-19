import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, XStack, YStack, Separator } from 'tamagui';
import { Clock, MapPin } from '@tamagui/lucide-icons';
import { ThemedText } from '../ThemedText';
import { EventScheduleItem as ScheduleItemType } from '@bikr/shared/src/types/event';

interface EventScheduleItemProps {
  item: ScheduleItemType;
  isLast?: boolean;
}

export default function EventScheduleItem({ item, isLast = false }: EventScheduleItemProps) {
  // Format the time to a readable format
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  return (
    <YStack space="$2">
      <Card bordered padding="$3" elevation="$1">
        <YStack space="$2">
          <ThemedText type="defaultSemiBold" numberOfLines={1}>
            {item.title}
          </ThemedText>
          
          <XStack space="$2" alignItems="center">
            <Clock size={16} />
            <ThemedText>
              {formatTime(item.startTime)}
              {item.endTime ? ` - ${formatTime(item.endTime)}` : ''}
            </ThemedText>
          </XStack>
          
          {item.location && (
            <XStack space="$2" alignItems="center">
              <MapPin size={16} />
              <ThemedText numberOfLines={1}>
                {item.location.name || item.location.address}
              </ThemedText>
            </XStack>
          )}
          
          {item.description && (
            <ThemedText style={styles.description} numberOfLines={3}>
              {item.description}
            </ThemedText>
          )}
        </YStack>
      </Card>
      
      {!isLast && (
        <XStack alignItems="center" justifyContent="center">
          <YStack width={2} height={24} backgroundColor="$gray7" />
        </XStack>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  description: {
    marginTop: 4,
    fontSize: 14,
  },
});
