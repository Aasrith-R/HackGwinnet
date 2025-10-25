import React from 'react';
import { StyleSheet } from 'react-native';
import GradientBackground from '@/components/ui/GradientBackground';
import { ThemedText } from '@/components/themed-text';
import SoftCard from '@/components/ui/SoftCard';
import { ScrollView } from 'react-native-gesture-handler';

export default function JournalScreen() {
  return (
    <GradientBackground variant="home">
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={styles.title}>Sleep Journal 📓</ThemedText>
        <SoftCard style={styles.card}>
          <ThemedText type="subtitle">Today's Sleep Quality</ThemedText>
        </SoftCard>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    marginTop: 60,
  },
  card: {
    marginTop: 20,
  },
});