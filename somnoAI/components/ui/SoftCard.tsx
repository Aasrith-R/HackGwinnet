import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import theme from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export default function SoftCard({ children, style }: Props) {
  const scheme = useColorScheme();
  const colors = (theme as any).Colors[scheme === 'dark' ? 'dark' : 'light'];

  return <View style={[styles.card, { backgroundColor: colors.card }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: (theme as any).Radii.md,
    padding: (theme as any).Spacing.md,
    // subtle shadow; actual values are defined in theme.Shadows but we duplicate for cross-platform
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
});
