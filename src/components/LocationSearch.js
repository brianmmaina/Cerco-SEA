import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext.js';
import { geocodeAddress, searchPlaces, fallbackGeocode } from '../utils/geocoding.js';

export default function LocationSearch({
  onSelectLocation,
  placeholder = 'Search for a location...',
  value = '',
  isLoading = false,
}) {
  const { theme } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Predefined BU locations for quick access
  const buLocations = [
    {
      name: 'BU Student Center',
      address: '775 Commonwealth Ave, Boston, MA 02215',
      latitude: 42.35,
      longitude: -71.105,
    },
    {
      name: 'Mugar Library',
      address: '771 Commonwealth Ave, Boston, MA 02215',
      latitude: 42.351,
      longitude: -71.104,
    },
    {
      name: 'BU Fitness Center',
      address: '915 Commonwealth Ave, Boston, MA 02215',
      latitude: 42.349,
      longitude: -71.106,
    },
    {
      name: 'Starbucks on Campus',
      address: '736 Commonwealth Ave, Boston, MA 02215',
      latitude: 42.3505,
      longitude: -71.1045,
    },
    {
      name: 'Warren Towers',
      address: '700 Commonwealth Ave, Boston, MA 02215',
      latitude: 42.352,
      longitude: -71.103,
    },
    {
      name: 'Marsh Chapel',
      address: '735 Commonwealth Ave, Boston, MA 02215',
      latitude: 42.348,
      longitude: -71.107,
    },
    {
      name: 'BU Beach',
      address: 'Bay State Rd, Boston, MA 02215',
      latitude: 42.3495,
      longitude: -71.1055,
    },
    {
      name: 'CAS Building',
      address: '725 Commonwealth Ave, Boston, MA 02215',
      latitude: 42.3515,
      longitude: -71.1035,
    },
  ];

  // Search for locations using Google Places API
  const performSearch = async query => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // First try Google Places API
      const placesResult = await searchPlaces(query);

      if (placesResult.success) {
        setSearchResults(placesResult.places);
      } else {
        // Fallback to geocoding
        const geocodeResult = await geocodeAddress(query);
        if (geocodeResult.success) {
          setSearchResults([
            {
              name: query,
              address: geocodeResult.formattedAddress,
              latitude: geocodeResult.latitude,
              longitude: geocodeResult.longitude,
            },
          ]);
        } else {
          // Final fallback to local database
          const fallbackResult = fallbackGeocode(query);
          if (fallbackResult.success) {
            setSearchResults([
              {
                name: query,
                address: fallbackResult.formattedAddress,
                latitude: fallbackResult.latitude,
                longitude: fallbackResult.longitude,
              },
            ]);
          } else {
            setSearchResults([]);
          }
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchText.trim()) {
      const timeout = setTimeout(() => {
        performSearch(searchText);
      }, 500); // Wait 500ms after user stops typing
      setSearchTimeout(timeout);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchText]);

  const handleLocationSelect = location => {
    setSearchText(location.name);
    setShowSuggestions(false);
    setSearchResults([]);
    onSelectLocation(location);
  };

  const handleTextChange = text => {
    setSearchText(text);
    setShowSuggestions(text.length > 0);
  };

  const clearSelection = () => {
    setSearchText('');
    setShowSuggestions(false);
    setSearchResults([]);
    onSelectLocation(null);
  };

  const handleCustomLocation = async () => {
    if (!searchText.trim()) {
      Alert.alert('Error', 'Please enter a location to search for');
      return;
    }

    setIsSearching(true);
    try {
      const result = await geocodeAddress(searchText);
      if (result.success) {
        const location = {
          name: searchText,
          address: result.formattedAddress,
          latitude: result.latitude,
          longitude: result.longitude,
        };
        handleLocationSelect(location);
      } else {
        Alert.alert('Error', 'Could not find this location. Please try a different search term.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const filteredBuLocations = buLocations.filter(
    location =>
      location.name.toLowerCase().includes(searchText.toLowerCase()) ||
      location.address.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Ionicons
          name="location-outline"
          size={20}
          color={theme.colors.textSecondary}
          style={styles.searchIcon}
        />

        {value ? (
          <View style={styles.selectedLocation}>
            <Text style={[styles.selectedLocationText, { color: theme.colors.textPrimary }]}>
              {value}
            </Text>
            <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
              <Ionicons name="close-circle" size={16} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TextInput
            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textTertiary}
            value={searchText}
            onChangeText={handleTextChange}
            onFocus={() => setShowSuggestions(searchText.length > 0)}
            editable={!isLoading}
          />
        )}

        {isSearching && (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={styles.searchIndicator}
          />
        )}
      </View>

      {showSuggestions && (
        <View
          style={[
            styles.suggestionsContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <ScrollView style={styles.suggestionsList} showsVerticalScrollIndicator={false}>
            {/* Search Results */}
            {searchResults.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                  Search Results
                </Text>
                {searchResults.map((location, index) => (
                  <TouchableOpacity
                    key={`search-${index}`}
                    style={[styles.suggestionItem, { borderBottomColor: theme.colors.border }]}
                    onPress={() => handleLocationSelect(location)}
                  >
                    <Ionicons name="search" size={16} color={theme.colors.primary} />
                    <View style={styles.suggestionContent}>
                      <Text style={[styles.suggestionName, { color: theme.colors.textPrimary }]}>
                        {location.name}
                      </Text>
                      <Text
                        style={[styles.suggestionAddress, { color: theme.colors.textSecondary }]}
                      >
                        {location.address}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* BU Campus Locations */}
            {filteredBuLocations.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                  BU Campus Locations
                </Text>
                {filteredBuLocations.map((location, index) => (
                  <TouchableOpacity
                    key={`bu-${index}`}
                    style={[styles.suggestionItem, { borderBottomColor: theme.colors.border }]}
                    onPress={() => handleLocationSelect(location)}
                  >
                    <Ionicons name="location" size={16} color={theme.colors.primary} />
                    <View style={styles.suggestionContent}>
                      <Text style={[styles.suggestionName, { color: theme.colors.textPrimary }]}>
                        {location.name}
                      </Text>
                      <Text
                        style={[styles.suggestionAddress, { color: theme.colors.textSecondary }]}
                      >
                        {location.address}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Custom Location Option */}
            {searchText.trim() && (
              <TouchableOpacity
                style={[styles.suggestionItem, { borderBottomColor: theme.colors.border }]}
                onPress={handleCustomLocation}
                disabled={isSearching}
              >
                <Ionicons name="add-circle-outline" size={16} color={theme.colors.primary} />
                <Text style={[styles.suggestionName, { color: theme.colors.primary }]}>
                  {isSearching ? 'Searching...' : `Use "${searchText}" as location`}
                </Text>
              </TouchableOpacity>
            )}

            {/* No Results */}
            {searchText.trim() &&
              searchResults.length === 0 &&
              filteredBuLocations.length === 0 &&
              !isSearching && (
                <View style={styles.noResults}>
                  <Text style={[styles.noResultsText, { color: theme.colors.textSecondary }]}>
                    No results found. Try searching for "coffee" or "library"
                  </Text>
                </View>
              )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  selectedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
  },
  selectedLocationText: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  clearButton: {
    padding: 5,
  },
  searchIndicator: {
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -10,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 300,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  suggestionContent: {
    marginLeft: 10,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  suggestionAddress: {
    fontSize: 14,
    color: '#666666',
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888888',
  },
});
