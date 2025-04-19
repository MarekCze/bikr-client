import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ThemedView';
import BaseMap from './BaseMap';
import LocationMarker from './LocationMarker';
import RoutePolyline from './RoutePolyline';
import { calculateRouteDistance, calculateEstimatedDuration, getRegionForWaypoints } from '../../services/mapService';
import { Route, RouteWaypoint, EventLocation } from '@bikr/shared/src/types/event';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export interface RoutePlannerProps {
  initialRoute?: Route;
  onRouteSaved: (route: Route) => void;
  style?: any;
}

const RoutePlanner = ({
  initialRoute,
  onRouteSaved,
  style,
}: RoutePlannerProps) => {
  const [routeName, setRouteName] = useState(initialRoute?.name || 'New Route');
  const [waypoints, setWaypoints] = useState<RouteWaypoint[]>(initialRoute?.waypoints || []);
  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(null);

  // Calculate derived values
  const distance = calculateRouteDistance(waypoints);
  const duration = calculateEstimatedDuration(distance);
  
  const handleMapPress = (e: any) => {
    const coordinate = e.nativeEvent.coordinate;
    const newWaypoint: RouteWaypoint = {
      id: `wp_${Date.now()}`,
      routeId: initialRoute?.id || '',
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      order: waypoints.length,
      isPause: false,
    };
    setWaypoints([...waypoints, newWaypoint]);
    setSelectedWaypointId(newWaypoint.id);
  };

  const handleMarkerPress = (waypointId: string) => {
    setSelectedWaypointId(waypointId);
  };

  const handleDeleteWaypoint = (waypointId: string) => {
    const updatedWaypoints = waypoints
      .filter((wp) => wp.id !== waypointId)
      .map((wp, index) => ({ ...wp, order: index }));
    
    setWaypoints(updatedWaypoints);
    setSelectedWaypointId(null);
  };

  const handleMoveWaypointUp = (waypointId: string) => {
    const index = waypoints.findIndex((wp) => wp.id === waypointId);
    if (index <= 0) return;
    
    const updatedWaypoints = [...waypoints];
    const temp = { ...updatedWaypoints[index - 1], order: index };
    updatedWaypoints[index - 1] = { ...updatedWaypoints[index], order: index - 1 };
    updatedWaypoints[index] = temp;
    
    setWaypoints(updatedWaypoints);
  };

  const handleMoveWaypointDown = (waypointId: string) => {
    const index = waypoints.findIndex((wp) => wp.id === waypointId);
    if (index >= waypoints.length - 1) return;
    
    const updatedWaypoints = [...waypoints];
    const temp = { ...updatedWaypoints[index + 1], order: index };
    updatedWaypoints[index + 1] = { ...updatedWaypoints[index], order: index + 1 };
    updatedWaypoints[index] = temp;
    
    setWaypoints(updatedWaypoints);
  };

  const handleToggleWaypointType = (waypointId: string) => {
    const updatedWaypoints = waypoints.map((wp) =>
      wp.id === waypointId ? { ...wp, isPause: !wp.isPause } : wp
    );
    setWaypoints(updatedWaypoints);
  };

  const handleSaveRoute = () => {
    if (waypoints.length < 2) {
      // Should show error: "Route must have at least 2 waypoints"
      return;
    }

    const startPoint = waypoints.find(wp => wp.order === 0);
    const endPoint = waypoints.find(wp => wp.order === waypoints.length - 1);

    if (!startPoint || !endPoint) return;

    const startLocation: EventLocation = {
      id: `start_${Date.now()}`,
      name: 'Start Point',
      address: '',
      city: '',
      country: '',
      latitude: startPoint.latitude,
      longitude: startPoint.longitude,
    };

    const endLocation: EventLocation = {
      id: `end_${Date.now()}`,
      name: 'End Point',
      address: '',
      city: '',
      country: '',
      latitude: endPoint.latitude,
      longitude: endPoint.longitude,
    };

    const route: Route = {
      id: initialRoute?.id || `route_${Date.now()}`,
      name: routeName,
      description: initialRoute?.description || '',
      distance: distance,
      estimatedDuration: duration,
      startPoint: startLocation,
      endPoint: endLocation,
      waypoints: waypoints,
      createdBy: initialRoute?.createdBy || '',
      createdAt: initialRoute?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onRouteSaved(route);
  };

  const sortedWaypoints = [...waypoints].sort((a, b) => a.order - b.order);

  return (
    <ThemedView style={[styles.container, style]}>
      <Text style={styles.title}>Route Planner</Text>
      <Text style={styles.subtitle}>Tap on the map to add waypoints</Text>
      
      <View style={styles.mapContainer}>
        <BaseMap
          initialRegion={waypoints.length > 0 ? getRegionForWaypoints(waypoints) : undefined}
          onPress={handleMapPress}
          markers={waypoints.map((waypoint, index) => ({
            id: waypoint.id,
            coordinate: {
              latitude: waypoint.latitude,
              longitude: waypoint.longitude,
            },
            title: waypoint.isPause ? 'Rest Stop' : `Waypoint ${index + 1}`,
            isSelected: waypoint.id === selectedWaypointId,
            pinColor: waypoint.isPause ? '#FFA500' : '#0066FF',
            onPress: () => handleMarkerPress(waypoint.id),
            index,
          }))}
          polylines={waypoints.length >= 2 ? [
            {
              id: "main-route",
              coordinates: [...waypoints].sort((a, b) => a.order - b.order).map(wp => ({
                latitude: wp.latitude,
                longitude: wp.longitude,
              })),
              strokeColor: "#0066FF",
              strokeWidth: 4,
            }
          ] : []}
        />
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{distance.toFixed(1)} km</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Est. Duration</Text>
          <Text style={styles.statValue}>{Math.round(duration)} min</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Waypoints</Text>
          <Text style={styles.statValue}>{waypoints.length}</Text>
        </View>
      </View>
      
      <ScrollView style={styles.waypointsContainer}>
        {sortedWaypoints.map((waypoint, index) => (
          <View key={waypoint.id} style={[
            styles.waypointItem,
            waypoint.id === selectedWaypointId && styles.selectedWaypointItem
          ]}>
            <Text style={styles.waypointIndex}>{index + 1}</Text>
            <Text style={styles.waypointType}>
              {waypoint.isPause ? 'Rest Stop' : 'Waypoint'}
            </Text>
            <View style={styles.waypointActions}>
              <TouchableOpacity 
                onPress={() => handleToggleWaypointType(waypoint.id)}
                style={styles.iconButton}
              >
                <MaterialIcons 
                  name={waypoint.isPause ? "local-cafe" : "directions"} 
                  size={20} 
                  color="#0066FF" 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleMoveWaypointUp(waypoint.id)}
                style={styles.iconButton}
                disabled={index === 0}
              >
                <MaterialIcons 
                  name="arrow-upward" 
                  size={20} 
                  color={index === 0 ? "#cccccc" : "#0066FF"} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleMoveWaypointDown(waypoint.id)}
                style={styles.iconButton}
                disabled={index === sortedWaypoints.length - 1}
              >
                <MaterialIcons 
                  name="arrow-downward" 
                  size={20} 
                  color={index === sortedWaypoints.length - 1 ? "#cccccc" : "#0066FF"} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleDeleteWaypoint(waypoint.id)}
                style={styles.iconButton}
              >
                <MaterialIcons name="delete" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.actionsContainer}>
        <Button
          title="Clear All"
          onPress={() => setWaypoints([])}
          color="#FF3B30"
        />
        <Button
          title="Save Route"
          onPress={handleSaveRoute}
          disabled={waypoints.length < 2}
        />
      </View>
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
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  waypointsContainer: {
    maxHeight: 200,
    marginBottom: 16,
  },
  waypointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedWaypointItem: {
    backgroundColor: '#f0f8ff',
  },
  waypointIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0066FF',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  waypointType: {
    flex: 1,
  },
  waypointActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default RoutePlanner;
