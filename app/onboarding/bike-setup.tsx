import React from 'react';
import { View, Text, Button } from 'react-native'; // Or use Tamagui components
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

// TODO: Implement bike setup form (make, model, year, optional photo)
// TODO: Integrate with ProfileRepository addBike method
// TODO: Handle potential errors from repository

export default function BikeSetupScreen() {
  const router = useRouter();

  const handleNext = () => {
    // Navigate to the next onboarding step (e.g., permissions)
    router.push('/onboarding/permissions'); // Adjust route name as needed
  };

  const handleSkip = () => {
    // Allow skipping adding a bike initially
    handleNext();
  };

  const handleBack = () => {
    // Navigate back to the previous step (experience)
    if (router.canGoBack()) {
        router.back();
    } else {
        // Fallback if cannot go back
        router.replace('/onboarding/experience');
    }
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ThemedText type="title">Add your first bike (Optional)</ThemedText>
      <ThemedText style={{ marginVertical: 20, textAlign: 'center' }}>
        Tell us about your ride! You can add more later in your profile.
      </ThemedText>
      {/* Placeholder for bike form UI */}
      <View style={{ height: 250, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'grey', marginVertical: 20, width: '80%' }}>
          <ThemedText>(Bike Form UI Placeholder)</ThemedText>
      </View>
      {/* Replace Button with Tamagui Button if available */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '80%', marginBottom: 10 }}>
          <Button title="Back" onPress={handleBack} />
          <Button title="Next" onPress={handleNext} />
      </View>
       <Button title="Skip for now" onPress={handleSkip} />
    </ThemedView>
  );
}
