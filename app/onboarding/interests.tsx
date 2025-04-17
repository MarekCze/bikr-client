import React from 'react';
import { View, Text, Button } from 'react-native'; // Or use Tamagui components
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

// TODO: Implement interest selection UI (checkboxes, tags, etc.)
// TODO: Fetch interests if dynamic, or use a predefined list
// TODO: Integrate with ProfileRepository to save selected interests

export default function InterestsScreen() {
  const router = useRouter();

  const handleNext = () => {
    // Navigate to the next onboarding step (e.g., experience)
    router.push('/onboarding/experience'); // Adjust route name as needed
  };

  const handleSkip = () => {
    // Optionally allow skipping this step
    handleNext(); // Or navigate directly to the next required step
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ThemedText type="title">What are your interests?</ThemedText>
      <ThemedText style={{ marginVertical: 20, textAlign: 'center' }}>
        Select a few things you're interested in (e.g., Touring, Track Days, Custom Builds).
      </ThemedText>
      {/* Placeholder for interest selection UI */}
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'grey', marginVertical: 20, width: '80%' }}>
          <ThemedText>(Interest Selection UI Placeholder)</ThemedText>
      </View>
      {/* Replace Button with Tamagui Button if available */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '80%' }}>
          <Button title="Skip" onPress={handleSkip} />
          <Button title="Next" onPress={handleNext} />
      </View>
    </ThemedView>
  );
}
