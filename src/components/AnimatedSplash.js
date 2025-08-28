import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext.js';

export default function AnimatedSplash({ onAnimationComplete }) {
  const { theme, isDark } = useTheme();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const underlineScaleX = useRef(new Animated.Value(0)).current;
  const underlineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animationSequence = Animated.sequence([
      // Step 1: Fade in and scale up logo (native driver)
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Step 2: Show and animate underline (native driver)
      Animated.parallel([
        Animated.timing(underlineOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(underlineScaleX, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animationSequence.start(() => {
      // Animation complete
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, []);

  const getLogoSource = () => {
    if (isDark) {
      return require('../../assets/branding/cerco-logo-dark.png');
    }
    return require('../../assets/branding/cerco-logo-light.png');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image source={getLogoSource()} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View
          style={[
            styles.underline,
            {
              opacity: underlineOpacity,
              backgroundColor: theme.colors.secondary,
              transform: [{ scaleX: underlineScaleX }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  underline: {
    width: 120,
    height: 3,
    borderRadius: 2,
  },
});
