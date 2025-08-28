import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { useFonts, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { Inter_400Regular } from '@expo-google-fonts/inter';

// Suppress noisy dev-time warnings
LogBox.ignoreLogs([
  "The action 'NAVIGATE' with payload",
  "The action 'RESET' with payload",
  "WebChannelConnection RPC 'Listen' stream",
]);

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import FeedScreen from './src/screens/FeedScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import MapScreen from './src/screens/MapScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CompleteProfileScreen from './src/screens/CompleteProfileScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

// Import theme and components
import { ThemeProvider, useTheme } from './src/context/ThemeContext.js';
import { AuthProvider, useAuth } from './src/context/AuthContext.js';
import { CommentsProvider } from './src/context/CommentsContext.js';
import { EventsProvider } from './src/context/EventsContext.js';
import AnimatedSplash from './src/components/AnimatedSplash';
import MainTabNavigator from './src/navigation/MainTabNavigator.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

function AppContent() {
  return (
    <AuthProvider>
      <EventsProvider>
        <CommentsProvider>
          <NavigationContainer>
            <ThemedStatusBar />
            <AuthenticatedNavigator />
          </NavigationContainer>
        </CommentsProvider>
      </EventsProvider>
    </AuthProvider>
  );
}

function AuthenticatedNavigator() {
  const { isAuthenticated, isProfileComplete, user } = useAuth();

  console.log('Navigation state:', {
    isAuthenticated,
    isProfileComplete,
    userId: user?.id,
    userEmail: user?.email,
  });

  // Render distinct stacks to avoid mixed public/protected routes
  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    );
  }

  if (!isProfileComplete) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    Manrope_600SemiBold,
    Inter_400Regular,
  });

  useEffect(() => {
    // Simulate asset loading
    const initializeApp = async () => {
      try {
        // Mock asset loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.log('Error initializing app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleSplashComplete = async () => {
    setShowSplash(false);
    // Hide the splash screen after animation completes
    await SplashScreen.hideAsync();
  };

  // Show animated splash while loading
  if (showSplash || !fontsLoaded || isLoading) {
    return (
      <ThemeProvider>
        <AnimatedSplash onAnimationComplete={handleSplashComplete} />
      </ThemeProvider>
    );
  }

  // Log font loading status for debugging
  console.log('Fonts loaded:', fontsLoaded);
  console.log('Available fonts:', {
    Manrope_600SemiBold: !!Manrope_600SemiBold,
    Inter_400Regular: !!Inter_400Regular,
  });

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
