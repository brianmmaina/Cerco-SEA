import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext.js';
import { useAuth } from '../context/AuthContext.js';

export default function ProfileScreen({ navigation }) {
  const { theme, setThemeMode, themeMode, isDark } = useTheme();
  const { user, isProfileComplete } = useAuth();
  const insets = useSafeAreaInsets();

  // Default avatar if user doesn't have one
  const defaultAvatar =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';

  const menuItems = [
    {
      icon: 'person-outline',
      title: isProfileComplete ? 'Edit Profile' : 'Complete Profile',
      subtitle: isProfileComplete ? 'Update your information' : 'Fill in your details',
      onPress: () => {
        if (isProfileComplete) {
          // For now, just show a message since we don't have a full edit profile screen
          Alert.alert('Edit Profile', 'Profile editing will be available in a future update.');
        } else {
          navigation.navigate('CompleteProfile');
        }
      },
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage your preferences',
      onPress: () =>
        Alert.alert('Notifications', 'Notification settings will be available in a future update.'),
    },
    {
      icon: 'shield-outline',
      title: 'Privacy & Security',
      subtitle: 'Control your data',
      onPress: () =>
        Alert.alert('Privacy & Security', 'Privacy settings will be available in a future update.'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get assistance',
      onPress: () =>
        Alert.alert('Help & Support', 'Help and support will be available in a future update.'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About Cerco',
      subtitle: 'Version 1.0.0',
      onPress: () =>
        Alert.alert(
          'About Cerco',
          'Cerco v1.0.0\n\nA campus event discovery app for university students.',
        ),
    },
  ];

  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        },
      },
    ]);
  };

  const toggleTheme = () => {
    // Cycle through: system -> light -> dark -> system
    const modes = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const getThemeDisplayText = () => {
    switch (themeMode) {
      case 'system':
        return `System (${isDark ? 'Dark' : 'Light'})`;
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'System';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: Math.max(insets.top - 40, 10),
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Profile</Text>
        </View>

        {/* Profile Section */}
        <View
          style={[
            styles.profileSection,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              ...theme.shadows.sm,
            },
          ]}
        >
          <View style={styles.profileHeader}>
            <Image source={{ uri: user?.avatar || defaultAvatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>
                {user?.name || 'Complete Your Profile'}
              </Text>
              <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
                {user?.email || ''}
              </Text>
              <Text style={[styles.memberSince, { color: theme.colors.textTertiary }]}>
                Member since {user?.memberSince || new Date().getFullYear()}
              </Text>
              {!isProfileComplete && (
                <Text style={[styles.profileIncomplete, { color: theme.colors.primary }]}>
                  ⚠️ Profile incomplete
                </Text>
              )}
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {user?.eventsHosted || 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Events Hosted
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {user?.eventsAttended || 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Events Attended
              </Text>
            </View>
          </View>
        </View>

        {/* Theme Toggle */}
        <View
          style={[
            styles.themeSection,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              ...theme.shadows.sm,
            },
          ]}
        >
          <View style={styles.themeHeader}>
            <Ionicons
              name={themeMode === 'dark' ? 'moon' : 'sunny'}
              size={20}
              color={theme.colors.textPrimary}
            />
            <View>
              <Text style={[styles.themeTitle, { color: theme.colors.textPrimary }]}>
                Appearance
              </Text>
              {themeMode === 'system' && (
                <Text style={[styles.themeSubtitle, { color: theme.colors.textSecondary }]}>
                  Following system theme
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.themeToggle,
              {
                backgroundColor: theme.colors.primary,
                ...theme.shadows.sm,
              },
            ]}
            onPress={toggleTheme}
          >
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={16}
              color={theme.colors.textInverse}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.themeToggleText, { color: theme.colors.textInverse }]}>
              {getThemeDisplayText()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View
          style={[
            styles.menuSection,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              ...theme.shadows.sm,
            },
          ]}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && {
                  borderBottomColor: theme.colors.border,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={20} color={theme.colors.textSecondary} />
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: theme.colors.textPrimary }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.menuItemSubtitle, { color: theme.colors.textSecondary }]}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.error,
              ...theme.shadows.sm,
            },
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_600SemiBold',
    letterSpacing: -0.5,
  },
  profileSection: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  profileIncomplete: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  themeSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  themeTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 12,
  },
  themeSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginLeft: 12,
    marginTop: 2,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  themeToggleText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 8,
  },
  menuSection: {
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemContent: {
    marginLeft: 16,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 8,
  },
});
