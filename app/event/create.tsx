import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEvent } from '../../contexts/EventContext';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { 
  Event, 
  EventType, 
  EventPrivacy, 
  MotorcycleType, 
  EventLocation 
} from '@bikr/shared/src/types/event';
// For DateTimePicker, we'd normally use @react-native-community/datetimepicker
// but for this prototype we'll use a simplified version
type DateTimePickerProps = {
  value: Date;
  mode: 'date' | 'time' | 'datetime';
  is24Hour?: boolean;
  onChange: (event: any, date?: Date) => void;
};

// Simplified DateTimePicker component (this would be replaced with the actual package)
const DateTimePicker: React.FC<DateTimePickerProps> = ({ 
  value, 
  onChange 
}) => {
  // In a real app, this would use the native date picker
  // For our prototype, just trigger the onChange immediately with a fake event
  React.useEffect(() => {
    onChange({ type: 'set' }, value);
  }, []);
  
  return null; // No UI needed for our prototype
};

/**
 * Create Event Screen
 * Allows users to create a new event with details
 */
export default function CreateEventScreen() {
  const router = useRouter();
  const { createEvent } = useEvent();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>(EventType.MEETUP);
  const [privacy, setPrivacy] = useState<EventPrivacy>(EventPrivacy.PUBLIC);
  
  // Date & time picker state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000)); // Default to 2 hours after start
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Location state (simplified for now)
  const [location, setLocation] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
  });
  
  // Motorcycle types
  const [allowedMotorcycleTypes, setAllowedMotorcycleTypes] = useState<MotorcycleType[]>([MotorcycleType.ALL]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Validate form fields
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!location.name.trim()) newErrors.locationName = 'Location name is required';
    if (!location.address.trim()) newErrors.locationAddress = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleCreateEvent = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Construct event object
      const eventData: Partial<Event> = {
        title,
        description,
        type: eventType,
        privacy,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: {
          ...location,
          id: Math.random().toString(36).substring(2, 15),
        } as EventLocation,
        isRecurring: false,
        allowedMotorcycleTypes,
      };
      
      // Create event via context
      const createdEvent = await createEvent(eventData);
      
      // Navigate to event detail - use relative path to ensure compatibility
      router.replace({
        pathname: '../event/[eventId]',
        params: { eventId: createdEvent.id }
      });
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({
        form: 'Failed to create event. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle start date change
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    
    if (selectedDate) {
      setStartDate(selectedDate);
      
      // Adjust end date if it's now before start date
      if (selectedDate > endDate) {
        const newEndDate = new Date(selectedDate);
        newEndDate.setHours(newEndDate.getHours() + 2);
        setEndDate(newEndDate);
      }
    }
  };
  
  // Handle end date change
  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    
    if (selectedDate) {
      if (selectedDate <= startDate) {
        setErrors({
          ...errors,
          endDate: 'End date must be after start date',
        });
      } else {
        setEndDate(selectedDate);
        // Clear error if it exists
        if (errors.endDate) {
          const { endDate, ...restErrors } = errors;
          setErrors(restErrors);
        }
      }
    }
  };
  
  // Format dates for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
    });
  };
  
  // Toggle motorcycle type selection
  const toggleMotorcycleType = (type: MotorcycleType) => {
    if (type === MotorcycleType.ALL) {
      setAllowedMotorcycleTypes([MotorcycleType.ALL]);
      return;
    }
    
    // If ALL is currently selected, remove it when selecting specific types
    let updatedTypes = [...allowedMotorcycleTypes];
    if (updatedTypes.includes(MotorcycleType.ALL)) {
      updatedTypes = updatedTypes.filter(t => t !== MotorcycleType.ALL);
    }
    
    // Toggle the selected type
    if (updatedTypes.includes(type)) {
      updatedTypes = updatedTypes.filter(t => t !== type);
      // If no types left, revert to ALL
      if (updatedTypes.length === 0) {
        updatedTypes = [MotorcycleType.ALL];
      }
    } else {
      updatedTypes.push(type);
    }
    
    setAllowedMotorcycleTypes(updatedTypes);
  };
  
  // Render a section heading
  const renderSectionHeading = (title: string) => (
    <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
  );
  
  // Render an error message
  const renderError = (field: string) => {
    if (!errors[field]) return null;
    
    return (
      <ThemedText style={styles.errorText}>{errors[field]}</ThemedText>
    );
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <ThemedView style={styles.container}>
          {/* Title */}
          <View style={styles.section}>
            {renderSectionHeading('Event Title')}
            <TextInput
              style={styles.input}
              placeholder="Enter event title"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            {renderError('title')}
          </View>
          
          {/* Event Type Selection */}
          <View style={styles.section}>
            {renderSectionHeading('Event Type')}
            <View style={styles.eventTypeContainer}>
              {Object.values(EventType).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.eventTypeButton,
                    eventType === type && styles.eventTypeSelected,
                  ]}
                  onPress={() => setEventType(type)}
                >
                  <ThemedText
                    style={[
                      styles.eventTypeText,
                      eventType === type && styles.eventTypeTextSelected,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Description */}
          <View style={styles.section}>
            {renderSectionHeading('Event Description')}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell people what this event is about..."
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              numberOfLines={5}
            />
            {renderError('description')}
          </View>
          
          {/* Date and Time */}
          <View style={styles.section}>
            {renderSectionHeading('Date & Time')}
            
            {/* Start Date */}
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color="#6200ee" />
              <ThemedText style={styles.dateText}>
                Start: {formatDate(startDate)}
              </ThemedText>
            </TouchableOpacity>
            
            {/* End Date */}
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color="#6200ee" />
              <ThemedText style={styles.dateText}>
                End: {formatDate(endDate)}
              </ThemedText>
            </TouchableOpacity>
            {renderError('endDate')}
            
            {/* Date/Time Pickers (Only shown when activated) */}
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="datetime"
                is24Hour={false}
                onChange={onStartDateChange}
              />
            )}
            
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="datetime"
                is24Hour={false}
                onChange={onEndDateChange}
              />
            )}
          </View>
          
          {/* Location */}
          <View style={styles.section}>
            {renderSectionHeading('Location')}
            
            <TextInput
              style={styles.input}
              placeholder="Location name"
              value={location.name}
              onChangeText={(text) => setLocation({...location, name: text})}
            />
            {renderError('locationName')}
            
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={location.address}
              onChangeText={(text) => setLocation({...location, address: text})}
            />
            {renderError('locationAddress')}
            
            <View style={styles.rowInput}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="City"
                value={location.city}
                onChangeText={(text) => setLocation({...location, city: text})}
              />
              
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Country"
                value={location.country}
                onChangeText={(text) => setLocation({...location, country: text})}
              />
            </View>
          </View>
          
          {/* Privacy Settings */}
          <View style={styles.section}>
            {renderSectionHeading('Privacy')}
            <View style={styles.eventTypeContainer}>
              {Object.values(EventPrivacy).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.eventTypeButton,
                    privacy === type && styles.eventTypeSelected,
                  ]}
                  onPress={() => setPrivacy(type)}
                >
                  <ThemedText
                    style={[
                      styles.eventTypeText,
                      privacy === type && styles.eventTypeTextSelected,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Motorcycle Types */}
          <View style={styles.section}>
            {renderSectionHeading('Allowed Motorcycle Types')}
            <View style={styles.checkboxContainer}>
              {Object.values(MotorcycleType).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.checkbox}
                  onPress={() => toggleMotorcycleType(type)}
                >
                  <View style={styles.checkboxInner}>
                    <View 
                      style={[
                        styles.checkboxBox,
                        allowedMotorcycleTypes.includes(type) && styles.checkboxBoxSelected,
                      ]}
                    >
                      {allowedMotorcycleTypes.includes(type) && (
                        <Ionicons name="checkmark" size={12} color="white" />
                      )}
                    </View>
                    <ThemedText style={styles.checkboxText}>
                      {type === MotorcycleType.ALL ? 'All Types' : 
                        type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Form error if any */}
          {errors.form && (
            <ThemedText style={[styles.errorText, { textAlign: 'center', marginTop: 8 }]}>
              {errors.form}
            </ThemedText>
          )}
          
          {/* Create Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateEvent}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="white" />
                <ThemedText style={styles.createButtonText}>Create Event</ThemedText>
              </>
            )}
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  textArea: {
    minHeight: 100,
  },
  rowInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  eventTypeButton: {
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  eventTypeSelected: {
    backgroundColor: '#6200ee',
  },
  eventTypeText: {
    color: '#6200ee',
    fontSize: 14,
  },
  eventTypeTextSelected: {
    color: 'white',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
  },
  checkboxContainer: {
    marginTop: 4,
  },
  checkbox: {
    marginBottom: 8,
  },
  checkboxInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxSelected: {
    backgroundColor: '#6200ee',
  },
  checkboxText: {
    fontSize: 14,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  createButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginVertical: 16,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
