import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext.js';
import { useAuth } from '../context/AuthContext.js';
import Logo from '../components/Logo.js';

export default function CompleteProfileScreen({ navigation }) {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [major, setMajor] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name.');
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        name: fullName.trim(),
        bio: bio.trim(),
        major: major.trim(),
        graduationYear: graduationYear.trim(),
        avatar: user?.avatar || null,
      };

      console.log('Updating profile with data:', profileData);
      const result = await updateProfile(profileData);

      if (result.success) {
        console.log('Profile updated successfully');
        // Force navigation to main app
        setTimeout(() => {
          navigation.navigate('MainTabs');
        }, 100);
      } else {
        console.error('Profile update failed:', result.error);
        Alert.alert('Error', result.error || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
            <View style={styles.logoContainer}>
              <Logo size="large" withText={true} />
            </View>

            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Complete Your Profile
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Help us personalize your experience
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Full Name *
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Major Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Major/Field of Study
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="school-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  placeholder="e.g., Computer Science"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={major}
                  onChangeText={setMajor}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Graduation Year Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Expected Graduation Year
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  placeholder="e.g., 2025"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={graduationYear}
                  onChangeText={setGraduationYear}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Bio Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Bio (Optional)
              </Text>
              <View
                style={[
                  styles.textAreaWrapper,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <TextInput
                  style={[styles.textArea, { color: theme.colors.textPrimary }]}
                  placeholder="Tell us a bit about yourself..."
                  placeholderTextColor={theme.colors.textTertiary}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Complete Profile Button */}
            <TouchableOpacity
              style={[
                styles.completeButton,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: isLoading ? 0.7 : 1,
                  ...theme.shadows.md,
                },
              ]}
              onPress={handleCompleteProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={[styles.completeButtonText, { color: theme.colors.textInverse }]}>
                  Completing Profile...
                </Text>
              ) : (
                <Text style={[styles.completeButtonText, { color: theme.colors.textInverse }]}>
                  Complete Profile
                </Text>
              )}
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity style={styles.skipButton} onPress={handleCompleteProfile}>
              <Text style={[styles.skipButtonText, { color: theme.colors.textSecondary }]}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50, // Standardized status bar padding
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Manrope_600SemiBold',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  textArea: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    minHeight: 80,
  },
  completeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
