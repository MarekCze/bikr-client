import React, { useState, useEffect } from 'react';
import { Alert, ScrollView } from 'react-native'; // Keep Alert, add ScrollView
import { useRouter, Link } from 'expo-router';
import { YStack, XStack, Button, Spinner, Paragraph, H2, Separator, ListItem } from 'tamagui'; // Import Tamagui components
import { ThemedView } from '@/components/ThemedView'; // Keep ThemedView for background
import { Bike, BikeStatus, BikeType } from 'bikr-shared'; // Import Enums
import { SupabaseProfileRepository } from '@/repositories/SupabaseProfileRepository'; // Import repository
import { useAuth } from '@/hooks/useAuth'; // Needed if getGarage depends on user ID implicitly

// TODO: Implement Add/Edit bike screens fully (Edit partially done)

const profileRepository = new SupabaseProfileRepository();

export default function GarageScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Get user if needed for repository calls
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGarage = async () => {
      if (!user) {
          setError("User not authenticated");
          setIsLoading(false);
          return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const fetchedBikes = await profileRepository.getGarage();
        setBikes(fetchedBikes);
      } catch (err: any) {
        console.error("Failed to fetch garage:", err);
        setError(err.message || 'Failed to load garage.');
        Alert.alert('Error', 'Could not load your garage.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGarage();
  }, [user]); // Refetch if user changes

  const handleDeleteBike = async (bikeId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this bike?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Show loading state specifically for delete? For now, just reuse main one.
            // Consider adding a per-item loading state if needed.
            setIsLoading(true);
            try {
              await profileRepository.deleteBike(bikeId);
              setBikes((currentBikes) => currentBikes.filter((bike) => bike.id !== bikeId));
              Alert.alert('Success', 'Bike deleted successfully.');
            } catch (err: any) {
              console.error("Failed to delete bike:", err);
              Alert.alert('Error', err.message || 'Could not delete the bike.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const goToAddBike = () => {
      router.push('./add-bike'); // Use relative path
  };

   const renderContent = () => {
    if (isLoading) {
      return <Spinner size="large" marginTop="$4" />;
    }
    if (error) {
      return <Paragraph color="$red10" textAlign="center" marginTop="$4">Error: {error}</Paragraph>;
    }
    if (bikes.length === 0) {
        return <Paragraph textAlign="center" marginTop="$4" color="$gray10">No bikes added yet.</Paragraph>;
    }

    // Using ScrollView + map instead of FlatList for simplicity with Tamagui
    return (
       <YStack space="$2" marginTop="$3">
          {bikes.map((item, index) => (
            <React.Fragment key={item.id}>
                <XStack
                    paddingVertical="$3"
                    paddingHorizontal="$2"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <YStack flex={1} marginRight="$2">
                        <Paragraph fontWeight="bold" fontSize="$5">{item.name}</Paragraph>
                        <Paragraph size="$2" color="$gray10">
                            Type: {item.type} | Status: {item.status}
                        </Paragraph>
                    </YStack>
                    <XStack space="$2">
                        <Link href={`./edit-bike/${item.id}`} asChild>
                            <Button size="$2" theme="alt1">Edit</Button>
                        </Link>
                        <Button
                            size="$2"
                            theme="red_active" // Use a red theme for delete
                            onPress={() => handleDeleteBike(item.id)}
                            disabled={isLoading} // Disable while any loading is happening
                        >
                            Delete
                        </Button>
                    </XStack>
                </XStack>
                {index < bikes.length - 1 && <Separator />}
            </React.Fragment>
          ))}
       </YStack>
    );
   };

  return (
    <ThemedView style={{ flex: 1 }}>
        <ScrollView>
            <YStack flex={1} padding="$4" space="$4">
                <XStack justifyContent="space-between" alignItems="center">
                    <H2>My Garage</H2>
                    <Button onPress={goToAddBike} theme="active">Add Bike</Button>
                </XStack>

                {renderContent()}

                {/* Back button */}
                <YStack marginTop="$4">
                    <Button onPress={() => router.replace('./')} theme="alt1">Back to Profile</Button>
                </YStack>
            </YStack>
        </ScrollView>
    </ThemedView>
  );
}

// StyleSheet removed - styling done inline with Tamagui props
