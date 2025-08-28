// Design tokens for Cerco - Posh-chill mid-century/Bauhaus theme
export const colors = {
  // Primary palette
  charcoal: '#1B1B1B',
  cream: '#F4F1EB',
  terracotta: '#C77B5C',
  brass: '#D6B370',
  sage: '#8A9A5B',

  // Extended palette
  charcoalLight: '#2A2A2A',
  charcoalLighter: '#3A3A3A',
  creamDark: '#E8E4DD',
  creamDarker: '#DCD8D1',
  terracottaLight: '#D89A7A',
  terracottaDark: '#B56A4A',
  brassLight: '#E4C890',
  brassDark: '#C8A060',
  sageLight: '#9AAA6B',
  sageDark: '#7A8A4B',

  // Semantic colors
  success: '#8A9A5B',
  warning: '#D6B370',
  error: '#C77B5C',
  info: '#8A9A5B',

  // Neutral grays
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const typography = {
  fontFamily: {
    headline: 'Manrope_600SemiBold',
    body: 'Inter_400Regular',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
    display: 48,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
};

export const blur = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
};

export const animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};
