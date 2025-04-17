import React from 'react';
import { View, Text, Button } from 'react-native'; // Or use Tamagui components
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView'; // Assuming Themed components exist
import { ThemedText } from '@/components/ThemedText';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleNext = () => {
    // Navigate to the next onboarding step (e.g., interests)
    router.push('/onboarding/interests'); // Adjust route name as needed
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ThemedText type="title">Welcome to bikR!</ThemedText>
      <ThemedText style={{ marginVertical: 20, textAlign: 'center' }}>
        Let's get your profile set up so you can connect with other riders.
      </ThemedText>
      {/* Replace Button with Tamagui Button if available */}
      <Button title="Get Started" onPress={handleNext} />
    </ThemedView>
  );
}
