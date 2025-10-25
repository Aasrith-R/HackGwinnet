import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import GradientBackground from '@/components/ui/GradientBackground';
import SoftCard from '@/components/ui/SoftCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening';
  
  return (
    <GradientBackground variant="home">
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Good {timeOfDay} 👋
        </ThemedText>
        
        <SoftCard style={styles.tipCard}>
          <ThemedText type="subtitle">AI Sleep Tip</ThemedText>
          <ThemedText style={styles.tipText}>
            Try maintaining a consistent sleep schedule, even on weekends, to regulate your body's natural sleep rhythm.
          </ThemedText>
        </SoftCard>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
        
        <Link href="/sleep" asChild>
          <AnimatedPressable entering={FadeIn.delay(200)}>
            <SoftCard style={styles.actionCard}>
              <IconSymbol name="moon.fill" size={24} color="#C4B5FD" />
              <ThemedText type="defaultSemiBold">Start Sleep Mode</ThemedText>
            </SoftCard>
          </AnimatedPressable>
        </Link>

        <Link href="/journal" asChild>
          <AnimatedPressable entering={FadeIn.delay(400)}>
            <SoftCard style={styles.actionCard}>
              <IconSymbol name="book.closed.fill" size={24} color="#93C5FD" />
              <ThemedText type="defaultSemiBold">Log Sleep Journal</ThemedText>
            </SoftCard>
          </AnimatedPressable>
        </Link>

        <Link href="/wake" asChild>
          <AnimatedPressable entering={FadeIn.delay(600)}>
            <SoftCard style={styles.actionCard}>
              <IconSymbol name="sun.max.fill" size={24} color="#FEF3C7" />
              <ThemedText type="defaultSemiBold">Morning Brief</ThemedText>
            </SoftCard>
          </AnimatedPressable>
        </Link>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  title: {
    marginTop: 60,
  },
  sectionTitle: {
    marginTop: Spacing.lg,
  },
  tipCard: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  tipText: {
    opacity: 0.8,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
});
