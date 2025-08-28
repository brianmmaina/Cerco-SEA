import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext.js';
import { useEvents } from '../context/EventsContext.js';
import { useComments } from '../context/CommentsContext.js';
import { useResponsiveDimensions } from '../utils/useResponsiveDimensions.js';

// Mock event data for demo
const mockEvents = [
  {
    id: 'mock-1',
    title: 'BU Basketball Game',
    location: 'Agganis Arena',
    time: '7:00 PM',
    date: '2024-01-15',
    attendees: 156,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
    isMock: true,
  },
  {
    id: 'mock-2',
    title: 'Study Group - Computer Science',
    location: 'Mugar Library',
    time: '2:00 PM',
    date: '2024-01-15',
    attendees: 23,
    category: 'Academic',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    isMock: true,
  },
  {
    id: 'mock-3',
    title: 'Coffee Meetup',
    location: 'Starbucks - BU Campus',
    time: '3:30 PM',
    date: '2024-01-15',
    attendees: 8,
    category: 'Social',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    isMock: true,
  },
  {
    id: 'mock-4',
    title: 'Yoga in the Park',
    location: 'BU Beach',
    time: '6:00 AM',
    date: '2024-01-16',
    attendees: 45,
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    isMock: true,
  },
  {
    id: 'mock-5',
    title: 'Music Jam Session',
    location: 'College of Fine Arts',
    time: '8:00 PM',
    date: '2024-01-16',
    attendees: 12,
    category: 'Arts',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    isMock: true,
  },
];

const EventCard = ({ event, onPress }) => {
  const { theme } = useTheme();
  const { getCommentsForEvent } = useComments();
  const { fontSize } = useResponsiveDimensions();

  // Get real comment count for this event
  const comments = getCommentsForEvent(event.id);
  const commentCount = comments.length;

  return (
    <TouchableOpacity
      style={[
        styles.eventCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: event.image }} style={styles.eventImage} />

      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={[styles.eventTitle, { color: theme.colors.textPrimary }]}>
            {event.title}
          </Text>
          {!event.isMock && (
            <View style={[styles.userEventBadge, { backgroundColor: theme.colors.secondary }]}>
              <Ionicons name="person" size={12} color={theme.colors.textInverse} />
            </View>
          )}
        </View>

        <View style={styles.eventMeta}>
          <Ionicons name="location-outline" size={fontSize.sm} color={theme.colors.textSecondary} />
          <Text
            style={[
              styles.eventLocation,
              { color: theme.colors.textSecondary, fontSize: fontSize.sm },
            ]}
          >
            {event.location}
          </Text>
        </View>

        <View style={styles.eventMeta}>
          <Ionicons name="time-outline" size={fontSize.sm} color={theme.colors.textSecondary} />
          <Text
            style={[styles.eventTime, { color: theme.colors.textSecondary, fontSize: fontSize.sm }]}
          >
            {event.time}
          </Text>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.attendees}>
            <Ionicons name="people-outline" size={fontSize.sm} color={theme.colors.textSecondary} />
            <Text
              style={[
                styles.attendeesText,
                { color: theme.colors.textSecondary, fontSize: fontSize.sm },
              ]}
            >
              {event.attendees}
            </Text>
          </View>

          <View style={styles.comments}>
            <Ionicons
              name="chatbubble-outline"
              size={fontSize.sm}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.commentsText,
                { color: theme.colors.textSecondary, fontSize: fontSize.sm },
              ]}
            >
              {commentCount}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function FeedScreen({ navigation }) {
  const { theme } = useTheme();
  const { events: createdEvents } = useEvents();
  const insets = useSafeAreaInsets();
  const { isTablet, spacing } = useResponsiveDimensions();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Sports',
    'Academic',
    'Social',
    'Wellness',
    'Arts',
    'Technology',
    'Food',
    'Other',
  ];

  // Combine mock events with created events
  const allEvents = [
    ...mockEvents,
    ...createdEvents.map(event => ({
      ...event,
      isMock: false,
    })),
  ];

  const filteredEvents =
    selectedCategory === 'All'
      ? allEvents
      : allEvents.filter(event => event.category === selectedCategory);

  const handleEventPress = event => {
    navigation.navigate('EventDetails', { event });
  };

  const renderCategoryButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        {
          backgroundColor: selectedCategory === item ? theme.colors.primary : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          {
            color: selectedCategory === item ? theme.colors.textInverse : theme.colors.textPrimary,
          },
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Feed</Text>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryButton}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.categoriesList,
            { paddingHorizontal: isTablet ? spacing.xl : spacing.md },
          ]}
        />
      </View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        renderItem={({ item }) => <EventCard event={item} onPress={() => handleEventPress(item)} />}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.eventsList,
          { paddingHorizontal: isTablet ? spacing.xl : spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
        numColumns={isTablet ? 2 : 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20, // Reduced from 60 to prevent text cropping
    paddingBottom: 8,
    paddingHorizontal: 20, // Added horizontal padding to prevent left cropping
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_600SemiBold',
    letterSpacing: -0.5,
  },
  categoriesContainer: {
    marginBottom: 8, // Further reduced margin
  },
  categoriesList: {
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  eventsList: {
    paddingBottom: 200, // Increased bottom padding for better tab bar clearance
  },
  eventCard: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  eventContent: {
    padding: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventLocation: {
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
  eventTime: {
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
  comments: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsText: {
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
  userEventBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
});
