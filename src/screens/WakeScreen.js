/**
 * WakeScreen - AI morning brief with weather and gentle alarm
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import WeatherCard from '../components/WeatherCard';
import InsightCard from '../components/InsightCard';
import { generateMorningBrief, generateMockWeather } from '../utils/aiMock';
import { sleepStorage, moodStorage } from '../utils/storage';

const { width } = Dimensions.get('window');

export default function WakeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [morningBrief, setMorningBrief] = useState('');
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [sleepData, setSleepData] = useState(null);
  const [currentMood, setCurrentMood] = useState('Peaceful');

  useEffect(() => {
    loadWakeData();
    startClock();
    loadWeather();
  }, []);

  const startClock = () => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  };

  const loadWakeData = async () => {
    try {
      const mood = await moodStorage.getCurrentMood();
      setCurrentMood(mood);
      
      const logs = await sleepStorage.getSleepLogs();
      const lastNight = logs[logs.length - 1];
      setSleepData(lastNight);
      
      const weatherData = generateMockWeather();
      const brief = generateMorningBrief(lastNight, weatherData, mood);
      setMorningBrief(brief);
    } catch (error) {
      console.error('Error loading wake data:', error);
    }
  };

  const loadWeather = async () => {
    try {
      const weatherData = generateMockWeather();
      setWeather(weatherData);
    } catch (error) {
      console.error('Error loading weather:', error);
    }
  };

  const playAlarm = () => {
    setIsAlarmPlaying(true);
    
    Alert.alert(
      'Good Morning!',
      'Time to wake up and start your day!',
      [
        {
          text: 'Snooze (5 min)',
          onPress: () => {
            setTimeout(() => {
              Alert.alert('Wake Up!', 'Time to get up!');
            }, 5 * 60 * 1000);
          }
        },
        {
          text: 'Stop Alarm',
          onPress: () => setIsAlarmPlaying(false)
        }
      ]
    );
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const getQuickActions = () => [
    {
      title: 'Start Day',
      subtitle: 'Begin your morning routine',
      icon: 'sunny',
      color: '#f59e0b',
      onPress: () => Alert.alert('Morning Routine', 'Time to start your day!')
    },
    {
      title: 'Check Weather',
      subtitle: 'Plan your day',
      icon: 'partly-sunny',
      color: '#3b82f6',
      onPress: loadWeather
    },
    {
      title: 'Log Sleep',
      subtitle: 'Record your sleep quality',
      icon: 'book',
      color: '#10b981',
      onPress: () => Alert.alert('Sleep Log', 'Record your sleep quality')
    },
    {
      title: 'Set Alarm',
      subtitle: 'Schedule tomorrow\'s wake up',
      icon: 'alarm',
      color: '#8b5cf6',
      onPress: () => Alert.alert('Alarm Set', 'Alarm set for tomorrow')
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with time and greeting */}
      <LinearGradient
        colors={getMoodGradient(currentMood)}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.time}>{formatTime(currentTime)}</Text>
            <Text style={styles.date}>{formatDate(currentTime)}</Text>
          </View>
          <View style={styles.moodIndicator}>
            <Ionicons name="sunny" size={32} color="white" />
            <Text style={styles.moodText}>{currentMood}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Weather Card */}
      <WeatherCard style={styles.weatherCard} />

      {/* AI Morning Brief */}
      {morningBrief && (
        <InsightCard
          title="Your Morning Brief"
          insight={morningBrief}
          type="info"
          style={styles.briefCard}
        />
      )}

      {/* Sleep Summary */}
      {sleepData && (
        <View style={styles.section}>
          <View style={styles.sleepSummaryCard}>
            <Text style={styles.summaryTitle}>Last Night's Sleep</Text>
            <View style={styles.sleepStats}>
              <View style={styles.sleepStat}>
                <Text style={styles.sleepStatValue}>
                  {sleepData.bedtime}:00
                </Text>
                <Text style={styles.sleepStatLabel}>Bedtime</Text>
              </View>
              <View style={styles.sleepStat}>
                <Text style={styles.sleepStatValue}>
                  {sleepData.wakeTime}:00
                </Text>
                <Text style={styles.sleepStatLabel}>Wake Time</Text>
              </View>
              <View style={styles.sleepStat}>
                <Text style={styles.sleepStatValue}>
                  {sleepData.wakeTime - sleepData.bedtime}h
                </Text>
                <Text style={styles.sleepStatLabel}>Duration</Text>
              </View>
              <View style={styles.sleepStat}>
                <Text style={styles.sleepStatValue}>
                  {sleepData.quality}/5
                </Text>
                <Text style={styles.sleepStatLabel}>Quality</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Alarm Controls */}
      <View style={styles.section}>
        <View style={styles.alarmCard}>
          <Text style={styles.alarmTitle}>Wake Up Alarm</Text>
          <Text style={styles.alarmSubtitle}>
            {isAlarmPlaying ? 'Alarm is playing' : 'Ready to wake up'}
          </Text>
          
          <TouchableOpacity
            style={styles.alarmButton}
            onPress={playAlarm}
          >
            <LinearGradient
              colors={isAlarmPlaying ? ['#ef4444', '#dc2626'] : ['#f59e0b', '#d97706']}
              style={styles.alarmButtonGradient}
            >
              <Ionicons
                name={isAlarmPlaying ? 'stop' : 'alarm'}
                size={24}
                color="white"
              />
              <Text style={styles.alarmButtonText}>
                  {isAlarmPlaying ? 'Stop Alarm' : 'Wake Up!'}
                </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

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

      {/* Morning Tips */}
      <View style={styles.section}>
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Morning Tips</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.tipText}>Drink a glass of water to hydrate</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.tipText}>Get some natural sunlight</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={styles.tipText}>Take 5 deep breaths to center yourself</Text>
          </View>
        </View>
      </View>
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
  time: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  date: {
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
  briefCard: {
    margin: 16,
    marginTop: 0,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  sleepSummaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  sleepStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sleepStat: {
    alignItems: 'center',
  },
  sleepStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  sleepStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  alarmCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  alarmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  alarmSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  alarmButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  alarmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  alarmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 44) / 2,
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
  tipsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
});
