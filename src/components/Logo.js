import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext.js';

export default function Logo({ size = 'medium', style, withText = false }) {
  const { isDark } = useTheme();

  const getLogoSource = () => {
    if (withText) {
      if (isDark) {
        return require('../../assets/branding/cerco-logo with text transparent light.png');
      }
      return require('../../assets/branding/cerco-logo with text transparent dark text.png');
    } else {
      if (isDark) {
        return require('../../assets/branding/cerco-logo-light.png');
      }
      return require('../../assets/branding/cerco-logo-dark.png');
    }
  };

  const getSize = () => {
    if (withText) {
      switch (size) {
        case 'small':
          return { width: 140, height: 56 };
        case 'large':
          return { width: 200, height: 80 };
        case 'xlarge':
          return { width: 280, height: 112 };
        default: // medium
          return { width: 180, height: 72 };
      }
    } else {
      switch (size) {
        case 'small':
          return { width: 40, height: 40 };
        case 'large':
          return { width: 100, height: 100 };
        case 'xlarge':
          return { width: 140, height: 140 };
        default: // medium
          return { width: 70, height: 70 };
      }
    }
  };

  return (
    <Image source={getLogoSource()} style={[styles.logo, getSize(), style]} resizeMode="contain" />
  );
}

const styles = StyleSheet.create({
  logo: {
    // No border radius for transparent logos
  },
});
