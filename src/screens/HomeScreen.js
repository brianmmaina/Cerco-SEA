import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext.js';
import { useAuth } from '../context/AuthContext.js';
import Logo from '../components/Logo.js';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { isAuthenticated, isProfileComplete } = useAuth();

  // Redirect authenticated users
  useEffect(() => {
    // The AuthenticatedNavigator handles navigation automatically
    // No need for manual navigation here
  }, [isAuthenticated, isProfileComplete, navigation]);

  const features = [
    {
      icon: 'map-outline',
      title: 'Discover Events',
      description: 'Find exciting events around campus',
    },
    {
      icon: 'people-outline',
      title: 'Connect',
      description: 'Meet fellow students',
    },
    {
      icon: 'calendar-outline',
      title: 'Stay Updated',
      description: 'Never miss important campus activities',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Logo size="xlarge" withText={true} />
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Discover and join exclusive university events. Connect with fellow students.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View 
              key={index} 
              style={[
                styles.featureCard, 
                { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  ...theme.shadows.sm,
                }
              ]}
            >
              <View style={[styles.featureIcon, { backgroundColor: theme.colors.primary }]}>
                <Ionicons 
                  name={feature.icon} 
                  size={20} 
                  color={theme.colors.textInverse} 
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.colors.textPrimary }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              { 
                backgroundColor: theme.colors.primary,
                ...theme.shadows.md,
              }
            ]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.primaryButtonText, { color: theme.colors.textInverse }]}>
              Sign In
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={18} 
              color={theme.colors.textInverse} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.colors.textPrimary }]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50, // Standardized status bar padding
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 0,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 2,
  },
  featureText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  buttonContainer: {
    // Bottom section
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginRight: 8,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
}); 