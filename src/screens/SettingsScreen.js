import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext.js';
import { useAuth } from '../context/AuthContext.js';

export default function SettingsScreen({ navigation }) {
  const { theme, setThemeMode, themeMode, isDark } = useTheme();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoLocation, setAutoLocation] = useState(true);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
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

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          title: 'Theme',
          subtitle: getThemeDisplayText(),
          type: 'link',
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'pushNotifications',
          title: 'Push Notifications',
          type: 'toggle',
          value: pushNotifications,
          onValueChange: setPushNotifications,
        },
        {
          id: 'emailNotifications',
          title: 'Email Notifications',
          type: 'toggle',
          value: emailNotifications,
          onValueChange: setEmailNotifications,
        },
      ],
    },
    {
      title: 'Location',
      items: [
        {
          id: 'autoLocation',
          title: 'Auto-detect Location',
          type: 'toggle',
          value: autoLocation,
          onValueChange: setAutoLocation,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'editProfile',
          title: 'Edit Profile',
          subtitle: 'Update your information',
          type: 'link',
          onPress: () =>
            Alert.alert('Edit Profile', 'Profile editing will be available in a future update.'),
        },
        {
          id: 'changePassword',
          title: 'Change Password',
          subtitle: 'Update your password',
          type: 'link',
          onPress: () =>
            Alert.alert('Change Password', 'Password change will be available in a future update.'),
        },
        {
          id: 'deleteAccount',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          type: 'link',
          onPress: () =>
            Alert.alert('Delete Account', 'Account deletion will be available in a future update.'),
          destructive: true,
        },
      ],
    },
  ];

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Settings</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {settingsSections.map(section => (
          <View
            key={section.title}
            style={[
              styles.section,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                ...theme.shadows.sm,
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
              {section.title}
            </Text>

            {section.items.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
                onPress={item.type === 'link' ? item.onPress : undefined}
                disabled={item.type === 'toggle'}
              >
                <View style={styles.settingContent}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: theme.colors.textPrimary },
                      item.destructive && { color: theme.colors.error },
                    ]}
                  >
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  )}
                </View>

                {item.type === 'toggle' ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    trackColor={{
                      false: theme.colors.border,
                      true: theme.colors.primary,
                    }}
                    thumbColor={theme.colors.textInverse}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

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

        <View style={styles.versionSection}>
          <Text style={[styles.versionText, { color: theme.colors.textTertiary }]}>
            Cerco v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    marginBottom: 8,
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
    width: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  settingSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  versionSection: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
