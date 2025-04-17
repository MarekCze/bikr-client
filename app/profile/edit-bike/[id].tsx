import React, { useState, useEffect, useMemo } from 'react';
import { Alert, ScrollView } from 'react-native'; // Keep Alert, add ScrollView
import { useRouter, useLocalSearchParams } from 'expo-router';
import { YStack, XStack, Button, Spinner, Paragraph, H2, Input, Label, Select, Adapt, Sheet } from 'tamagui'; // Import Tamagui components
import { Check, ChevronDown } from '@tamagui/lucide-icons'; // Icons for Select
import { ThemedView } from '@/components/ThemedView'; // Keep ThemedView for background
import { SupabaseProfileRepository } from '@/repositories/SupabaseProfileRepository'; // Import repository
import { Bike, BikeStatus, BikeType } from 'bikr-shared'; // Import types/enums
import { useAuth } from '@/hooks/useAuth'; // Potentially needed if repo methods require auth context

// TODO: Implement actual getBikeById in repository
// TODO: Add more robust validation

const profileRepository = new SupabaseProfileRepository();

// Helper function to get enum keys
function getEnumKeys<T extends string | number>(e: Record<string, T>): string[] {
    return Object.keys(e).filter(k => typeof e[k as any] === 'number' || typeof e[k as any] === 'string');
}

export default function EditBikeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Get bike ID from route params

  // State for form fields
  const [name, setName] = useState('');
  const [type, setType] = useState<BikeType>(BikeType.STANDARD);
  const [status, setStatus] = useState<BikeStatus>(BikeStatus.AVAILABLE);
  const [hourlyRate, setHourlyRate] = useState('');

  // Loading and error states
  const [isFetching, setIsFetching] = useState(true); // Loading bike data
  const [isSaving, setIsSaving] = useState(false);   // Saving changes
  const [isDeleting, setIsDeleting] = useState(false); // Deleting bike
  const [error, setError] = useState<string | null>(null);

  // Memoize Select items
  const bikeTypeItems = useMemo(() => getEnumKeys(BikeType).map(key => ({ name: key, value: BikeType[key as keyof typeof BikeType] })), []);
  const bikeStatusItems = useMemo(() => getEnumKeys(BikeStatus).map(key => ({ name: key, value: BikeStatus[key as keyof typeof BikeStatus] })), []);

  // Fetch bike data
  useEffect(() => {
    const fetchBikeData = async () => {
      if (!id) {
        setError('Bike ID is missing.');
        setIsFetching(false);
        return;
      }
      setIsFetching(true);
      setError(null);
      try {
        // --- Placeholder Fetch Logic ---
        // In a real scenario, call: const bike = await profileRepository.getBikeById(id);
        // For now, simulate fetching data from the garage list (less efficient but works for UI)
        const garage = await profileRepository.getGarage();
        const bike = garage.find(b => b.id === id);
        // --- End Placeholder ---

        if (bike) {
          setName(bike.name || '');
          setType(bike.type || BikeType.STANDARD);
          setStatus(bike.status || BikeStatus.AVAILABLE);
          setHourlyRate(bike.hourlyRate?.toString() || '');
        } else {
          setError('Bike not found.');
          Alert.alert('Error', 'Could not find bike data.');
        }
      } catch (err: any) {
        console.error("Failed to fetch bike data:", err);
        setError(err.message || 'Failed to load bike data.');
        Alert.alert('Error', 'Could not load bike data.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchBikeData();
  }, [id]);

  const handleSave = async () => {
    if (!id) {
        Alert.alert('Error', 'Bike ID is missing.');
        return;
    }
    // Basic validation
    if (!name.trim() || !hourlyRate.trim() || isNaN(parseFloat(hourlyRate))) {
        Alert.alert('Invalid Input', 'Please enter a valid name and hourly rate.');
        return;
    }

    // Use Partial<Bike> & { id: string } for update payload type
    const bikeData: Partial<Bike> & { id: string } = {
        id, // Include the ID for update
        name: name.trim(),
        type,
        status,
        hourlyRate: parseFloat(hourlyRate),
        // owner_id, createdAt, updatedAt are handled by backend/DB or not needed for update payload
    };

    setIsSaving(true);
    setError(null);
    try {
        const updatedBike = await profileRepository.updateBike(bikeData);
        console.log('Bike updated:', updatedBike);
        Alert.alert('Success', 'Bike updated successfully!');
        // Navigate back to garage on success
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('../garage'); // Fallback using relative path
        }
    } catch (err: any) {
        console.error("Failed to update bike:", err);
        setError(err.message || 'Failed to save bike changes.');
        Alert.alert('Error', 'Could not save bike changes.');
    } finally {
        setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) {
        Alert.alert('Error', 'Bike ID is missing.');
        return;
    }
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this bike?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            setError(null);
            try {
              await profileRepository.deleteBike(id);
              Alert.alert('Success', 'Bike deleted successfully.');
              // Navigate back to garage on success
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('../garage'); // Fallback using relative path
              }
            } catch (err: any) {
              console.error("Failed to delete bike:", err);
              setError(err.message || 'Could not delete the bike.');
              Alert.alert('Error', err.message || 'Could not delete the bike.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
     if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('../garage'); // Fallback using relative path
    }
  };

  const isLoading = isFetching || isSaving || isDeleting; // Combined loading state

  if (isFetching && !error) { // Show initial loading spinner
    return (
        <ThemedView style={{ flex: 1 }}>
            <YStack flex={1} justifyContent="center" alignItems="center">
                <Spinner size="large" />
                <Paragraph marginTop="$2">Loading bike data...</Paragraph>
            </YStack>
        </ThemedView>
    );
  }

  if (error && !isFetching) { // Show error if loading failed
     return (
        <ThemedView style={{ flex: 1 }}>
            <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" space="$3">
                <Paragraph color="$red10" textAlign="center">Error: {error}</Paragraph>
                <Button onPress={handleCancel}>Go Back</Button>
            </YStack>
        </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
        <ScrollView>
            <YStack flex={1} padding="$4" space="$4">
                <H2 textAlign="center">Edit Bike</H2>

                <YStack space="$3" borderWidth={1} borderColor="$gray6" borderRadius="$4" padding="$3" opacity={isLoading ? 0.5 : 1}>
                    <YStack>
                        <Label htmlFor="bikeName">Name</Label>
                        <Input
                            id="bikeName"
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g., My Commuter, Weekend Warrior"
                            disabled={isLoading}
                        />
                    </YStack>
                    <YStack>
                        <Label htmlFor="hourlyRate">Hourly Rate (£)</Label>
                        <Input
                            id="hourlyRate"
                            value={hourlyRate}
                            onChangeText={setHourlyRate}
                            placeholder="e.g., 10.50"
                            keyboardType="numeric"
                            disabled={isLoading}
                        />
                    </YStack>

                    {/* Bike Type Select */}
                    <YStack>
                        <Label htmlFor="bikeType">Type</Label>
                        <Select id="bikeType" value={type?.toString()} onValueChange={(val) => setType(val as BikeType)} disablePreventBodyScroll>
                            {/* Move disabled prop to Trigger */}
                            <Select.Trigger width="100%" iconAfter={ChevronDown} disabled={isLoading}>
                                <Select.Value placeholder="Select Type" />
                            </Select.Trigger>
                            {/* Remove Adapt wrapper */}
                            <Sheet native modal dismissOnSnapToBottom>
                                <Sheet.Frame>
                                    <Sheet.ScrollView>
                                        <Adapt.Contents />
                                    </Sheet.ScrollView>
                                </Sheet.Frame>
                                <Sheet.Overlay />
                            </Sheet>
                            {/* </Adapt> */} {/* Adapt is implicitly handled by Sheet */}
                            <Select.Content zIndex={200000}>
                                <Select.Viewport minWidth={200}>
                                    <Select.Group>
                                        <Select.Label>Bike Type</Select.Label>
                                        {bikeTypeItems.map((item, i) => (
                                            <Select.Item index={i} key={item.name} value={item.value.toString()}>
                                                <Select.ItemText>{item.name}</Select.ItemText>
                                                <Select.ItemIndicator marginLeft="auto">
                                                    <Check size={16} />
                                                </Select.ItemIndicator>
                                            </Select.Item>
                                        ))}
                                    </Select.Group>
                                </Select.Viewport>
                            </Select.Content>
                        </Select>
                    </YStack>

                    {/* Bike Status Select */}
                     <YStack>
                        <Label htmlFor="bikeStatus">Status</Label>
                        <Select id="bikeStatus" value={status?.toString()} onValueChange={(val) => setStatus(val as BikeStatus)} disablePreventBodyScroll>
                             {/* Move disabled prop to Trigger */}
                            <Select.Trigger width="100%" iconAfter={ChevronDown} disabled={isLoading}>
                                <Select.Value placeholder="Select Status" />
                            </Select.Trigger>
                             {/* Remove Adapt wrapper */}
                            <Sheet native modal dismissOnSnapToBottom>
                                <Sheet.Frame>
                                    <Sheet.ScrollView>
                                        <Adapt.Contents />
                                    </Sheet.ScrollView>
                                </Sheet.Frame>
                                <Sheet.Overlay />
                            </Sheet>
                             {/* </Adapt> */} {/* Adapt is implicitly handled by Sheet */}
                            <Select.Content zIndex={200000}>
                                <Select.Viewport minWidth={200}>
                                    <Select.Group>
                                        <Select.Label>Bike Status</Select.Label>
                                        {bikeStatusItems.map((item, i) => (
                                            <Select.Item index={i} key={item.name} value={item.value.toString()}>
                                                <Select.ItemText>{item.name}</Select.ItemText>
                                                <Select.ItemIndicator marginLeft="auto">
                                                    <Check size={16} />
                                                </Select.ItemIndicator>
                                            </Select.Item>
                                        ))}
                                    </Select.Group>
                                </Select.Viewport>
                            </Select.Content>
                        </Select>
                    </YStack>

                    {/* Display save/delete error */}
                    {error && !isFetching && <Paragraph color="$red10" textAlign="center">{error}</Paragraph>}
                </YStack>

                {/* Action Buttons */}
                <XStack justifyContent="space-around" marginTop="$3">
                    <Button onPress={handleCancel} disabled={isLoading} theme="alt1">
                        Cancel
                    </Button>
                    <Button onPress={handleSave} disabled={isLoading} theme="active" icon={isSaving ? () => <Spinner /> : undefined}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </XStack>
                 <YStack marginTop="$2" alignItems="center">
                     <Button onPress={handleDelete} disabled={isLoading} theme="red" icon={isDeleting ? () => <Spinner /> : undefined}>
                        {isDeleting ? 'Deleting...' : 'Delete Bike'}
                    </Button>
                 </YStack>

            </YStack>
        </ScrollView>
    </ThemedView>
  );
}
