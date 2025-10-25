/**
 * SettingsScreen - User preferences and app configuration
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import MoodSelector from '../components/MoodSelector';
import { preferencesStorage, moodStorage, sleepStorage } from '../utils/storage';

export default function SettingsScreen() {
  const [preferences, setPreferences] = useState({
    defaultMood: 'Peaceful',
    soundVolume: 0.7,
    alarmTime: '07:00',
    notifications: true
  });
  const [currentMood, setCurrentMood] = useState('Peaceful');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const prefs = await preferencesStorage.getPreferences();
      const mood = await moodStorage.getCurrentMood();
      
      setPreferences(prefs);
      setCurrentMood(mood);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const savePreferences = async (newPrefs) => {
    try {
      await preferencesStorage.savePreferences(newPrefs);
      setPreferences(newPrefs);
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences');
    }
  };

  const handleMoodChange = async (mood) => {
    setCurrentMood(mood);
    await moodStorage.saveCurrentMood(mood);
    
    const newPrefs = { ...preferences, defaultMood: mood };
    await savePreferences(newPrefs);
  };

  const handleVolumeChange = (volume) => {
    const newPrefs = { ...preferences, soundVolume: volume };
    savePreferences(newPrefs);
  };

  const handleAlarmTimeChange = (time) => {
    const newPrefs = { ...preferences, alarmTime: time };
    savePreferences(newPrefs);
  };

  const handleNotificationsToggle = (value) => {
    const newPrefs = { ...preferences, notifications: value };
    savePreferences(newPrefs);
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your sleep logs and preferences. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await sleepStorage.clearLogs();
              await preferencesStorage.savePreferences({
                defaultMood: 'Peaceful',
                soundVolume: 0.7,
                alarmTime: '07:00',
                notifications: true
              });
              await loadSettings();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const exportData = () => {
    Alert.alert(
      'Export Data',
      'This feature would export your sleep data to a file. In a production app, this would generate a CSV or JSON file.',
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={getMoodGradient(currentMood)}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Customize your SomnoAI experience</Text>
          </View>
          <Ionicons name="settings" size={32} color="white" />
        </View>
      </LinearGradient>

      {/* Mood Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood & Personalization</Text>
        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Default Mood</Text>
          <MoodSelector
            selectedMood={currentMood}
            onMoodChange={handleMoodChange}
            style={styles.moodSelector}
          />
          <Text style={styles.settingDescription}>
            This mood will be used as the default for sleep and wake modes
          </Text>
        </View>
      </View>

      {/* Audio Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio Settings</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound Volume</Text>
              <Text style={styles.settingDescription}>
                Default volume for sleep sounds
              </Text>
            </View>
            <Text style={styles.settingValue}>
              {Math.round(preferences.soundVolume * 100)}%
            </Text>
          </View>
          <View style={styles.volumeSlider}>
            {[0, 0.25, 0.5, 0.75, 1].map((volume) => (
              <TouchableOpacity
                key={volume}
                style={[
                  styles.volumeButton,
                  preferences.soundVolume >= volume && styles.volumeButtonActive
                ]}
                onPress={() => handleVolumeChange(volume)}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Alarm Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alarm Settings</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Default Alarm Time</Text>
              <Text style={styles.settingDescription}>
                Default wake-up time for alarms
              </Text>
            </View>
            <TextInput
              style={styles.timeInput}
              value={preferences.alarmTime}
              onChangeText={handleAlarmTimeChange}
              placeholder="07:00"
            />
          </View>
        </View>
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive reminders and sleep insights
              </Text>
            </View>
            <Switch
              value={preferences.notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: '#d1d5db', true: '#6366f1' }}
              thumbColor={preferences.notifications ? '#ffffff' : '#f3f4f6'}
            />
          </View>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.settingCard}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={exportData}
          >
            <Ionicons name="download" size={20} color="#6366f1" />
            <Text style={styles.actionButtonText}>Export Sleep Data</Text>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={clearAllData}
          >
            <Ionicons name="trash" size={20} color="#ef4444" />
            <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>
              Clear All Data
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingCard}>
          <View style={styles.appInfo}>
            <View style={styles.appIcon}>
              <Ionicons name="moon" size={32} color="#6366f1" />
            </View>
            <View style={styles.appDetails}>
              <Text style={styles.appName}>SomnoAI</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appDescription}>
                AI-powered sleep assistant for better rest
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ for better sleep
        </Text>
        <Text style={styles.footerSubtext}>
          SomnoAI - Your personal sleep companion
        </Text>
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
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  moodSelector: {
    marginVertical: 8,
  },
  volumeSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  volumeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
  },
  volumeButtonActive: {
    backgroundColor: '#6366f1',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
    minWidth: 80,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
    flex: 1,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  appVersion: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  appDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
