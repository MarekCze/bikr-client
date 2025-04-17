import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { BaseFeedPage } from './BaseFeedPage';
import { useFeed } from '../../contexts/FeedContext';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

/**
 * LocalFeedPage component that displays content near the user's location
 * Shows posts within a specified radius of the user's current location
 */
export const LocalFeedPage: React.FC = () => {
  const { localFeed, loadLocalFeed } = useFeed();
  const [radiusOptions, setRadiusOptions] = useState([5, 10, 20, 50, 100]);
  const [showRadiusSelector, setShowRadiusSelector] = useState(false);
  
  const accentColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#333333' }, 'background');
  
  // Initial load
  useEffect(() => {
    if (localFeed.posts.length === 0 && !localFeed.loading) {
      loadLocalFeed(true);
    }
  }, [loadLocalFeed, localFeed.posts.length, localFeed.loading]);
  
  const handleRadiusChange = (radius: number) => {
    setShowRadiusSelector(false);
    
    // Only reload if the radius has changed
    if (radius !== localFeed.radius) {
      // Update the radius and reload feed
      // Note: In a more complex implementation, we'd update the radius in the context
      // Here we're just reloading which will use the current radius in the context
      loadLocalFeed(true);
    }
  };
  
  const RadiusSelector = () => (
    <ThemedView style={[styles.radiusSelector, { borderColor }]}>
      <ThemedText style={styles.radiusSelectorTitle}>Set Search Radius</ThemedText>
      <View style={styles.radiusOptionsContainer}>
        {radiusOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.radiusOption,
              localFeed.radius === option && { backgroundColor: accentColor }
            ]}
            onPress={() => handleRadiusChange(option)}
          >
            <ThemedText 
              style={[
                styles.radiusOptionText,
                localFeed.radius === option && styles.radiusOptionTextSelected
              ]}
            >
              {option} km
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setShowRadiusSelector(false)}
      >
        <ThemedText style={{ color: accentColor }}>Close</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
  
  // Custom header component with radius selector
  const HeaderComponent = (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.radiusButton}
        onPress={() => setShowRadiusSelector(!showRadiusSelector)}
      >
        <Ionicons name="location" size={16} color={accentColor} />
        <ThemedText style={styles.radiusButtonText}>{localFeed.radius} km</ThemedText>
        <Ionicons name="chevron-down" size={16} color={accentColor} />
      </TouchableOpacity>
      
      {showRadiusSelector && <RadiusSelector />}
      
      {localFeed.location && (
        <ThemedText style={styles.locationText}>
          Showing content near {localFeed.location.latitude.toFixed(4)}, {localFeed.location.longitude.toFixed(4)}
        </ThemedText>
      )}
    </View>
  );
  
  return (
    <BaseFeedPage
      feedType="local"
      feed={localFeed}
      loadFeed={loadLocalFeed}
      title="Nearby"
      HeaderComponent={HeaderComponent}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  radiusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  radiusButtonText: {
    marginHorizontal: 4,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.6,
  },
  radiusSelector: {
    position: 'absolute',
    top: 40,
    width: '80%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  radiusSelectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  radiusOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
  },
  radiusOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  radiusOptionText: {
    fontSize: 14,
  },
  radiusOptionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
});
