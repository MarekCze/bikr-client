import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { ThemedView } from '../ThemedView';
import { DEFAULT_MAP_REGION, getCurrentLocation } from '../../services/mapService';

// Use require instead of import to avoid TypeScript issues with react-native-maps
const MapView = require('react-native-maps').default;
const { Marker, Polyline } = require('react-native-maps');

// Define types for props
export interface BaseMapProps {
  initialRegion?: any;
  showUserLocation?: boolean;
  scrollEnabled?: boolean;
  zoomEnabled?: boolean;
  rotateEnabled?: boolean;
  markers?: BaseMapMarker[];
  polylines?: BaseMapPolyline[];
  onRegionChangeComplete?: (region: any) => void;
  onPress?: (e: any) => void;
  onLongPress?: (e: any) => void;
  style?: any;
  testID?: string;
}

export interface BaseMapMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
  pinColor?: string;
  onPress?: () => void;
}

export interface BaseMapPolyline {
  id: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }[];
  strokeColor?: string;
  strokeWidth?: number;
}

const BaseMap = ({
  initialRegion,
  showUserLocation = true,
  scrollEnabled = true,
  zoomEnabled = true,
  rotateEnabled = true,
  markers = [],
  polylines = [],
  onRegionChangeComplete,
  onPress,
  onLongPress,
  style,
  testID,
}: BaseMapProps) => {
  const [region, setRegion] = useState(initialRegion || DEFAULT_MAP_REGION);
  const [isLoading, setIsLoading] = useState(!initialRegion);

  useEffect(() => {
    if (!initialRegion) {
      fetchUserLocation();
    }
  }, [initialRegion]);

  const fetchUserLocation = async () => {
    try {
      const currentRegion = await getCurrentLocation();
      setRegion(currentRegion);
    } catch (error) {
      console.error('Error fetching user location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionChangeComplete = (newRegion: any) => {
    setRegion(newRegion);
    if (onRegionChangeComplete) {
      onRegionChangeComplete(newRegion);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      <MapView
        style={styles.map}
        provider="google"
        region={region}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={showUserLocation}
        scrollEnabled={scrollEnabled}
        zoomEnabled={zoomEnabled}
        rotateEnabled={rotateEnabled}
        onRegionChangeComplete={handleRegionChangeComplete}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={marker.pinColor}
            onPress={marker.onPress}
          />
        ))}

        {polylines.map((polyline) => (
          <Polyline
            key={polyline.id}
            coordinates={polyline.coordinates}
            strokeColor={polyline.strokeColor || '#000'}
            strokeWidth={polyline.strokeWidth || 3}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BaseMap;
