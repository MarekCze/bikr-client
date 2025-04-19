import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Button, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '../../../components/ThemedView';
import { Route } from '@bikr/shared/src/types/event';
import { SupabaseEventRepository } from '../../../repositories/SupabaseEventRepository';
import { MaterialIcons } from '@expo/vector-icons';
import { BaseMap } from '../../../components/map';

/**
 * Route details screen showing a specific route on a map with details.
 */
export default function RouteDetailScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const router = useRouter();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize repository
  const eventRepository = new SupabaseEventRepository();

  useEffect(() => {
    if (!routeId) return;
    fetchRouteDetails();
  }, [routeId]);

  const fetchRouteDetails = async () => {
    if (!routeId) return;

    setLoading(true);
    try {
      const routeData = await eventRepository.getRouteById(routeId as string);
      setRoute(routeData);
      setError(null);
    } catch (err) {
      console.error('Error fetching route details:', err);
      setError('Failed to load route details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoute = () => {
    if (!route) return;
    // Use navigate instead of push to avoid TypeScript errors
    router.navigate({
      pathname: "../[routeId]/edit",
      params: { routeId: routeId as string }
    });
  };

  const handleDeleteRoute = async () => {
    if (!route) return;

    Alert.alert(
      'Delete Route',
      'Are you sure you want to delete this route? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await eventRepository.deleteRoute(route.id);
              router.back();
            } catch (error) {
              console.error('Error deleting route:', error);
              Alert.alert('Error', 'Failed to delete route. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
      </ThemedView>
    );
  }

  if (error || !route) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Route not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRouteDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // Get region for the map to show all waypoints
  const mapRegion = {
    latitude: (route.startPoint.latitude + route.endPoint.latitude) / 2,
    longitude: (route.startPoint.longitude + route.endPoint.longitude) / 2,
    latitudeDelta: Math.abs(route.startPoint.latitude - route.endPoint.latitude) * 1.5 + 0.01,
    longitudeDelta: Math.abs(route.startPoint.longitude - route.endPoint.longitude) * 1.5 + 0.01,
  };

  // Prepare waypoints for the map
  const sortedWaypoints = [...route.waypoints].sort((a, b) => a.order - b.order);
  const markers = sortedWaypoints.map((waypoint, index) => ({
    id: waypoint.id,
    coordinate: {
      latitude: waypoint.latitude,
      longitude: waypoint.longitude,
    },
    title: waypoint.isPause ? 'Rest Stop' : `Waypoint ${index + 1}`,
    description: '',
    pinColor: waypoint.isPause ? '#FFA500' : '#0066FF',
    index,
  }));

  // Prepare polylines for the map
  const polylines = [
    {
      id: 'route-path',
      coordinates: sortedWaypoints.map((waypoint) => ({
        latitude: waypoint.latitude,
        longitude: waypoint.longitude,
      })),
      strokeColor: '#0066FF',
      strokeWidth: 4,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.mapContainer}>
          <BaseMap
            initialRegion={mapRegion}
            markers={markers}
            polylines={polylines}
            zoomEnabled={true}
            scrollEnabled={true}
            rotateEnabled={true}
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.routeName}>{route.name}</Text>
          {route.description && (
            <Text style={styles.routeDescription}>{route.description}</Text>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialIcons name="straighten" size={24} color="#0066FF" />
              <Text style={styles.statValue}>{route.distance.toFixed(1)} km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons name="timer" size={24} color="#0066FF" />
              <Text style={styles.statValue}>{Math.round(route.estimatedDuration)} min</Text>
              <Text style={styles.statLabel}>Est. Duration</Text>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons name="place" size={24} color="#0066FF" />
              <Text style={styles.statValue}>{route.waypoints.length}</Text>
              <Text style={styles.statLabel}>Waypoints</Text>
            </View>
          </View>

          <View style={styles.routePointsContainer}>
            <View style={styles.routePointItem}>
              <View style={[styles.routePointIcon, styles.startPointIcon]}>
                <MaterialIcons name="trip-origin" size={20} color="white" />
              </View>
              <View style={styles.routePointTextContainer}>
                <Text style={styles.routePointTitle}>Start Point</Text>
                <Text style={styles.routePointAddress}>{route.startPoint.name}</Text>
              </View>
            </View>

            {sortedWaypoints
              .filter((wp) => wp.isPause)
              .map((waypoint) => (
                <View key={waypoint.id} style={styles.routePointItem}>
                  <View style={[styles.routePointIcon, styles.restPointIcon]}>
                    <MaterialIcons name="local-cafe" size={20} color="white" />
                  </View>
                  <View style={styles.routePointTextContainer}>
                    <Text style={styles.routePointTitle}>Rest Stop</Text>
                    <Text style={styles.routePointAddress}>
                      Waypoint {waypoint.order + 1}
                    </Text>
                  </View>
                </View>
              ))}

            <View style={styles.routePointItem}>
              <View style={[styles.routePointIcon, styles.endPointIcon]}>
                <MaterialIcons name="place" size={20} color="white" />
              </View>
              <View style={styles.routePointTextContainer}>
                <Text style={styles.routePointTitle}>End Point</Text>
                <Text style={styles.routePointAddress}>{route.endPoint.name}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEditRoute}
        >
          <MaterialIcons name="edit" size={20} color="white" />
          <Text style={styles.actionButtonText}>Edit Route</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteRoute}
        >
          <MaterialIcons name="delete" size={20} color="white" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0066FF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 300,
    width: '100%',
    marginBottom: 16,
  },
  detailsContainer: {
    padding: 16,
  },
  routeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  routeDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
  routePointsContainer: {
    marginTop: 8,
  },
  routePointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routePointIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  startPointIcon: {
    backgroundColor: '#00C853',
  },
  restPointIcon: {
    backgroundColor: '#FF9800',
  },
  endPointIcon: {
    backgroundColor: '#D32F2F',
  },
  routePointTextContainer: {
    flex: 1,
  },
  routePointTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  routePointAddress: {
    color: '#666',
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#0066FF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
});
