import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native'; // Or use Tamagui components
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SupabaseProfileRepository } from '@/repositories/SupabaseProfileRepository'; // Import repository
import { useAuth } from '@/hooks/useAuth'; // To get user ID if needed

// Define experience levels
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const profileRepository = new SupabaseProfileRepository();

export default function ExperienceScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Get user context
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (!selectedLevel) {
      Alert.alert('Selection Required', 'Please select your experience level.');
      return;
    }
    if (!user) {
        Alert.alert('Error', 'User not authenticated.');
        return;
    }
    setIsLoading(true);
    try {
      // Save selected experience level to the profile
      await profileRepository.updateProfile({ experienceLevel: selectedLevel });
      console.log('Experience level saved:', selectedLevel);
      // Navigate to the next onboarding step
      router.push('./bike-setup'); // Use relative path
    } catch (error: any) {
      console.error('Failed to save experience level:', error);
      Alert.alert('Error', error.message || 'Could not save experience level.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Navigate back to the previous step (interests)
    if (router.canGoBack()) {
        router.back();
    } else {
        // Fallback if cannot go back (e.g., deep link)
        router.replace('./interests'); // Use relative path
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">What's your riding experience?</ThemedText>
      <ThemedText style={styles.subtitle}>
        This helps us tailor content for you.
      </ThemedText>

      <View style={styles.levelsContainer}>
        {EXPERIENCE_LEVELS.map((level) => (
          <Pressable
            key={level}
            style={[
              styles.levelButton,
              selectedLevel === level && styles.selectedLevelButton,
            ]}
            onPress={() => setSelectedLevel(level)}
            disabled={isLoading}
          >
            <Text style={[
                styles.levelText,
                selectedLevel === level && styles.selectedLevelText
            ]}>
              {level}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}

      {/* Replace Button with Tamagui Button if available */}
      <View style={styles.buttonContainer}>
          <Button title="Back" onPress={handleBack} disabled={isLoading} />
          <Button title="Next" onPress={handleNext} disabled={isLoading || !selectedLevel} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center', // Remove to allow vertical arrangement
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  subtitle: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 16,
    color: 'grey', // Use theme color later
  },
  levelsContainer: {
    marginVertical: 20,
    width: '80%',
    alignItems: 'stretch', // Make buttons take full width available
  },
  levelButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc', // Use theme color later
    backgroundColor: '#f0f0f0', // Use theme color later
    marginVertical: 8,
    alignItems: 'center', // Center text horizontally
  },
  selectedLevelButton: {
    backgroundColor: '#007bff', // Example blue selection
    borderColor: '#0056b3',
  },
  levelText: {
    fontSize: 16,
    color: '#333', // Use theme color later
  },
  selectedLevelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 30,
  },
});
