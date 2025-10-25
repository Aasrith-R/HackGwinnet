import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import SoftCard from '@/components/ui/SoftCard';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemedView } from '@/components/themed-view';

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={styles.title}>Settings ⚙️</ThemedText>
        <SoftCard style={styles.card}>
          <ThemedText type="subtitle">Preferences</ThemedText>
        </SoftCard>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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