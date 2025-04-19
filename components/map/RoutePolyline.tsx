import React from 'react';
import { RouteWaypoint } from '@bikr/shared/src/types/event';

// Use require instead of import to avoid TypeScript issues
const { Polyline } = require('react-native-maps');

export interface RoutePolylineProps {
  waypoints: RouteWaypoint[];
  strokeColor?: string;
  strokeWidth?: number;
  id: string;
}

const RoutePolyline = ({
  waypoints,
  strokeColor = '#0066FF',
  strokeWidth = 4,
  id,
}: RoutePolylineProps) => {
  if (!waypoints || waypoints.length < 2) {
    return null;
  }

  // Sort waypoints by order property
  const sortedWaypoints = [...waypoints].sort((a, b) => a.order - b.order);

  // Convert to required format for Polyline
  const coordinates = sortedWaypoints.map((waypoint) => ({
    latitude: waypoint.latitude,
    longitude: waypoint.longitude,
  }));

  return (
    <Polyline
      key={id}
      coordinates={coordinates}
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
      lineCap="round"
      lineJoin="round"
    />
  );
};

export default RoutePolyline;
