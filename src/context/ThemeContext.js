import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme';

const ThemeContext = createContext();

const THEME_STORAGE_KEY = '@cerco_theme_mode';

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme mode from storage
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
          setThemeMode(savedMode);
        }
      } catch (error) {
        console.log('Error loading theme mode:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadThemeMode();
  }, []);

  // Save theme mode to storage
  const saveThemeMode = async mode => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.log('Error saving theme mode:', error);
    }
  };

  // Update theme mode
  const updateThemeMode = mode => {
    setThemeMode(mode);
    saveThemeMode(mode);
  };

  // Determine current theme based on mode and system preference
  const getCurrentTheme = () => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  };

  const theme = getCurrentTheme();
  const isDark = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

  const value = {
    theme,
    themeMode,
    setThemeMode: updateThemeMode,
    isDark,
  };

  if (!isLoaded) {
    // Return a loading state or default theme while loading
    return (
      <ThemeContext.Provider
        value={{
          theme: lightTheme,
          themeMode: 'system',
          setThemeMode: updateThemeMode,
          isDark: false,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
