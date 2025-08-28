import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext.js';
import { useEvents } from '../context/EventsContext.js';

const { width, height } = Dimensions.get('window');

// Mock event data for demo
const mockEvents = [
  {
    id: 'mock-1',
    title: 'BU Basketball Game',
    location: 'Agganis Arena',
    time: '7:00 PM',
    attendees: 156,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
    coordinate: {
      latitude: 42.3505,
      longitude: -71.1054,
    },
    isMock: true,
  },
  {
    id: 'mock-2',
    title: 'Study Group - Computer Science',
    location: 'Mugar Library',
    time: '2:00 PM',
    attendees: 23,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    coordinate: {
      latitude: 42.3498,
      longitude: -71.1047,
    },
    isMock: true,
  },
  {
    id: 'mock-3',
    title: 'Coffee Meetup',
    location: 'Starbucks - BU Campus',
    time: '3:30 PM',
    attendees: 8,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    coordinate: {
      latitude: 42.3502,
      longitude: -71.1051,
    },
    isMock: true,
  },
  {
    id: 'mock-4',
    title: 'Yoga in the Park',
    location: 'BU Beach',
    time: '6:00 AM',
    attendees: 45,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    coordinate: {
      latitude: 42.3495,
      longitude: -71.1042,
    },
    isMock: true,
  },
  {
    id: 'mock-5',
    title: 'Music Jam Session',
    location: 'College of Fine Arts',
    time: '8:00 PM',
    attendees: 12,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    coordinate: {
      latitude: 42.351,
      longitude: -71.106,
    },
    isMock: true,
  },
];

const initialRegion = {
  latitude: 42.3505,
  longitude: -71.1054,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MapScreen({ navigation }) {
  const { theme } = useTheme();
  const { events: createdEvents } = useEvents();
  const insets = useSafeAreaInsets();
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Combine mock events with created events
  const allEvents = [
    ...mockEvents,
    ...createdEvents
      .filter(event => event.coordinate)
      .map(event => ({
        ...event,
        isMock: false,
      })),
  ];

  const handleEventPress = event => {
    setSelectedEvent(selectedEvent?.id === event.id ? null : event);
  };

  const handleMapPress = () => {
    setSelectedEvent(null);
  };

  const CustomMarker = ({ event }) => (
    <View style={styles.markerContainer}>
      <Image source={{ uri: event.image }} style={styles.markerImage} />
      <View
        style={[
          styles.attendeeBadge,
          {
            backgroundColor: event.isMock ? theme.colors.primary : theme.colors.secondary,
          },
        ]}
      >
        <Text style={[styles.attendeeCount, { color: theme.colors.textInverse }]}>
          {event.attendees}
        </Text>
      </View>
      {!event.isMock && (
        <View style={[styles.userEventIndicator, { backgroundColor: theme.colors.secondary }]}>
          <Ionicons name="person" size={8} color={theme.colors.textInverse} />
        </View>
      )}
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: Math.max(insets.top - 20, 20),
        },
      ]}
    >
      {/* Map Section */}
      <View style={styles.mapSection}>
        {/* Map Header */}
        <View style={styles.mapHeader}>
          <Ionicons name="location" size={20} color={theme.colors.primary} />
          <Text style={[styles.mapTitle, { color: theme.colors.textPrimary }]}>
            Boston University Campus
          </Text>
        </View>

        {/* Real Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            onPress={handleMapPress}
            showsUserLocation={false}
            showsMyLocationButton={false}
          >
            {allEvents.map(event => (
              <Marker
                key={event.id}
                coordinate={event.coordinate}
                onPress={() => handleEventPress(event)}
              >
                <CustomMarker event={event} />
                <Callout
                  style={[
                    styles.callout,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <View style={styles.calloutContent}>
                    <Image source={{ uri: event.image }} style={styles.calloutImage} />
                    <View style={styles.calloutText}>
                      <Text style={[styles.calloutTitle, { color: theme.colors.textPrimary }]}>
                        {event.title}
                      </Text>
                      <Text style={[styles.calloutLocation, { color: theme.colors.textSecondary }]}>
                        {event.location}
                      </Text>
                      <Text style={[styles.calloutTime, { color: theme.colors.textSecondary }]}>
                        {event.time}
                      </Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>

        {/* Selected Event Callout */}
        {selectedEvent && (
          <View
            style={[
              styles.selectedCallout,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Image source={{ uri: selectedEvent.image }} style={styles.calloutImage} />
            <View style={styles.calloutContent}>
              <Text style={[styles.calloutTitle, { color: theme.colors.textPrimary }]}>
                {selectedEvent.title}
              </Text>
              <Text style={[styles.calloutLocation, { color: theme.colors.textSecondary }]}>
                {selectedEvent.location}
              </Text>
              <Text style={[styles.calloutTime, { color: theme.colors.textSecondary }]}>
                {selectedEvent.time}
              </Text>
              <TouchableOpacity
                style={[styles.viewDetailsButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('EventDetails', { event: selectedEvent })}
              >
                <Text style={[styles.viewDetailsText, { color: theme.colors.textInverse }]}>
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Events List */}
      <ScrollView
        style={[
          styles.eventsList,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.eventsHeader}>
          <Text style={[styles.eventsTitle, { color: theme.colors.textPrimary }]}>
            Events Near You
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Feed')}>
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventsGrid}>
          {allEvents.slice(0, 4).map(event => (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventCard,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  ...theme.shadows.sm,
                },
              ]}
              onPress={() => navigation.navigate('EventDetails', { event })}
            >
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventInfo}>
                <Text style={[styles.eventTitle, { color: theme.colors.textPrimary }]}>
                  {event.title}
                </Text>
                <Text style={[styles.eventLocation, { color: theme.colors.textSecondary }]}>
                  {event.location}
                </Text>
                <Text style={[styles.eventTime, { color: theme.colors.textSecondary }]}>
                  {event.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapSection: {
    height: height * 0.6,
    padding: 10, // Reduced from 20 to prevent text cropping
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12, // Reduced from default to prevent text cropping
    borderBottomWidth: 1,
  },
  mapTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_600SemiBold',
    marginLeft: 8,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    position: 'relative',
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D6B370',
  },
  attendeeBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  attendeeCount: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  userEventIndicator: {
    position: 'absolute',
    bottom: -5,
    left: -5,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  callout: {
    width: 200,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedCallout: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: 280,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  calloutImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  calloutContent: {
    padding: 16,
  },
  calloutText: {
    marginBottom: 12,
  },
  calloutTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 4,
  },
  calloutLocation: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 2,
  },
  calloutTime: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  viewDetailsButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  eventsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
    borderTopWidth: 1,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventsTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_600SemiBold',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  eventCard: {
    width: (width - 64) / 2,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
