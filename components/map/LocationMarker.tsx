import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ThemedView } from '../ThemedView';

// Use require instead of import to avoid TypeScript issues
const { Marker } = require('react-native-maps');

export interface LocationMarkerProps {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
  pinColor?: string;
  onPress?: () => void;
  isSelected?: boolean;
  index?: number;
}

const LocationMarker = ({
  id,
  coordinate,
  title,
  description,
  pinColor = '#FF0000',
  onPress,
  isSelected = false,
  index,
}: LocationMarkerProps) => {
  const markerColor = isSelected ? '#0066FF' : pinColor;

  return (
    <Marker
      identifier={id}
      coordinate={coordinate}
      title={title}
      description={description}
      pinColor={markerColor}
      onPress={onPress}
    >
      {index !== undefined && (
        <ThemedView style={styles.markerIndexContainer}>
          <Text style={styles.markerIndexText}>{index + 1}</Text>
        </ThemedView>
      )}
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerIndexContainer: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerIndexText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LocationMarker;
