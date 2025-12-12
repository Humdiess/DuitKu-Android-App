/**
 * iOS 26 Liquid Glass Theme
 * Premium design system with frosted glass effects
 */

import { Platform } from 'react-native';

// Dark Mode Colors (Default)
export const darkColors = {
  // Backgrounds
  bgBase: '#000000',
  bgElevated: 'rgba(28, 28, 30, 0.8)',
  glassBg: 'rgba(255, 255, 255, 0.08)',
  glassBgHeavy: 'rgba(255, 255, 255, 0.12)',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
  
  // Accent
  accentColor: '#0A84FF',
  accentSecondary: '#5E5CE6',
  
  // System Colors
  systemGreen: '#30D158',
  systemRed: '#FF453A',
  systemOrange: '#FF9F0A',
  systemYellow: '#FFD60A',
  
  // Borders & Fills
  separator: 'rgba(255, 255, 255, 0.08)',
  fillPrimary: 'rgba(120, 120, 128, 0.36)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
};

// Light Mode Colors
export const lightColors = {
  // Backgrounds
  bgBase: '#F2F2F7',
  bgElevated: 'rgba(255, 255, 255, 0.8)',
  glassBg: 'rgba(255, 255, 255, 0.6)',
  glassBgHeavy: 'rgba(255, 255, 255, 0.75)',
  
  // Text
  textPrimary: '#000000',
  textSecondary: 'rgba(0, 0, 0, 0.6)',
  textTertiary: 'rgba(0, 0, 0, 0.4)',
  
  // Accent
  accentColor: '#007AFF',
  accentSecondary: '#5856D6',
  
  // System Colors
  systemGreen: '#34C759',
  systemRed: '#FF3B30',
  systemOrange: '#FF9500',
  systemYellow: '#FFCC00',
  
  // Borders & Fills
  separator: 'rgba(0, 0, 0, 0.08)',
  fillPrimary: 'rgba(120, 120, 128, 0.2)',
  glassBorder: 'rgba(0, 0, 0, 0.06)',
};

// Typography
export const typography = {
  // Font Family
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  
  // Sizes
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: -0.2,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  stat: {
    fontSize: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const borderRadius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Export default theme
export const Colors = {
  light: lightColors,
  dark: darkColors,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
