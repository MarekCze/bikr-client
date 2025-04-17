import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native'; // Or use Tamagui components
import { useRouter, Link } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Bike, BikeStatus, BikeType } from 'bikr-shared'; // Import Enums
import { SupabaseProfileRepository } from '@/repositories/SupabaseProfileRepository'; // Import repository
import { useAuth } from '@/hooks/useAuth'; // Needed if getGarage depends on user ID implicitly

// TODO: Implement actual UI for bike list items (maybe a dedicated component)
// TODO: Implement Add/Edit bike screens fully
// TODO: Implement delete bike functionality

const profileRepository = new SupabaseProfileRepository();

export default function GarageScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Get user if needed for repository calls
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGarage = async () => {
      // Assuming getGarage implicitly uses the authenticated user or doesn't need ID
      // If it needs ID, pass user.id
      if (!user) {
          setError("User not authenticated");
          setIsLoading(false);
          return;
      }
      setIsLoading(true);
      setError(null);
      try {
        // Call the actual repository method (currently returns empty array)
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

  const renderItem = ({ item }: { item: Bike }) => (
      <View style={styles.bikeItem}>
          <View>
            <ThemedText style={styles.bikeName}>{item.name}</ThemedText>
            <ThemedText style={styles.bikeDetails}>Type: {item.type} | Status: {item.status}</ThemedText>
          </View>
          {/* Use relative path for dynamic route */}
          <Link href={`./edit-bike/${item.id}`} asChild>
              <Button title="Edit" />
          </Link>
      </View>
  );

  const goToAddBike = () => {
      // Use relative path
      router.push('./add-bike');
  };

   const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" style={{ marginTop: 30 }} />;
    }
    if (error) {
      return <ThemedText style={styles.errorText}>Error: {error}</ThemedText>;
    }
    return (
       <FlatList
          data={bikes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<ThemedText style={styles.emptyText}>No bikes added yet.</ThemedText>}
          contentContainerStyle={{ flexGrow: 1 }} // Ensure empty text shows correctly
      />
    );
   };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
          <ThemedText type="title">My Garage</ThemedText>
          <Button title="Add Bike" onPress={goToAddBike} />
      </View>

      {renderContent()}

       {/* Back button */}
       <View style={styles.footer}>
            {/* Use relative path */}
           <Button title="Back to Profile" onPress={() => router.replace('./')} />
       </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 5, // Add some padding
    },
    footer: {
        marginTop: 20,
        paddingHorizontal: 5,
    },
    bikeItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#eee', // Use theme color later
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bikeName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bikeDetails: {
        fontSize: 13,
        color: 'grey', // Use theme color later
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: 'grey',
    },
    errorText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: 'red',
    }
});
