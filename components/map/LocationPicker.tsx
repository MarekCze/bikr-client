import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Button } from 'react-native';
import { ThemedView } from '../ThemedView';
import BaseMap from './BaseMap';
import LocationMarker from './LocationMarker';
import { getCurrentLocation } from '../../services/mapService';
import { EventLocation } from '@bikr/shared/src/types/event';

export interface LocationPickerProps {
  initialLocation?: EventLocation;
  onLocationSelected: (location: EventLocation) => void;
  style?: any;
}

const LocationPicker = ({
  initialLocation,
  onLocationSelected,
  style,
}: LocationPickerProps) => {
  const [selectedLocation, setSelectedLocation] = useState<EventLocation | null>(
    initialLocation || null
  );
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);

  const handleMapPress = (e: any) => {
    const coordinate = e.nativeEvent.coordinate;
    const newLocation: EventLocation = {
      id: selectedLocation?.id || `loc_${Date.now()}`,
      name: selectedLocation?.name || 'Selected Location',
      address: selectedLocation?.address || '',
      city: selectedLocation?.city || '',
      country: selectedLocation?.country || '',
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    };
    setSelectedLocation(newLocation);
  };

  const handleUseCurrentLocation = async () => {
    setIsLoadingCurrentLocation(true);
    try {
      const region = await getCurrentLocation();
      const newLocation: EventLocation = {
        id: selectedLocation?.id || `loc_${Date.now()}`,
        name: selectedLocation?.name || 'My Current Location',
        address: selectedLocation?.address || '',
        city: selectedLocation?.city || '',
        country: selectedLocation?.country || '',
        latitude: region.latitude,
        longitude: region.longitude,
      };
      setSelectedLocation(newLocation);
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsLoadingCurrentLocation(false);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelected(selectedLocation);
    }
  };

  return (
    <ThemedView style={[styles.container, style]}>
      <Text style={styles.title}>Select a Location</Text>
      <Text style={styles.subtitle}>Tap on the map to select a location</Text>
      
      <View style={styles.mapContainer}>
        <BaseMap
          initialRegion={
            selectedLocation
              ? {
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
              : undefined
          }
          onPress={handleMapPress}
          markers={
            selectedLocation
              ? [
                  {
                    id: 'selected',
                    coordinate: {
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                    },
                    title: selectedLocation.name,
                    description: selectedLocation.address,
                  },
                ]
              : []
          }
        />
      </View>
      
      <View style={styles.actionsContainer}>
        <Button
          title={isLoadingCurrentLocation ? "Getting Location..." : "Use Current Location"}
          onPress={handleUseCurrentLocation}
          disabled={isLoadingCurrentLocation}
        />
        <Button
          title="Confirm Location"
          onPress={handleConfirmLocation}
          disabled={!selectedLocation}
        />
      </View>
      
      {selectedLocation && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Selected Location</Text>
          <Text>Latitude: {selectedLocation.latitude.toFixed(6)}</Text>
          <Text>Longitude: {selectedLocation.longitude.toFixed(6)}</Text>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  mapContainer: {
    height: 300,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  infoContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default LocationPicker;
