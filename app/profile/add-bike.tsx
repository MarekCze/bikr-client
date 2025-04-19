import React, { useState, useMemo } from 'react';
import { Alert, ScrollView } from 'react-native'; // Keep Alert, add ScrollView
import { useRouter } from 'expo-router';
import { YStack, XStack, Button, Spinner, Paragraph, H2, Input, Label, Select, Adapt, Sheet } from 'tamagui'; // Import Tamagui components
import { Check, ChevronDown } from '@tamagui/lucide-icons'; // Icons for Select
import { ThemedView } from '@/components/ThemedView'; // Keep ThemedView for background
import { SupabaseProfileRepository } from '@/repositories/SupabaseProfileRepository';
import { Bike, BikeStatus, BikeType } from '@bikr/shared'; // Use package name for import
import { useAuth } from '@/hooks/useAuth'; // Needed for owner_id implicitly

// TODO: Add validation (basic added)
// TODO: Add fields for description, imageURL etc. if needed

const profileRepository = new SupabaseProfileRepository();

// Helper function to get enum keys
function getEnumKeys<T extends string | number>(e: Record<string, T>): string[] {
    return Object.keys(e).filter(k => typeof e[k as any] === 'number' || typeof e[k as any] === 'string');
}

export default function AddBikeScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Get user context
  const [name, setName] = useState('');
  const [type, setType] = useState<BikeType>(BikeType.STANDARD); // Default type
  const [status, setStatus] = useState<BikeStatus>(BikeStatus.AVAILABLE); // Default status
  const [hourlyRate, setHourlyRate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize Select items
  const bikeTypeItems = useMemo(() => getEnumKeys(BikeType).map(key => ({ name: key, value: BikeType[key as keyof typeof BikeType] })), []);
  const bikeStatusItems = useMemo(() => getEnumKeys(BikeStatus).map(key => ({ name: key, value: BikeStatus[key as keyof typeof BikeStatus] })), []);


  const handleSave = async () => {
    // Basic validation
    if (!name.trim() || !hourlyRate.trim() || isNaN(parseFloat(hourlyRate))) {
        Alert.alert('Invalid Input', 'Please enter a valid name and hourly rate.');
        return;
    }
     if (!user) {
        Alert.alert('Error', 'User not authenticated.');
        return;
    }

    const bikeData: Omit<Bike, 'id' | 'owner_id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        type,
        status,
        hourlyRate: parseFloat(hourlyRate),
        // Add other fields like description, imageUrl if form includes them
    };

    setIsSaving(true);
    setError(null);
    try {
        const newBike = await profileRepository.addBike(bikeData);
        console.log('Bike added:', newBike);
        Alert.alert('Success', 'Bike added to your garage!');
        // Navigate back to garage on success
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('./garage'); // Use relative path
        }
    } catch (err: any) {
        console.error("Failed to add bike:", err);
        setError(err.message || 'Failed to save bike.');
        Alert.alert('Error', 'Could not add bike to garage.');
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
     if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('./garage'); // Use relative path
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
        <ScrollView>
            <YStack flex={1} padding="$4" space="$4">
                <H2 textAlign="center">Add New Bike</H2>

                <YStack space="$3" borderWidth={1} borderColor="$gray6" borderRadius="$4" padding="$3">
                    <YStack>
                        <Label htmlFor="bikeName">Name</Label>
                        <Input
                            id="bikeName"
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g., My Commuter, Weekend Warrior"
                            disabled={isSaving}
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
                            disabled={isSaving}
                        />
                    </YStack>

                    {/* Bike Type Select */}
                    <YStack>
                        <Label htmlFor="bikeType">Type</Label>
                        <Select id="bikeType" value={type.toString()} onValueChange={(val) => setType(val as BikeType)} disablePreventBodyScroll>
                            <Select.Trigger width="100%" iconAfter={ChevronDown}>
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
                        <Select id="bikeStatus" value={status.toString()} onValueChange={(val) => setStatus(val as BikeStatus)} disablePreventBodyScroll>
                            <Select.Trigger width="100%" iconAfter={ChevronDown}>
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

                    {/* Add other fields like description, imageURL if needed */}

                    {error && <Paragraph color="$red10" textAlign="center">{error}</Paragraph>}
                </YStack>

                {/* Action Buttons */}
                <XStack justifyContent="space-around" marginTop="$3">
                    <Button onPress={handleCancel} disabled={isSaving} theme="alt1">
                        Cancel
                    </Button>
                    <Button onPress={handleSave} disabled={isSaving} theme="active" icon={isSaving ? () => <Spinner /> : undefined}>
                        {isSaving ? 'Adding...' : 'Add Bike'}
                    </Button>
                </XStack>

            </YStack>
        </ScrollView>
    </ThemedView>
  );
}

// StyleSheet removed
