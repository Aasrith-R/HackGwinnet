import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import SoftCard from '@/components/ui/SoftCard';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemedView } from '@/components/themed-view';
import DevTools from '@/components/DevTools';

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={styles.title}>Settings ⚙️</ThemedText>
        <SoftCard style={styles.card}>
          <ThemedText type="subtitle">Preferences</ThemedText>
        </SoftCard>
        
        {__DEV__ && (
          <SoftCard style={styles.devCard}>
            <ThemedText type="subtitle" style={styles.devTitle}>Development Tools</ThemedText>
            <DevTools />
          </SoftCard>
        )}
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
  devCard: {
    marginTop: 20,
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
  },
  devTitle: {
    color: '#92400e',
    marginBottom: 10,
  },
});