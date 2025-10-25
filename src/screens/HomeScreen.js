/**
 * HomeScreen - Central hub with navigation and AI recommendations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import WeatherCard from '../components/WeatherCard';
import InsightCard from '../components/InsightCard';
import { generateDailyRecommendation } from '../utils/aiMock';
import { sleepStorage, moodStorage } from '../utils/storage';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [currentMood, setCurrentMood] = useState('Peaceful');
  const [recommendation, setRecommendation] = useState('');
  const [sleepLogs, setSleepLogs] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const mood = await moodStorage.getCurrentMood();
      setCurrentMood(mood);
      
      const logs = await sleepStorage.getWeeklyLogs();
      setSleepLogs(logs);
      
      const dailyRec = generateDailyRecommendation(logs, mood);
      setRecommendation(dailyRec);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const getMoodGradient = (mood) => {
    const gradients = {
      'Peaceful': ['#10b981', '#059669'],
      'Anxious': ['#f59e0b', '#d97706'],
      'Tired': ['#6366f1', '#4f46e5'],
      'Stressed': ['#ef4444', '#dc2626'],
      'Energetic': ['#f59e0b', '#d97706']
    };
    return gradients[mood] || ['#6366f1', '#4f46e5'];
  };

  const getMoodIcon = (mood) => {
    const icons = {
      'Peaceful': 'leaf',
      'Anxious': 'cloudy',
      'Tired': 'moon',
      'Stressed': 'flash',
      'Energetic': 'sunny'
    };
    return icons[mood] || 'leaf';
  };

  const getQuickActions = () => {
    const timeOfDay = getTimeOfDay();
    
    if (timeOfDay === 'evening') {
      return [
        {
          title: 'Start Sleep Mode',
          subtitle: 'Begin your bedtime routine',
          icon: 'moon',
          color: '#6366f1',
          onPress: () => navigation.navigate('Sleep')
        },
        {
          title: 'Log Sleep',
          subtitle: 'Record your sleep data',
          icon: 'book',
          color: '#10b981',
          onPress: () => navigation.navigate('Journal')
        }
      ];
    } else {
      return [
        {
          title: 'Wake Up',
          subtitle: 'Start your morning routine',
          icon: 'sunny',
          color: '#f59e0b',
          onPress: () => navigation.navigate('Wake')
        },
        {
          title: 'View Journal',
          subtitle: 'Check your sleep insights',
          icon: 'analytics',
          color: '#8b5cf6',
          onPress: () => navigation.navigate('Journal')
        }
      ];
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with greeting and mood */}
      <LinearGradient
        colors={getMoodGradient(currentMood)}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.subtitle}>Ready for a great {getTimeOfDay()}?</Text>
          </View>
          <View style={styles.moodIndicator}>
            <Ionicons
              name={getMoodIcon(currentMood)}
              size={32}
              color="white"
            />
            <Text style={styles.moodText}>{currentMood}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Weather Card */}
      <WeatherCard style={styles.weatherCard} />

      {/* AI Recommendation */}
      {recommendation && (
        <InsightCard
          title="Today's Recommendation"
          insight={recommendation}
          type="info"
          style={styles.recommendationCard}
        />
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {getQuickActions().map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={24} color="white" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Navigation Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore</Text>
        <View style={styles.navigationGrid}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Sleep')}
          >
            <LinearGradient
              colors={['#6366f1', '#4f46e5']}
              style={styles.navCardGradient}
            >
              <Ionicons name="moon" size={28} color="white" />
              <Text style={styles.navCardTitle}>Sleep Mode</Text>
              <Text style={styles.navCardSubtitle}>AI-powered soundscapes</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Wake')}
          >
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={styles.navCardGradient}
            >
              <Ionicons name="sunny" size={28} color="white" />
              <Text style={styles.navCardTitle}>Wake Mode</Text>
              <Text style={styles.navCardSubtitle}>Morning brief & alarm</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Journal')}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.navCardGradient}
            >
              <Ionicons name="book" size={28} color="white" />
              <Text style={styles.navCardTitle}>Sleep Journal</Text>
              <Text style={styles.navCardSubtitle}>Track & analyze sleep</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Settings')}
          >
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.navCardGradient}
            >
              <Ionicons name="settings" size={28} color="white" />
              <Text style={styles.navCardTitle}>Settings</Text>
              <Text style={styles.navCardSubtitle}>Preferences & mood</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Sleep Summary */}
      {sleepLogs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sleep</Text>
          <View style={styles.sleepSummary}>
            <View style={styles.sleepStat}>
              <Text style={styles.sleepStatValue}>
                {sleepLogs.length}
              </Text>
              <Text style={styles.sleepStatLabel}>Days Tracked</Text>
            </View>
            <View style={styles.sleepStat}>
              <Text style={styles.sleepStatValue}>
                {Math.round(sleepLogs.reduce((sum, log) => sum + log.quality, 0) / sleepLogs.length * 10) / 10}
              </Text>
              <Text style={styles.sleepStatLabel}>Avg Quality</Text>
            </View>
            <View style={styles.sleepStat}>
              <Text style={styles.sleepStatValue}>
                {Math.round(sleepLogs.reduce((sum, log) => sum + (log.wakeTime - log.bedtime), 0) / sleepLogs.length * 10) / 10}h
              </Text>
              <Text style={styles.sleepStatLabel}>Avg Duration</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
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
  moodIndicator: {
    alignItems: 'center',
  },
  moodText: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
    fontWeight: '600',
  },
  weatherCard: {
    margin: 16,
    marginTop: -8,
  },
  recommendationCard: {
    margin: 16,
    marginTop: 0,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  navCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  navCardGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  navCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },
  navCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  sleepSummary: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sleepStat: {
    flex: 1,
    alignItems: 'center',
  },
  sleepStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  sleepStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});
