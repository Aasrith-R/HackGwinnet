/**
 * AsyncStorage utilities for SomnoAI
 * Handles local data persistence for sleep logs and preferences
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SLEEP_LOGS: 'sleep_logs',
  USER_PREFERENCES: 'user_preferences',
  CURRENT_MOOD: 'current_mood',
  LAST_SLEEP_SESSION: 'last_sleep_session'
};

// Sleep logs management
export const sleepStorage = {
  // Save a new sleep log entry
  async saveSleepLog(logData) {
    try {
      const existingLogs = await this.getSleepLogs();
      const newLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...logData
      };
      
      const updatedLogs = [...existingLogs, newLog];
      await AsyncStorage.setItem(STORAGE_KEYS.SLEEP_LOGS, JSON.stringify(updatedLogs));
      return newLog;
    } catch (error) {
      console.error('Error saving sleep log:', error);
      return null;
    }
  },

  // Get all sleep logs
  async getSleepLogs() {
    try {
      const logs = await AsyncStorage.getItem(STORAGE_KEYS.SLEEP_LOGS);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error getting sleep logs:', error);
      return [];
    }
  },

  // Get sleep logs for the past week
  async getWeeklyLogs() {
    try {
      const allLogs = await this.getSleepLogs();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      return allLogs.filter(log => new Date(log.date) >= oneWeekAgo);
    } catch (error) {
      console.error('Error getting weekly logs:', error);
      return [];
    }
  },

  // Clear all sleep logs
  async clearLogs() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SLEEP_LOGS);
      return true;
    } catch (error) {
      console.error('Error clearing logs:', error);
      return false;
    }
  }
};

// User preferences management
export const preferencesStorage = {
  // Save user preferences
  async savePreferences(preferences) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  },

  // Get user preferences
  async getPreferences() {
    try {
      const preferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return preferences ? JSON.parse(preferences) : {
        defaultMood: 'Peaceful',
        soundVolume: 0.7,
        alarmTime: '07:00',
        notifications: true
      };
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {
        defaultMood: 'Peaceful',
        soundVolume: 0.7,
        alarmTime: '07:00',
        notifications: true
      };
    }
  }
};

// Current mood management
export const moodStorage = {
  // Save current mood
  async saveCurrentMood(mood) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_MOOD, mood);
      return true;
    } catch (error) {
      console.error('Error saving mood:', error);
      return false;
    }
  },

  // Get current mood
  async getCurrentMood() {
    try {
      const mood = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_MOOD);
      return mood || 'Peaceful';
    } catch (error) {
      console.error('Error getting mood:', error);
      return 'Peaceful';
    }
  }
};

// Sleep session management
export const sessionStorage = {
  // Save current sleep session
  async saveSleepSession(sessionData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SLEEP_SESSION, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Error saving sleep session:', error);
      return false;
    }
  },

  // Get last sleep session
  async getLastSleepSession() {
    try {
      const session = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SLEEP_SESSION);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error getting sleep session:', error);
      return null;
    }
  }
};
