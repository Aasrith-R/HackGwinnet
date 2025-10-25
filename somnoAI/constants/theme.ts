/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

/**
 * SomnoAI design tokens — soft, minimal, calm.
 * These tokens are intentionally small and easy to extend.
 */

export const Palette = {
  lavender: '#C4B5FD', // primary accent
  midnight: '#1E293B', // deep background
  softWhite: '#F8FAFC',
  skyBlue: '#93C5FD',
  pastelGray: '#E2E8F0',
  pink: '#FBCFE8',
  transparent: 'transparent',
};

export const Colors = {
  light: {
    text: '#0F172A', // dark text on soft backgrounds
    background: Palette.softWhite,
    card: Palette.pastelGray,
    accent: Palette.lavender,
    accentSecondary: Palette.skyBlue,
    muted: '#6B7280',
    icon: '#475569',
    tabIconDefault: '#94A3B8',
    tabIconSelected: Palette.lavender,
  },
  dark: {
    text: Palette.softWhite,
    background: Palette.midnight,
    card: '#0b1220',
    accent: Palette.lavender,
    accentSecondary: Palette.skyBlue,
    muted: '#9CA3AF',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: Palette.lavender,
  },
};

export const Gradients = {
  sleep: [Palette.midnight, '#0f1b2a', Palette.lavender],
  wake: ['#FFF7ED', Palette.skyBlue, '#FEF3C7'],
  home: [Palette.lavender, Palette.skyBlue, Palette.pink],
};

export const Radii = {
  xs: 6,
  sm: 12,
  md: 16,
  lg: 24,
  pill: 9999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter',
    rounded: 'SF Pro Rounded',
    mono: 'Menlo',
  },
  default: {
    sans: 'Inter',
    rounded: 'Inter',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    rounded: "'SF Pro Rounded', Inter, system-ui, -apple-system",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export default { Palette, Colors, Gradients, Radii, Spacing, Fonts, Shadows };
