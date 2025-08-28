import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro - 375x812)
const baseWidth = 375;
const baseHeight = 812;

// Screen size breakpoints
export const screenSizes = {
  small: 320,    // iPhone SE, small Android devices
  medium: 375,   // iPhone 11, 12, 13
  large: 414,    // iPhone 11 Pro Max, 12 Pro Max, 13 Pro Max
  xlarge: 768,   // iPad
  xxlarge: 1024, // iPad Pro
};

// Device type detection
export const isSmallDevice = SCREEN_WIDTH <= screenSizes.small;
export const isMediumDevice = SCREEN_WIDTH > screenSizes.small && SCREEN_WIDTH <= screenSizes.medium;
export const isLargeDevice = SCREEN_WIDTH > screenSizes.medium && SCREEN_WIDTH <= screenSizes.large;
export const isXLargeDevice = SCREEN_WIDTH > screenSizes.large && SCREEN_WIDTH <= screenSizes.xlarge;
export const isXXLargeDevice = SCREEN_WIDTH > screenSizes.xlarge;

export const isTablet = SCREEN_WIDTH >= screenSizes.xlarge;
export const isPhone = SCREEN_WIDTH < screenSizes.xlarge;

// Responsive scaling functions
export const scale = (size) => {
  const newSize = size * (SCREEN_WIDTH / baseWidth);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const verticalScale = (size) => {
  const newSize = size * (SCREEN_HEIGHT / baseHeight);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const moderateScale = (size, factor = 0.5) => {
  const newSize = size + (scale(size) - size) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive dimensions
export const responsiveWidth = (percentage) => {
  return (SCREEN_WIDTH * percentage) / 100;
};

export const responsiveHeight = (percentage) => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

// Responsive font sizes
export const fontSize = {
  xs: scale(10),
  sm: scale(12),
  base: scale(14),
  lg: scale(16),
  xl: scale(18),
  '2xl': scale(20),
  '3xl': scale(24),
  '4xl': scale(30),
  '5xl': scale(36),
  '6xl': scale(48),
};

// Responsive spacing
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  '2xl': scale(48),
  '3xl': scale(64),
};

// Responsive border radius
export const borderRadius = {
  sm: scale(4),
  md: scale(8),
  lg: scale(12),
  xl: scale(16),
  '2xl': scale(24),
  full: scale(9999),
};

// Responsive padding/margin
export const padding = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  '2xl': scale(48),
};

// Responsive icon sizes
export const iconSize = {
  xs: scale(12),
  sm: scale(16),
  md: scale(20),
  lg: scale(24),
  xl: scale(32),
  '2xl': scale(48),
};

// Responsive button sizes
export const buttonSize = {
  sm: {
    height: scale(32),
    paddingHorizontal: scale(12),
    fontSize: fontSize.sm,
  },
  md: {
    height: scale(40),
    paddingHorizontal: scale(16),
    fontSize: fontSize.base,
  },
  lg: {
    height: scale(48),
    paddingHorizontal: scale(24),
    fontSize: fontSize.lg,
  },
};

// Responsive input sizes
export const inputSize = {
  sm: {
    height: scale(36),
    paddingHorizontal: scale(12),
    fontSize: fontSize.sm,
  },
  md: {
    height: scale(44),
    paddingHorizontal: scale(16),
    fontSize: fontSize.base,
  },
  lg: {
    height: scale(52),
    paddingHorizontal: scale(20),
    fontSize: fontSize.lg,
  },
};

// Responsive card sizes
export const cardSize = {
  sm: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  md: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  lg: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
};

// Responsive grid columns based on screen size
export const getGridColumns = () => {
  if (isSmallDevice) return 1;
  if (isMediumDevice) return 2;
  if (isLargeDevice) return 2;
  if (isXLargeDevice) return 3;
  if (isXXLargeDevice) return 4;
  return 2;
};

// Responsive aspect ratios
export const aspectRatio = {
  square: 1,
  video: 16 / 9,
  photo: 4 / 3,
  portrait: 3 / 4,
  wide: 21 / 9,
};

// Platform-specific adjustments
export const platformAdjustments = {
  ios: {
    topPadding: Platform.OS === 'ios' ? 44 : 0,
    bottomPadding: Platform.OS === 'ios' ? 34 : 0,
  },
  android: {
    topPadding: Platform.OS === 'android' ? 24 : 0,
    bottomPadding: Platform.OS === 'android' ? 0 : 0,
  },
};

// Responsive layout helpers
export const layout = {
  container: {
    flex: 1,
    paddingHorizontal: isTablet ? spacing.xl : spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spaceAround: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
};

// Responsive shadow
export const shadow = {
  sm: {
    shadowOffset: { width: 0, height: scale(1) },
    shadowOpacity: 0.1,
    shadowRadius: scale(2),
    elevation: scale(2),
  },
  md: {
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.15,
    shadowRadius: scale(4),
    elevation: scale(4),
  },
  lg: {
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.2,
    shadowRadius: scale(8),
    elevation: scale(8),
  },
};

// Responsive image sizes
export const imageSize = {
  thumbnail: {
    width: scale(60),
    height: scale(60),
  },
  small: {
    width: scale(80),
    height: scale(80),
  },
  medium: {
    width: scale(120),
    height: scale(120),
  },
  large: {
    width: scale(200),
    height: scale(200),
  },
  xlarge: {
    width: scale(300),
    height: scale(300),
  },
};

// Export screen dimensions for convenience
export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isLandscape: SCREEN_WIDTH > SCREEN_HEIGHT,
  isPortrait: SCREEN_HEIGHT > SCREEN_WIDTH,
};

// Responsive hook for dynamic updates
export const useResponsive = () => {
  return {
    scale,
    verticalScale,
    moderateScale,
    responsiveWidth,
    responsiveHeight,
    fontSize,
    spacing,
    borderRadius,
    padding,
    iconSize,
    buttonSize,
    inputSize,
    cardSize,
    getGridColumns,
    aspectRatio,
    platformAdjustments,
    layout,
    shadow,
    imageSize,
    screenDimensions,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isXLargeDevice,
    isXXLargeDevice,
    isTablet,
    isPhone,
  };
}; 