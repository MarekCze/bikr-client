import React from 'react';
import { View, Text, Button } from 'react-native'; // Or use Tamagui components
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

// TODO: Implement experience level selection UI (slider, radio buttons, etc.)
// TODO: Integrate with ProfileRepository to save experience level

export default function ExperienceScreen() {
  const router = useRouter();

  const handleNext = () => {
    // Navigate to the next onboarding step (e.g., bike setup)
    router.push('/onboarding/bike-setup'); // Adjust route name as needed
  };

  const handleBack = () => {
    // Navigate back to the previous step (interests)
    if (router.canGoBack()) {
        router.back();
    } else {
        // Fallback if cannot go back (e.g., deep link)
        router.replace('/onboarding/interests');
    }
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ThemedText type="title">What's your riding experience?</ThemedText>
      <ThemedText style={{ marginVertical: 20, textAlign: 'center' }}>
        This helps us tailor content for you (e.g., Beginner, Intermediate, Advanced).
      </ThemedText>
      {/* Placeholder for experience selection UI */}
      <View style={{ height: 150, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'grey', marginVertical: 20, width: '80%' }}>
          <ThemedText>(Experience Selection UI Placeholder)</ThemedText>
      </View>
      {/* Replace Button with Tamagui Button if available */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '80%' }}>
          <Button title="Back" onPress={handleBack} />
          <Button title="Next" onPress={handleNext} />
      </View>
    </ThemedView>
  );
}
