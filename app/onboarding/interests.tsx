import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native'; // Or use Tamagui components
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SupabaseProfileRepository } from '@/repositories/SupabaseProfileRepository'; // Import repository
import { useAuth } from '@/hooks/useAuth'; // To get user ID if needed

// Predefined list of interests
const INTERESTS_LIST = [
  'Touring', 'Cruising', 'Sport Riding', 'Track Days', 'Off-Road',
  'Adventure (ADV)', 'Custom Builds', 'Vintage Bikes', 'Maintenance', 'Racing',
  'Commuting', 'Group Rides'
];

const profileRepository = new SupabaseProfileRepository();

export default function InterestsScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Get user context
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = async () => {
    if (!user) {
        Alert.alert('Error', 'User not authenticated.');
        return;
    }
    setIsLoading(true);
    try {
      // Save selected interests to the profile
      await profileRepository.updateProfile({ interests: selectedInterests });
      console.log('Interests saved:', selectedInterests);
      // Navigate to the next onboarding step
      router.push('./experience'); // Use relative path
    } catch (error: any) {
      console.error('Failed to save interests:', error);
      Alert.alert('Error', error.message || 'Could not save interests.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Skip saving and navigate directly
    router.push('./experience'); // Use relative path
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">What are your interests?</ThemedText>
      <ThemedText style={styles.subtitle}>
        Select a few things you're interested in. This helps us tailor your experience.
      </ThemedText>

      <View style={styles.interestsContainer}>
        {INTERESTS_LIST.map((interest) => (
          <Pressable
            key={interest}
            style={[
              styles.interestTag,
              selectedInterests.includes(interest) && styles.selectedTag,
            ]}
            onPress={() => toggleInterest(interest)}
            disabled={isLoading}
          >
            <Text style={[
                styles.tagText,
                selectedInterests.includes(interest) && styles.selectedTagText
            ]}>
              {interest}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}

      {/* Replace Button with Tamagui Button if available */}
      <View style={styles.buttonContainer}>
          <Button title="Skip" onPress={handleSkip} disabled={isLoading} />
          <Button title="Next" onPress={handleNext} disabled={isLoading || selectedInterests.length === 0} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center', // Remove to allow scrolling if needed
    alignItems: 'center',
    padding: 20,
    paddingTop: 40, // Add padding top
  },
  subtitle: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 16,
    color: 'grey', // Use theme color later
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
    width: '90%',
  },
  interestTag: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc', // Use theme color later
    backgroundColor: '#f0f0f0', // Use theme color later
    margin: 5,
  },
  selectedTag: {
    backgroundColor: '#007bff', // Example blue selection
    borderColor: '#0056b3',
  },
  tagText: {
    fontSize: 14,
    color: '#333', // Use theme color later
  },
  selectedTagText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 30, // Add margin top
  },
});
