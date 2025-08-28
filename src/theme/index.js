import { colors, spacing, borderRadius, shadows, typography, blur, animation } from './tokens';

export const lightTheme = {
  colors: {
    // Background colors
    background: colors.cream,
    surface: colors.gray50,
    surfaceSecondary: colors.creamDark,
    surfaceTertiary: colors.gray100,

    // Text colors
    textPrimary: colors.charcoal,
    textSecondary: colors.gray700,
    textTertiary: colors.gray500,
    textInverse: colors.cream,

    // Accent colors
    primary: colors.terracotta,
    primaryLight: colors.terracottaLight,
    primaryDark: colors.terracottaDark,
    secondary: colors.brass,
    secondaryLight: colors.brassLight,
    secondaryDark: colors.brassDark,
    accent: colors.sage,
    accentLight: colors.sageLight,
    accentDark: colors.sageDark,

    // Status colors
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,

    // Border colors
    border: colors.gray200,
    borderLight: colors.gray100,
    borderDark: colors.gray300,

    // Interactive colors
    interactive: colors.terracotta,
    interactiveLight: colors.terracottaLight,
    interactivePressed: colors.terracottaDark,
  },
  spacing,
  borderRadius,
  shadows,
  typography,
  blur,
  animation,
};

export const darkTheme = {
  colors: {
    // Background colors
    background: colors.charcoal,
    surface: colors.charcoalLight,
    surfaceSecondary: colors.charcoalLighter,
    surfaceTertiary: colors.gray800,

    // Text colors
    textPrimary: colors.cream,
    textSecondary: colors.gray300,
    textTertiary: colors.gray500,
    textInverse: colors.charcoal,

    // Accent colors
    primary: colors.terracottaLight,
    primaryLight: colors.terracotta,
    primaryDark: colors.terracottaDark,
    secondary: colors.brassLight,
    secondaryLight: colors.brass,
    secondaryDark: colors.brassDark,
    accent: colors.sageLight,
    accentLight: colors.sage,
    accentDark: colors.sageDark,

    // Status colors
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,

    // Border colors
    border: colors.gray700,
    borderLight: colors.gray800,
    borderDark: colors.gray600,

    // Interactive colors
    interactive: colors.terracottaLight,
    interactiveLight: colors.terracotta,
    interactivePressed: colors.terracottaDark,
  },
  spacing,
  borderRadius,
  shadows: {
    sm: {
      ...shadows.sm,
      shadowColor: colors.charcoal,
      shadowOpacity: 0.3,
    },
    md: {
      ...shadows.md,
      shadowColor: colors.charcoal,
      shadowOpacity: 0.4,
    },
    lg: {
      ...shadows.lg,
      shadowColor: colors.charcoal,
      shadowOpacity: 0.5,
    },
  },
  typography,
  blur,
  animation,
};
