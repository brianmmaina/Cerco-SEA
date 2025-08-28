import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

export default function GradientBackground({ 
  children, 
  gradientType = 'crimson', 
  style, 
  start = { x: 0, y: 0 }, 
  end = { x: 1, y: 1 } 
}) {
  const gradientColors = theme.gradientColors[gradientType] || theme.gradientColors.crimson;

  return (
    <LinearGradient
      colors={gradientColors}
      start={start}
      end={end}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
}); 