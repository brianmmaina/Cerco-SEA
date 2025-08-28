import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext.js';
import { useEvents } from '../context/EventsContext.js';
import { useAuth } from '../context/AuthContext.js';
import LocationSearch from '../components/LocationSearch.js';

export default function CreateEventScreen({ navigation }) {
  const { theme } = useTheme();
  const { createEvent } = useEvents();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    locationName: '',
    coordinate: null,
    date: '',
    time: '',
    category: '',
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Sports',
    'Academic',
    'Social',
    'Wellness',
    'Arts',
    'Technology',
    'Food',
    'Other',
  ];

  const handleImageSelect = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select an image.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setEventData(prev => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleLocationSelect = (location) => {
    setEventData(prev => ({
      ...prev,
      location: location.address,
      locationName: location.name,
      coordinate: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));
  };

  const handleCreateEvent = async () => {
    if (!eventData.title || !eventData.description || !eventData.location || !eventData.date || !eventData.time || !eventData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!eventData.coordinate) {
      Alert.alert('Error', 'Please select a valid location');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create an event');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createEvent({
        ...eventData,
        createdBy: user.id,
        createdByName: user.name || 'Anonymous User',
      });

      if (result.success) {
        Alert.alert('Success', 'Event created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to create event');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create event: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.background,
        paddingTop: Math.max(insets.top - 40, 10),
      }
    ]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={theme.colors.textPrimary} 
              />
            </TouchableOpacity>
            
            <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
              Create Event
            </Text>
            
            <View style={styles.placeholder} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Event Image */}
            <View style={styles.imageSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Event Image
              </Text>
              <TouchableOpacity
                style={[
                  styles.imageContainer,
                  { 
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={handleImageSelect}
              >
                {eventData.image ? (
                  <Image source={{ uri: eventData.image }} style={styles.selectedImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons 
                      name="camera-outline" 
                      size={32} 
                      color={theme.colors.textSecondary} 
                    />
                    <Text style={[styles.imagePlaceholderText, { color: theme.colors.textSecondary }]}>
                      Add Event Image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Event Title */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Event Title *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.textPrimary,
                  }
                ]}
                placeholder="Enter event title"
                placeholderTextColor={theme.colors.textTertiary}
                value={eventData.title}
                onChangeText={(text) => setEventData(prev => ({ ...prev, title: text }))}
              />
            </View>

            {/* Event Description */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Description *
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  { 
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.textPrimary,
                  }
                ]}
                placeholder="Describe your event"
                placeholderTextColor={theme.colors.textTertiary}
                value={eventData.description}
                onChangeText={(text) => setEventData(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Location */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Location *
              </Text>
              <LocationSearch
                onSelectLocation={handleLocationSelect}
                placeholder="Select event location"
                value={eventData.locationName}
                isLoading={isLoading}
              />
            </View>

            {/* Date and Time */}
            <View style={styles.row}>
              <View style={[styles.inputSection, styles.halfWidth]}>
                <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                  Date *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      color: theme.colors.textPrimary,
                    }
                  ]}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={eventData.date}
                  onChangeText={(text) => setEventData(prev => ({ ...prev, date: text }))}
                />
              </View>
              
              <View style={[styles.inputSection, styles.halfWidth]}>
                <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                  Time *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      color: theme.colors.textPrimary,
                    }
                  ]}
                  placeholder="HH:MM AM/PM"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={eventData.time}
                  onChangeText={(text) => setEventData(prev => ({ ...prev, time: text }))}
                />
              </View>
            </View>

            {/* Category */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Category *
              </Text>
              <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: eventData.category === category 
                          ? theme.colors.primary 
                          : theme.colors.surface,
                        borderColor: theme.colors.border,
                      }
                    ]}
                    onPress={() => setEventData(prev => ({ ...prev, category }))}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      { 
                        color: eventData.category === category 
                          ? theme.colors.textInverse 
                          : theme.colors.textPrimary 
                      }
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={[
                styles.createButton,
                { 
                  backgroundColor: theme.colors.primary,
                  ...theme.shadows.md,
                }
              ]}
              onPress={handleCreateEvent}
              disabled={isLoading}
            >
              <Text style={[styles.createButtonText, { color: theme.colors.textInverse }]}>
                {isLoading ? 'Creating...' : 'Create Event'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60, // Added status bar padding
    paddingBottom: 160, // Increased bottom padding for better tab bar clearance
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_600SemiBold',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 40,
  },
  form: {
    flex: 1,
  },
  imageSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
  },
  imageContainer: {
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    height: 100,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  createButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
}); 