import React from 'react';
import { View, Text, Button } from 'react-native'; // Or use Tamagui components
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

// TODO: Fetch bike data based on the ID from params
// TODO: Implement bike form (reuse/adapt from add-bike?)
// TODO: Integrate with ProfileRepository updateBike method
// TODO: Handle success/error states
// TODO: Add delete bike functionality?

export default function EditBikeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Get bike ID from route params

  // Placeholder: Log the ID
  React.useEffect(() => {
    console.log('Editing bike with ID:', id);
    // Fetch bike data here: e.g., const bike = await repo.getBikeById(id);
  }, [id]);

  const handleSave = () => {
    // TODO: Call repository updateBike
    console.log(`Saving bike ${id}...`);
    // Navigate back to garage on success
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/profile/garage'); // Fallback
    }
  };

   const handleDelete = () => {
    // TODO: Implement confirmation dialog
    // TODO: Call repository deleteBike(id)
    console.log(`Deleting bike ${id}...`);
     // Navigate back to garage on success
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/profile/garage'); // Fallback
    }
  };

  const handleCancel = () => {
     if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/profile/garage'); // Fallback
    }
  };

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title">Edit Bike (ID: {id})</ThemedText>

      {/* Placeholder for bike edit form */}
      <View style={{ marginVertical: 20, padding: 15, borderWidth: 1, borderColor: 'grey' }}>
          <ThemedText>(Bike Edit Form Placeholder)</ThemedText>
          {/* Add TextInput fields etc. for make, model, year... */}
      </View>

      {/* Replace Button with Tamagui Button if available */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '90%', alignSelf: 'center', marginBottom: 10 }}>
          <Button title="Cancel" onPress={handleCancel} />
          <Button title="Save Changes" onPress={handleSave} />
      </View>
       <View style={{ alignSelf: 'center' }}>
           <Button title="Delete Bike" color="red" onPress={handleDelete} />
       </View>
    </ThemedView>
  );
}
