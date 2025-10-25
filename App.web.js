import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock screens for web preview
const HomeScreen = () => (
  <ScrollView style={styles.container}>
    <LinearGradient colors={['#6366f1', '#4f46e5']} style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.subtitle}>Ready for a great day?</Text>
        </View>
        <Ionicons name="moon" size={32} color="white" />
      </View>
    </LinearGradient>
    
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>AI Sleep Assistant</Text>
      <View style={styles.featureCard}>
        <Ionicons name="musical-notes" size={24} color="#6366f1" />
        <Text style={styles.featureTitle}>AI Sound Mixer</Text>
        <Text style={styles.featureDescription}>Personalized soundscapes based on your mood</Text>
      </View>
      
      <View style={styles.featureCard}>
        <Ionicons name="sunny" size={24} color="#f59e0b" />
        <Text style={styles.featureTitle}>Morning Brief</Text>
        <Text style={styles.featureDescription}>AI-generated wake-up messages with weather</Text>
      </View>
      
      <View style={styles.featureCard}>
        <Ionicons name="book" size={24} color="#10b981" />
        <Text style={styles.featureTitle}>Sleep Journal</Text>
        <Text style={styles.featureDescription}>Track patterns and get AI insights</Text>
      </View>
    </View>
  </ScrollView>
);

export default function App() {
  return <HomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
    flex: 1,
  },
});
