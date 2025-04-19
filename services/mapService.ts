import * as Location from 'expo-location';
import { EventLocation, Route, RouteWaypoint } from '@bikr/shared/src/types/event';

// Default map region (centered on Europe as a fallback)
export const DEFAULT_MAP_REGION = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Calculate distance between two coordinates in kilometers using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Convert from EventLocation to MapView region
export const locationToRegion = (location: EventLocation) => {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
};

// Get current user location
export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return DEFAULT_MAP_REGION;
  }
};

// Calculate total route distance
export const calculateRouteDistance = (waypoints: RouteWaypoint[]): number => {
  if (!waypoints || waypoints.length < 2) return 0;

  // Sort waypoints by order
  const sortedWaypoints = [...waypoints].sort((a, b) => a.order - b.order);

  let totalDistance = 0;
  for (let i = 0; i < sortedWaypoints.length - 1; i++) {
    const current = sortedWaypoints[i];
    const next = sortedWaypoints[i + 1];
    totalDistance += calculateDistance(
      current.latitude,
      current.longitude,
      next.latitude,
      next.longitude
    );
  }

  return Math.round(totalDistance * 10) / 10; // Round to 1 decimal place
};

// Calculate estimated duration based on distance (assumes average motorcycle speed of 60 km/h)
export const calculateEstimatedDuration = (distanceKm: number): number => {
  const averageSpeedKmPerHour = 60;
  return Math.round((distanceKm / averageSpeedKmPerHour) * 60); // Convert to minutes
};

// Get map region that contains all waypoints
export const getRegionForWaypoints = (waypoints: RouteWaypoint[]) => {
  if (!waypoints || waypoints.length === 0) {
    return DEFAULT_MAP_REGION;
  }

  if (waypoints.length === 1) {
    return {
      latitude: waypoints[0].latitude,
      longitude: waypoints[0].longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }

  let minLat = waypoints[0].latitude;
  let maxLat = waypoints[0].latitude;
  let minLng = waypoints[0].longitude;
  let maxLng = waypoints[0].longitude;

  waypoints.forEach((waypoint) => {
    minLat = Math.min(minLat, waypoint.latitude);
    maxLat = Math.max(maxLat, waypoint.latitude);
    minLng = Math.min(minLng, waypoint.longitude);
    maxLng = Math.max(maxLng, waypoint.longitude);
  });

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  
  // Add padding
  const latDelta = (maxLat - minLat) * 1.5 || 0.0922;
  const lngDelta = (maxLng - minLng) * 1.5 || 0.0421;

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
};

// Function to format coordinates to a standardized string
export const formatCoordinates = (latitude: number, longitude: number): string => {
  return `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
};

// Function to parse coordinates string to numbers
export const parseCoordinates = (coordinatesString: string): { latitude: number; longitude: number } | null => {
  if (!coordinatesString) return null;
  
  const parts = coordinatesString.split(',');
  if (parts.length !== 2) return null;
  
  const latitude = parseFloat(parts[0]);
  const longitude = parseFloat(parts[1]);
  
  if (isNaN(latitude) || isNaN(longitude)) return null;
  
  return { latitude, longitude };
};

export default {
  DEFAULT_MAP_REGION,
  calculateDistance,
  locationToRegion,
  getCurrentLocation,
  calculateRouteDistance,
  calculateEstimatedDuration,
  getRegionForWaypoints,
  formatCoordinates,
  parseCoordinates,
};
