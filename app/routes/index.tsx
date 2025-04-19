import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { useRouter } from 'expo-router';
import { SupabaseEventRepository } from '../../repositories/SupabaseEventRepository';
import { Route } from '@bikr/shared/src/types/event';
import { useAuth } from '../../hooks/useAuth';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

/**
 * Route list screen showing all saved routes for the current user
 * and allowing route creation.
 */
export default function RoutesScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize repository
  const eventRepository = new SupabaseEventRepository();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await eventRepository.getUserRoutes(session.user.id);
      setRoutes(response.items);
      setError(null);
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError('Failed to load routes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRouteDetail = (routeId: string) => {
    router.navigate({
      pathname: "../routes/[routeId]",
      params: { routeId }
    });
  };

  const navigateToCreateRoute = () => {
    router.navigate("../routes/create");
  };

  const renderRouteItem = ({ item }: { item: Route }) => (
    <TouchableOpacity
      style={styles.routeItem}
      onPress={() => navigateToRouteDetail(item.id)}
    >
      <View style={styles.routeInfo}>
        <Text style={styles.routeName}>{item.name}</Text>
        <View style={styles.routeStats}>
          <View style={styles.routeStat}>
            <MaterialIcons name="straighten" size={14} color="#666" />
            <Text style={styles.routeStatText}>{item.distance.toFixed(1)} km</Text>
          </View>
          <View style={styles.routeStat}>
            <MaterialIcons name="timer" size={14} color="#666" />
            <Text style={styles.routeStatText}>{Math.round(item.estimatedDuration)} min</Text>
          </View>
          <View style={styles.routeStat}>
            <MaterialIcons name="place" size={14} color="#666" />
            <Text style={styles.routeStatText} numberOfLines={1}>
              {item.startPoint.name} to {item.endPoint.name}
            </Text>
          </View>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchRoutes}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {routes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="map" size={64} color="#999" />
              <Text style={styles.emptyText}>You don't have any saved routes yet.</Text>
              <Text style={styles.emptySubtext}>
                Create a route to plan your next adventure.
              </Text>
            </View>
          ) : (
            <FlatList
              data={routes}
              renderItem={renderRouteItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
            />
          )}

          <TouchableOpacity
            style={styles.fab}
            onPress={navigateToCreateRoute}
          >
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        </>
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    maxWidth: '80%',
  },
  listContent: {
    padding: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  routeStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  routeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  routeStatText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
