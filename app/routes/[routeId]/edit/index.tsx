import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '../../../../components/ThemedView';
import { Route } from '@bikr/shared/src/types/event';
import { SupabaseEventRepository } from '../../../../repositories/SupabaseEventRepository';
import { RoutePlanner } from '../../../../components/map';

/**
 * Edit screen for a route
 */
export default function RouteEditScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const router = useRouter();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);

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
    } catch (err) {
      console.error('Error fetching route details:', err);
      Alert.alert('Error', 'Failed to load route details. Please try again.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoute = async (updatedRoute: Route) => {
    try {
      await eventRepository.updateRoute(routeId as string, updatedRoute);
      Alert.alert('Success', 'Route updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating route:', error);
      Alert.alert('Error', 'Failed to update route. Please try again.');
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
      </ThemedView>
    );
  }

  if (!route) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <RoutePlanner
            initialRoute={route}
            onRouteSaved={handleSaveRoute}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
