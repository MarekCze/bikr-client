import React, { useState } from 'react';
import { ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Button,
  Form,
  Input,
  Select,
  TextArea,
  YStack,
  XStack,
  Switch,
  Text,
  Separator,
} from 'tamagui';
import { Calendar, MapPin, Shield } from '@tamagui/lucide-icons';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Event, EventPrivacy, EventType, MotorcycleType, UUID } from '@bikr/shared/src/types/event';
import { useAuth } from '../../hooks/useAuth';

interface EventSettingsFormProps {
  initialData?: Partial<Event>;
  onSubmit: (eventData: Partial<Event>) => Promise<void>;
  onDelete?: () => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
}

export default function EventSettingsForm({
  initialData,
  onSubmit,
  onDelete,
  isLoading = false,
  isEditing = false,
}: EventSettingsFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [eventType, setEventType] = useState<EventType>(initialData?.type || EventType.MEETUP);
  const [privacy, setPrivacy] = useState<EventPrivacy>(initialData?.privacy || EventPrivacy.PUBLIC);
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(initialData?.startDate ? 
    new Date(initialData.startDate).toTimeString().split(' ')[0].substring(0, 5) : 
    new Date().toTimeString().split(' ')[0].substring(0, 5));
  const [endDate, setEndDate] = useState(initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '');
  const [endTime, setEndTime] = useState(initialData?.endDate ? 
    new Date(initialData.endDate).toTimeString().split(' ')[0].substring(0, 5) : '');
  const [isRecurring, setIsRecurring] = useState(initialData?.isRecurring || false);
  const [maxParticipants, setMaxParticipants] = useState(initialData?.maxParticipants?.toString() || '');
  const [location, setLocation] = useState({
    name: initialData?.location?.name || '',
    address: initialData?.location?.address || '',
    city: initialData?.location?.city || '',
    state: initialData?.location?.state || '',
    country: initialData?.location?.country || '',
    zipCode: initialData?.location?.zipCode || '',
    latitude: initialData?.location?.latitude || 0,
    longitude: initialData?.location?.longitude || 0,
  });
  const [allowedMotorcycleTypes, setAllowedMotorcycleTypes] = useState<MotorcycleType[]>(
    initialData?.allowedMotorcycleTypes || [MotorcycleType.ALL]
  );
  
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  const handleSubmit = async () => {
    // Basic validation
    if (!title.trim()) {
      alert('Please enter a title for the event');
      return;
    }
    
    if (!description.trim()) {
      alert('Please enter a description for the event');
      return;
    }
    
    if (!location.name || !location.address || !location.city || !location.country) {
      alert('Please complete the location information');
      return;
    }
    
    // Combine date and time
    const startDateTime = new Date(`${startDate}T${startTime}`).toISOString();
    const endDateTime = endDate ? new Date(`${endDate}T${endTime || startTime}`).toISOString() : undefined;
    
    // Prepare the data
    const eventData: Partial<Event> = {
      title,
      description,
      type: eventType,
      privacy,
      startDate: startDateTime,
      endDate: endDateTime,
      isRecurring,
      maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : undefined,
      location: {
        id: initialData?.location?.id || '',
        name: location.name,
        address: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
        zipCode: location.zipCode,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      allowedMotorcycleTypes,
      // These properties will be set by the server if creating a new event
      organizerId: user?.id || '',
    };
    
    try {
      await onSubmit(eventData);
      if (!isEditing) {
        router.back();
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    }
  };
  
  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      await onDelete();
      router.back();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };
  
  const motorcycleTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  };
  
  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <Form onSubmit={handleSubmit}>
          <YStack space="$3" paddingBottom="$6">
            {/* Basic Information */}
            <ThemedText type="subtitle">Basic Information</ThemedText>
            <Separator />
            
            <Input
              placeholder="Event Title"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="words"
              maxLength={80}
            />
            
            <TextArea
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              minHeight={120}
              autoCapitalize="sentences"
            />
            
            <Select
              id="event-type"
              value={eventType}
              onValueChange={(value: string) => setEventType(value as EventType)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select Event Type" />
              </Select.Trigger>
              
              <Select.Content>
                <Select.Item index={0} value={EventType.MEETUP}>
                  <Select.ItemText>Meetup</Select.ItemText>
                </Select.Item>
                <Select.Item index={1} value={EventType.GROUP_RIDE}>
                  <Select.ItemText>Group Ride</Select.ItemText>
                </Select.Item>
                <Select.Item index={2} value={EventType.TRACK_DAY}>
                  <Select.ItemText>Track Day</Select.ItemText>
                </Select.Item>
                <Select.Item index={3} value={EventType.WORKSHOP}>
                  <Select.ItemText>Workshop</Select.ItemText>
                </Select.Item>
              </Select.Content>
            </Select>
            
            {/* Privacy and Permissions */}
            <ThemedText type="subtitle">Privacy and Permissions</ThemedText>
            <Separator />
            
            <Select
              id="privacy"
              value={privacy}
              onValueChange={(value: string) => setPrivacy(value as EventPrivacy)}
            >
              <Select.Trigger icon={Shield}>
                <Select.Value placeholder="Select Privacy Setting" />
              </Select.Trigger>
              
              <Select.Content>
                <Select.Item index={0} value={EventPrivacy.PUBLIC}>
                  <Select.ItemText>Public - Anyone can see and join</Select.ItemText>
                </Select.Item>
                <Select.Item index={1} value={EventPrivacy.PRIVATE}>
                  <Select.ItemText>Private - Invite only</Select.ItemText>
                </Select.Item>
                <Select.Item index={2} value={EventPrivacy.CLUB}>
                  <Select.ItemText>Club Members - Only club members can see and join</Select.ItemText>
                </Select.Item>
              </Select.Content>
            </Select>
            
            <XStack alignItems="center" space="$3">
              <ThemedText>Max Participants:</ThemedText>
              <Input
                style={styles.numericInput}
                placeholder="No limit"
                value={maxParticipants}
                onChangeText={setMaxParticipants}
                keyboardType="numeric"
              />
            </XStack>
            
            {/* Date and Time */}
            <ThemedText type="subtitle">Date and Time</ThemedText>
            <Separator />
            
            <YStack space="$2">
              <ThemedText>Start Date</ThemedText>
              <Input
                placeholder="YYYY-MM-DD"
                value={startDate}
                onChangeText={setStartDate}
                keyboardType={Platform.OS === 'ios' ? 'default' : 'numeric'}
              />
            </YStack>
            
            <YStack space="$2">
              <ThemedText>Start Time</ThemedText>
              <Input
                placeholder="HH:MM"
                value={startTime}
                onChangeText={setStartTime}
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
              />
            </YStack>
            
            <YStack space="$2">
              <ThemedText>End Date (Optional)</ThemedText>
              <Input
                placeholder="YYYY-MM-DD"
                value={endDate}
                onChangeText={setEndDate}
                keyboardType={Platform.OS === 'ios' ? 'default' : 'numeric'}
              />
            </YStack>
            
            <YStack space="$2">
              <ThemedText>End Time (Optional)</ThemedText>
              <Input
                placeholder="HH:MM"
                value={endTime}
                onChangeText={setEndTime}
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
              />
            </YStack>
            
            <XStack alignItems="center" space="$3">
              <Switch 
                checked={isRecurring} 
                onCheckedChange={setIsRecurring}
              />
              <ThemedText>This is a recurring event</ThemedText>
            </XStack>
            
            {/* Location */}
            <ThemedText type="subtitle">Location</ThemedText>
            <Separator />
            
            <Input
              placeholder="Location Name"
              value={location.name}
              onChangeText={(text) => setLocation({ ...location, name: text })}
              autoCapitalize="words"
            />
            
            <Input
              placeholder="Address"
              value={location.address}
              onChangeText={(text) => setLocation({ ...location, address: text })}
              autoCapitalize="words"
            />
            
            <XStack space="$2">
              <Input
                flex={1}
                placeholder="City"
                value={location.city}
                onChangeText={(text) => setLocation({ ...location, city: text })}
                autoCapitalize="words"
              />
              <Input
                flex={1}
                placeholder="State/Province"
                value={location.state}
                onChangeText={(text) => setLocation({ ...location, state: text })}
                autoCapitalize="words"
              />
            </XStack>
            
            <XStack space="$2">
              <Input
                flex={1}
                placeholder="Country"
                value={location.country}
                onChangeText={(text) => setLocation({ ...location, country: text })}
                autoCapitalize="words"
              />
              <Input
                flex={1}
                placeholder="ZIP/Postal Code"
                value={location.zipCode}
                onChangeText={(text) => setLocation({ ...location, zipCode: text })}
              />
            </XStack>
            
            <Button
              onPress={() => {
                // Here you would typically show a map picker
                // For now we'll just set dummy coordinates
                setLocation({
                  ...location,
                  latitude: 40.7128,
                  longitude: -74.0060,
                });
              }}
              icon={MapPin}
              theme="light"
            >
              Set Location on Map
            </Button>
            
            {/* Motorcycle Types */}
            <ThemedText type="subtitle">Motorcycle Types</ThemedText>
            <Separator />
            
            <ThemedText style={{ fontSize: 14 }} lightColor="#707070" darkColor="#B0B0B0">
              Select which motorcycle types are allowed at this event
            </ThemedText>
            
            <XStack flexWrap="wrap" gap="$2">
              {Object.values(MotorcycleType).map((type) => (
                <Button
                  key={type}
                  variant="outlined"
                  theme={allowedMotorcycleTypes.includes(type) ? "blue" : "gray"}
                  onPress={() => {
                    if (type === MotorcycleType.ALL) {
                      setAllowedMotorcycleTypes([MotorcycleType.ALL]);
                    } else {
                      const newTypes = allowedMotorcycleTypes.includes(type)
                        ? allowedMotorcycleTypes.filter(t => t !== type)
                        : [...allowedMotorcycleTypes.filter(t => t !== MotorcycleType.ALL), type];
                      
                      setAllowedMotorcycleTypes(newTypes.length ? newTypes : [MotorcycleType.ALL]);
                    }
                  }}
                  size="$3"
                >
                  {motorcycleTypeLabel(type)}
                </Button>
              ))}
            </XStack>
            
            {/* Submit Button */}
            <YStack space="$4" marginTop="$4">
              <Button 
                theme="blue"
                onPress={handleSubmit}
                disabled={isLoading}
                opacity={isLoading ? 0.7 : 1}
              >
                {isLoading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
              </Button>
              
              {isEditing && onDelete && (
                <>
                  {!showDeleteConfirmation ? (
                    <Button
                      theme="red"
                      variant="outlined"
                      onPress={() => setShowDeleteConfirmation(true)}
                    >
                      Delete Event
                    </Button>
                  ) : (
                    <YStack space="$2">
                      <ThemedText style={{ textAlign: 'center' }} lightColor="#F44336" darkColor="#FF6659">
                        Are you sure? This cannot be undone.
                      </ThemedText>
                      <XStack space="$2">
                        <Button flex={1} theme="gray" onPress={() => setShowDeleteConfirmation(false)}>
                          Cancel
                        </Button>
                        <Button flex={1} theme="red" onPress={handleDelete}>
                          Yes, Delete
                        </Button>
                      </XStack>
                    </YStack>
                  )}
                </>
              )}
            </YStack>
          </YStack>
        </Form>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  numericInput: {
    width: 100,
  },
});
