/**
 * SleepScreen - AI-powered sleep sound mixer with mood-based personalization
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import MoodSelector from '../components/MoodSelector';
import SoundMixer from '../components/SoundMixer';
import { generateSoundProfile } from '../utils/aiMock';
import { moodStorage, sessionStorage } from '../utils/storage';

export default function SleepScreen() {
  const [currentMood, setCurrentMood] = useState('Peaceful');
  const [soundProfile, setSoundProfile] = useState(null);
  const [isSleepModeActive, setIsSleepModeActive] = useState(false);
  const [sleepStartTime, setSleepStartTime] = useState(null);

  useEffect(() => {
    loadUserMood();
  }, []);

  useEffect(() => {
    if (currentMood) {
      const profile = generateSoundProfile(currentMood);
      setSoundProfile(profile);
    }
  }, [currentMood]);

  const loadUserMood = async () => {
    try {
      const mood = await moodStorage.getCurrentMood();
      setCurrentMood(mood);
    } catch (error) {
      console.error('Error loading mood:', error);
    }
  };

  const handleMoodChange = async (mood) => {
    setCurrentMood(mood);
    await moodStorage.saveCurrentMood(mood);
  };

  const startSleepMode = () => {
    const startTime = new Date();
    setSleepStartTime(startTime);
    setIsSleepModeActive(true);
    
    // Save sleep session
    sessionStorage.saveSleepSession({
      startTime: startTime.toISOString(),
      mood: currentMood,
      soundProfile: soundProfile
    });

    Alert.alert(
      'Sleep Mode Started',
      'Your personalized soundscape is now playing. Sweet dreams!',
      [{ text: 'OK' }]
    );
  };

  const stopSleepMode = () => {
    setIsSleepModeActive(false);
    setSleepStartTime(null);
    
    Alert.alert(
      'Sleep Mode Stopped',
      'Your sleep session has been recorded.',
      [{ text: 'OK' }]
    );
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

  const getSleepDuration = () => {
    if (!sleepStartTime) return '0:00';
    
    const now = new Date();
    const duration = Math.floor((now - sleepStartTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={getMoodGradient(currentMood)}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Sleep Mode</Text>
            <Text style={styles.subtitle}>
              {isSleepModeActive 
                ? `Sleeping for ${getSleepDuration()}` 
                : 'AI-powered soundscapes for better sleep'
              }
            </Text>
          </View>
          <Ionicons name="moon" size={32} color="white" />
        </View>
      </LinearGradient>

      {/* Mood Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling?</Text>
        <MoodSelector
          selectedMood={currentMood}
          onMoodChange={handleMoodChange}
        />
      </View>

      {/* Sound Profile Info */}
      {soundProfile && (
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Ionicons name="musical-notes" size={24} color="#6366f1" />
              <Text style={styles.profileTitle}>AI Sound Profile</Text>
            </View>
            <Text style={styles.profileDescription}>
              {soundProfile.description}
            </Text>
            <View style={styles.soundsList}>
              {soundProfile.sounds.map((sound, index) => (
                <View key={sound} style={styles.soundItem}>
                  <Ionicons name="radio" size={16} color="#6b7280" />
                  <Text style={styles.soundName}>{sound}</Text>
                  <Text style={styles.soundIntensity}>
                    {Math.round((soundProfile.intensities[index] || 0.5) * 100)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Sound Mixer */}
      <View style={styles.section}>
        <SoundMixer
          mood={currentMood}
          onSoundChange={(sounds) => console.log('Sound changed:', sounds)}
        />
      </View>

      {/* Sleep Controls */}
      <View style={styles.section}>
        <View style={styles.controlsCard}>
          <Text style={styles.controlsTitle}>Sleep Controls</Text>
          
          {!isSleepModeActive ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={startSleepMode}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.startButtonGradient}
              >
                <Ionicons name="play" size={24} color="white" />
                <Text style={styles.startButtonText}>Start Sleep Mode</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopSleepMode}
            >
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.stopButtonGradient}
              >
                <Ionicons name="stop" size={24} color="white" />
                <Text style={styles.stopButtonText}>Stop Sleep Mode</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={styles.sleepTips}>
            <Text style={styles.tipsTitle}>Sleep Tips</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.tipText}>Avoid screens 30 minutes before bed</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.tipText}>Keep your bedroom cool and dark</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.tipText}>Try deep breathing exercises</Text>
            </View>
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
  title: {
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
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  profileDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  soundsList: {
    gap: 8,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  soundName: {
    fontSize: 14,
    color: '#1f2937',
    marginLeft: 8,
    flex: 1,
    textTransform: 'capitalize',
  },
  soundIntensity: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  controlsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  stopButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  stopButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  sleepTips: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
});
