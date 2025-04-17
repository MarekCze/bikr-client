import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, ActivityIndicator, StyleSheet } from 'react-native'; // Or use Tamagui components
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SupabaseProfileRepository } from '@/repositories/SupabaseProfileRepository';
import { Bike, BikeStatus, BikeType } from 'bikr-shared'; // Import types/enums

// TODO: Replace TextInput with Tamagui Input/Select if available
// TODO: Add validation
// TODO: Add fields for description, imageURL etc. if needed

const profileRepository = new SupabaseProfileRepository();

export default function AddBikeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState<BikeType>(BikeType.STANDARD); // Default type
  const [status, setStatus] = useState<BikeStatus>(BikeStatus.AVAILABLE); // Default status
  const [hourlyRate, setHourlyRate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    // Basic validation
    if (!name || !hourlyRate || isNaN(parseFloat(hourlyRate))) {
        Alert.alert('Invalid Input', 'Please enter a valid name and hourly rate.');
        return;
    }

    const bikeData: Omit<Bike, 'id' | 'owner_id' | 'createdAt' | 'updatedAt'> = {
        name,
        type,
        status,
        hourlyRate: parseFloat(hourlyRate),
        // Add other fields like description, imageUrl if form includes them
    };

    setIsSaving(true);
    setError(null);
    try {
        const newBike = await profileRepository.addBike(bikeData);
        console.log('Bike added:', newBike);
        Alert.alert('Success', 'Bike added to your garage!');
        // Navigate back to garage on success
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('./garage'); // Use relative path
        }
    } catch (err: any) {
        console.error("Failed to add bike:", err);
        setError(err.message || 'Failed to save bike.');
        Alert.alert('Error', 'Could not add bike to garage.');
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
     if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('./garage'); // Use relative path
    }
  };


  // TODO: Replace with Picker or Select components for Type and Status
  const renderTypeSelector = () => (
      <View>
          <ThemedText>Type: {type}</ThemedText>
          {/* Placeholder buttons to cycle type */}
          <Button title="Set Standard" onPress={() => setType(BikeType.STANDARD)} />
          <Button title="Set Road" onPress={() => setType(BikeType.ROAD)} />
          {/* Add other types */}
      </View>
  );
   const renderStatusSelector = () => (
      <View>
          <ThemedText>Status: {status}</ThemedText>
           {/* Placeholder buttons to cycle status */}
          <Button title="Set Available" onPress={() => setStatus(BikeStatus.AVAILABLE)} />
          <Button title="Set Maintenance" onPress={() => setStatus(BikeStatus.MAINTENANCE)} />
           {/* Add other statuses */}
      </View>
  );


  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Add New Bike</ThemedText>

      <View style={styles.form}>
          <ThemedText>Name:</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., My Commuter, Weekend Warrior"
            style={styles.input}
          />
          <ThemedText style={styles.label}>Hourly Rate (£):</ThemedText>
           <TextInput
            value={hourlyRate}
            onChangeText={setHourlyRate}
            placeholder="e.g., 10.50"
            style={styles.input}
            keyboardType="numeric"
          />

          {/* TODO: Replace placeholders with actual Picker/Select components */}
          {renderTypeSelector()}
          {renderStatusSelector()}

          {error && <ThemedText style={styles.errorText}>Error: {error}</ThemedText>}
      </View>

      {/* Replace Button with Tamagui Button if available */}
      <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={handleCancel} disabled={isSaving} />
          <Button title="Add Bike" onPress={handleSave} disabled={isSaving} />
      </View>
       {isSaving && <ActivityIndicator style={{ marginTop: 10 }} />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    form: {
        marginVertical: 20,
    },
    label: {
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        borderRadius: 5,
        // Add theme colors
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    }
});
