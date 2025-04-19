import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native'; // Or use Tamagui components
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SupabaseProfileRepository } from '@/repositories/SupabaseProfileRepository';
import { Bike, BikeStatus, BikeType } from '../../../bikr-shared'; // Import types/enums
import { useAuth } from '@/hooks/useAuth'; // Needed for owner_id

// TODO: Replace TextInput with Tamagui Input/Select if available
// TODO: Add validation (basic added)
// TODO: Add fields for description, imageURL etc. if needed

const profileRepository = new SupabaseProfileRepository();

export default function BikeSetupScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Get user context
  const [name, setName] = useState('');
  const [type, setType] = useState<BikeType>(BikeType.STANDARD); // Default type
  const [status, setStatus] = useState<BikeStatus>(BikeStatus.AVAILABLE); // Default status
  const [hourlyRate, setHourlyRate] = useState(''); // Assuming hourly rate is still relevant here? Or maybe remove for onboarding? Keeping for now.
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToNextStep = () => {
      router.push('./permissions'); // Use relative path
  };

  const handleSaveAndNext = async () => {
    // Basic validation
    if (!name || !hourlyRate || isNaN(parseFloat(hourlyRate))) {
        Alert.alert('Invalid Input', 'Please enter a valid name and hourly rate.');
        return;
    }
     if (!user) {
        Alert.alert('Error', 'User not authenticated.');
        return;
    }

    // Note: owner_id is added by the repository method based on the authenticated user
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
        console.log('Bike added during onboarding:', newBike);
        Alert.alert('Success', 'Bike added!');
        goToNextStep(); // Navigate to next screen on successful save
    } catch (err: any) {
        console.error("Failed to add bike:", err);
        setError(err.message || 'Failed to save bike.');
        Alert.alert('Error', 'Could not add bike.');
    } finally {
        setIsSaving(false);
    }
  };

  const handleSkip = () => {
    // Allow skipping adding a bike initially
    goToNextStep();
  };

  const handleBack = () => {
    // Navigate back to the previous step (experience)
    if (router.canGoBack()) {
        router.back();
    } else {
        // Fallback if cannot go back
        router.replace('./experience'); // Use relative path
    }
  };

  // TODO: Replace with Picker or Select components for Type and Status
  const renderTypeSelector = () => (
      <View style={styles.selectorContainer}>
          <ThemedText style={styles.label}>Type:</ThemedText>
          {/* Placeholder buttons to cycle type */}
          <View style={styles.selectorButtons}>
              <Button title="Standard" onPress={() => setType(BikeType.STANDARD)} disabled={type === BikeType.STANDARD || isSaving} />
              <Button title="Road" onPress={() => setType(BikeType.ROAD)} disabled={type === BikeType.ROAD || isSaving} />
              {/* Add other types */}
          </View>
      </View>
  );
   const renderStatusSelector = () => (
      <View style={styles.selectorContainer}>
          <ThemedText style={styles.label}>Status:</ThemedText>
           {/* Placeholder buttons to cycle status */}
           <View style={styles.selectorButtons}>
              <Button title="Available" onPress={() => setStatus(BikeStatus.AVAILABLE)} disabled={status === BikeStatus.AVAILABLE || isSaving} />
              <Button title="Maintenance" onPress={() => setStatus(BikeStatus.MAINTENANCE)} disabled={status === BikeStatus.MAINTENANCE || isSaving} />
              {/* Add other statuses */}
           </View>
      </View>
  );

  return (
    <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <ThemedText type="title">Add your first bike (Optional)</ThemedText>
            <ThemedText style={styles.subtitle}>
                Tell us about your ride! You can add more later in your profile.
            </ThemedText>

            <View style={styles.form}>
                <ThemedText style={styles.label}>Bike Name:</ThemedText>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., My Commuter, Weekend Warrior"
                    style={styles.input}
                    editable={!isSaving}
                />
                <ThemedText style={styles.label}>Hourly Rate (£):</ThemedText>
                <TextInput
                    value={hourlyRate}
                    onChangeText={setHourlyRate}
                    placeholder="e.g., 10.50"
                    style={styles.input}
                    keyboardType="numeric"
                    editable={!isSaving}
                />

                {/* TODO: Replace placeholders with actual Picker/Select components */}
                {renderTypeSelector()}
                {renderStatusSelector()}

                {error && <ThemedText style={styles.errorText}>Error: {error}</ThemedText>}
            </View>

            {isSaving && <ActivityIndicator style={{ marginVertical: 15 }} />}

            {/* Replace Button with Tamagui Button if available */}
            <View style={styles.buttonContainer}>
                <Button title="Back" onPress={handleBack} disabled={isSaving} />
                <Button title="Save & Next" onPress={handleSaveAndNext} disabled={isSaving || !name || !hourlyRate} />
            </View>
            <View style={styles.skipButtonContainer}>
                <Button title="Skip for now" onPress={handleSkip} disabled={isSaving} />
            </View>
        </ScrollView>
    </ThemedView>
  );
}

// Combine and adapt styles from add-bike.tsx
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center', // Center content horizontally
    },
    subtitle: {
        marginVertical: 15,
        textAlign: 'center',
        fontSize: 16,
        color: 'grey', // Use theme color later
    },
    form: {
        marginVertical: 20,
        width: '90%', // Control form width
    },
    label: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 16,
        // Add theme colors
    },
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        // Add theme colors
    },
    selectorContainer: {
        marginTop: 15,
    },
    selectorButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow buttons to wrap
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%',
        marginTop: 20,
    },
    skipButtonContainer: {
        marginTop: 15,
        width: '90%',
        alignItems: 'center', // Center skip button
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    }
});
