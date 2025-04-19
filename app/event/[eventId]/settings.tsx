import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Form, 
  Button, 
  YStack, 
  XStack, 
  Input, 
  TextArea, 
  Switch, 
  Spinner,
  Label,
  Select,
  Sheet
} from 'tamagui';
import { Calendar, MapPin, Clock, AlertTriangle } from '@tamagui/lucide-icons';
import { useEvent } from '../../../contexts/EventContext';
import { ThemedView } from '../../../components/ThemedView';
import { ThemedText } from '../../../components/ThemedText';
import { Event, EventPrivacy, EventType, EventLocation } from '@bikr/shared/src/types/event';

/**
 * Event settings screen to edit event details
 */
export default function EventSettingsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { currentEvent, loadingEvent, fetchEventById, updateEvent, deleteEvent } = useEvent();
  
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const eventId = params.eventId as string;
  
  // Form state
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3600000).toISOString(), // Default to 1 hour later
    isRecurring: false,
    recurringPattern: '',
    privacy: EventPrivacy.PUBLIC,
    type: EventType.MEETUP,
    maxParticipants: 0,
    location: {
      id: crypto.randomUUID(),
      name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      latitude: 0,
      longitude: 0,
    }
  });
  
  // Load event details on component mount
  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId);
    }
  }, [eventId]);
  
  // Update form data when event is loaded
  useEffect(() => {
    if (currentEvent) {
      setFormData({
        ...currentEvent,
      });
    }
  }, [currentEvent]);
  
  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle location field changes
  const handleLocationChange = (field: string, value: any) => {
    setFormData(prev => {
      const updatedLocation = {
        ...prev.location,
        [field]: value
      } as EventLocation;
      
      return {
        ...prev,
        location: updatedLocation
      };
    });
  };
  
  // Handle save event
  const handleSave = async () => {
    if (!eventId || !formData.title || !formData.startDate) {
      return; // Basic validation
    }
    
    setLoading(true);
    try {
      await updateEvent(eventId, formData as Event);
      router.back();
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete event
  const handleDelete = async () => {
    if (!eventId) return;
    
    setDeleteLoading(true);
    try {
      await deleteEvent(eventId);
      router.back();
    } catch (error) {
      console.error('Error deleting event:', error);
      setDeleteConfirmOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Render loading state
  if (loadingEvent || !currentEvent) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <ThemedText>Loading event details...</ThemedText>
      </ThemedView>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <ScrollView style={styles.scrollView} bounces={false}>
        <ThemedView style={styles.container}>
          <Form onSubmit={handleSave}>
            <YStack space="$4" padding="$4">
              <ThemedText type="title">Edit Event</ThemedText>
              
              {/* Title */}
              <YStack space="$2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChangeText={(text) => handleChange('title', text)}
                />
              </YStack>
              
              {/* Description */}
              <YStack space="$2">
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  placeholder="Enter event description"
                  value={formData.description}
                  onChangeText={(text) => handleChange('description', text)}
                  minHeight={100}
                />
              </YStack>
              
              {/* Event Type */}
              <YStack space="$2">
                <Label htmlFor="type">Event Type</Label>
                <Select
                  id="type"
                  value={formData.type}
                  onValueChange={(value) => handleChange('type', value)}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select event type" />
                  </Select.Trigger>
                  
                  <Sheet modal>
                    <Sheet.Frame>
                      <Sheet.ScrollView>
                        <Select.Item index={0} value={EventType.MEETUP}>
                          <Select.ItemText>Meet-up</Select.ItemText>
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
                      </Sheet.ScrollView>
                    </Sheet.Frame>
                  </Sheet>
                </Select>
              </YStack>
              
              {/* Privacy */}
              <YStack space="$2">
                <Label htmlFor="privacy">Privacy</Label>
                <Select
                  id="privacy"
                  value={formData.privacy}
                  onValueChange={(value) => handleChange('privacy', value)}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select privacy setting" />
                  </Select.Trigger>
                  
                  <Sheet modal>
                    <Sheet.Frame>
                      <Sheet.ScrollView>
                        <Select.Item index={0} value={EventPrivacy.PUBLIC}>
                          <Select.ItemText>Public</Select.ItemText>
                        </Select.Item>
                        <Select.Item index={1} value={EventPrivacy.CLUB}>
                          <Select.ItemText>Club Members</Select.ItemText>
                        </Select.Item>
                        <Select.Item index={2} value={EventPrivacy.PRIVATE}>
                          <Select.ItemText>Private</Select.ItemText>
                        </Select.Item>
                      </Sheet.ScrollView>
                    </Sheet.Frame>
                  </Sheet>
                </Select>
              </YStack>
              
              {/* Date & Time Info */}
              <YStack space="$3">
                <Label>Date & Time</Label>
                
                {/* Start Date/Time Info */}
                <XStack space="$2">
                  <YStack space="$1" flex={1}>
                    <XStack space="$2" alignItems="center">
                      <Calendar size={16} />
                      <ThemedText>{formData.startDate ? formatDate(formData.startDate) : 'Select Date'}</ThemedText>
                    </XStack>
                  </YStack>
                  
                  <YStack space="$1" flex={1}>
                    <XStack space="$2" alignItems="center">
                      <Clock size={16} />
                      <ThemedText>{formData.startDate ? formatTime(formData.startDate) : 'Select Time'}</ThemedText>
                    </XStack>
                  </YStack>
                </XStack>
                
                <Label>End Time (Optional)</Label>
                <XStack space="$2">
                  <YStack space="$1" flex={1}>
                    <XStack space="$2" alignItems="center">
                      <Calendar size={16} />
                      <ThemedText>{formData.endDate ? formatDate(formData.endDate) : 'Select Date'}</ThemedText>
                    </XStack>
                  </YStack>
                  
                  <YStack space="$1" flex={1}>
                    <XStack space="$2" alignItems="center">
                      <Clock size={16} />
                      <ThemedText>{formData.endDate ? formatTime(formData.endDate) : 'Select Time'}</ThemedText>
                    </XStack>
                  </YStack>
                </XStack>
                
                <ThemedText style={{color: '#e11d48'}}>* Date/time editing is disabled in this preview</ThemedText>
              </YStack>
              
              {/* Recurring Event */}
              <YStack space="$2">
                <XStack space="$2" alignItems="center">
                  <Label htmlFor="isRecurring">Recurring Event</Label>
                  <Switch
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => handleChange('isRecurring', checked)}
                  />
                </XStack>
                
                {formData.isRecurring && (
                  <Input
                    placeholder="Recurring pattern (e.g., 'Weekly on Mondays')"
                    value={formData.recurringPattern || ''}
                    onChangeText={(text) => handleChange('recurringPattern', text)}
                  />
                )}
              </YStack>
              
              {/* Location */}
              <YStack space="$2">
                <Label>Location</Label>
                
                <XStack space="$2" alignItems="center" marginBottom="$2">
                  <MapPin size={16} />
                  <ThemedText>Location Details</ThemedText>
                </XStack>
                
                <Input
                  placeholder="Location name"
                  value={formData.location?.name || ''}
                  onChangeText={(text) => handleLocationChange('name', text)}
                />
                
                <Input
                  placeholder="Address"
                  value={formData.location?.address || ''}
                  onChangeText={(text) => handleLocationChange('address', text)}
                />
                
                <Input
                  placeholder="City"
                  value={formData.location?.city || ''}
                  onChangeText={(text) => handleLocationChange('city', text)}
                />
                
                <XStack space="$2">
                  <Input
                    flex={1}
                    placeholder="State"
                    value={formData.location?.state || ''}
                    onChangeText={(text) => handleLocationChange('state', text)}
                  />
                  <Input
                    flex={1}
                    placeholder="Zip Code"
                    value={formData.location?.zipCode || ''}
                    onChangeText={(text) => handleLocationChange('zipCode', text)}
                  />
                </XStack>
              </YStack>
              
              {/* Max Participants */}
              <YStack space="$2">
                <Label htmlFor="maxParticipants">Maximum Participants (0 for unlimited)</Label>
                <Input
                  id="maxParticipants"
                  keyboardType="numeric"
                  placeholder="Max participants"
                  value={formData.maxParticipants?.toString() || '0'}
                  onChangeText={(text) => handleChange('maxParticipants', parseInt(text) || 0)}
                />
              </YStack>
              
              {/* Submit Button */}
              <XStack space="$2" marginTop="$4">
                <Button flex={1} theme="blue" disabled={loading} onPress={handleSave}>
                  {loading ? <Spinner /> : 'Save Changes'}
                </Button>
                
                <Button 
                  flex={1} 
                  theme="red" 
                  onPress={() => setDeleteConfirmOpen(true)}
                  disabled={deleteLoading}
                  icon={AlertTriangle}
                >
                  Delete Event
                </Button>
              </XStack>
            </YStack>
          </Form>
        </ThemedView>
      </ScrollView>
      
      {/* Delete Confirmation */}
      <Sheet
        modal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        snapPoints={[30]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          <YStack padding="$4" space="$4">
            <ThemedText type="title">Confirm Deletion</ThemedText>
            <ThemedText>
              Are you sure you want to delete this event? This action cannot be undone.
            </ThemedText>
            <XStack space="$3">
              <Button 
                flex={1} 
                theme="gray"
                onPress={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                flex={1} 
                theme="red"
                onPress={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? <Spinner /> : 'Delete'}
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
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
  }
});
