import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '@/constants/theme';

type Props = {
  children?: React.ReactNode;
  variant?: 'sleep' | 'wake' | 'home' | 'default';
  style?: ViewStyle | ViewStyle[];
};

export default function GradientBackground({ children, variant = 'home', style }: Props) {
  const colors = (theme as any).Gradients[variant] || (theme as any).Gradients.home;

  return (
    <LinearGradient colors={colors} style={[styles.container, style as any]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
