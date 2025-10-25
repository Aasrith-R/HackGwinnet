/**
 * Local Storage Service
 * Replaces Supabase functionality when network is blocked
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocalUser {
  id: string;
  email: string;
  goal_wake_time: string;
  wake_up_duration: number;
  sleep_sensitivity?: string;
  created_at: string;
}

export interface LocalAlarmProfile {
  id: string;
  user_id: string;
  wake_time: string;
  sound: string;
  volume_ramp: number;
  duration: number;
  pattern: string;
  created_at: string;
}

export interface LocalFeedback {
  id: string;
  alarm_profile_id: string;
  user_id: string;
  happiness_rating: number;
  alarm_effectiveness: string;
  woke_up_late: boolean;
  created_at: string;
}

class LocalStorageService {
  private async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  private async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }

  // User operations
  async createUser(userData: Omit<LocalUser, 'id' | 'created_at'>): Promise<LocalUser> {
    const user: LocalUser = {
      ...userData,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    
    await this.setItem('current_user', user);
    return user;
  }

  async getCurrentUser(): Promise<LocalUser | null> {
    return await this.getItem<LocalUser>('current_user');
  }

  async updateUser(updates: Partial<LocalUser>): Promise<LocalUser | null> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser = { ...currentUser, ...updates };
    await this.setItem('current_user', updatedUser);
    return updatedUser;
  }

  // Alarm operations
  async createAlarmProfile(alarmData: Omit<LocalAlarmProfile, 'id' | 'created_at'>): Promise<LocalAlarmProfile> {
    const alarm: LocalAlarmProfile = {
      ...alarmData,
      id: `alarm-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    // Get existing alarms
    const alarms = await this.getItem<LocalAlarmProfile[]>('alarm_profiles') || [];
    alarms.push(alarm);
    await this.setItem('alarm_profiles', alarms);

    return alarm;
  }

  async getCurrentAlarm(userId: string): Promise<LocalAlarmProfile | null> {
    const alarms = await this.getItem<LocalAlarmProfile[]>('alarm_profiles') || [];
    const userAlarms = alarms.filter(alarm => alarm.user_id === userId);
    return userAlarms.length > 0 ? userAlarms[userAlarms.length - 1] : null;
  }

  async getAlarmHistory(userId: string, limit: number = 50): Promise<LocalAlarmProfile[]> {
    const alarms = await this.getItem<LocalAlarmProfile[]>('alarm_profiles') || [];
    const userAlarms = alarms
      .filter(alarm => alarm.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
    
    return userAlarms;
  }

  // Feedback operations
  async createFeedback(feedbackData: Omit<LocalFeedback, 'id' | 'created_at'>): Promise<LocalFeedback> {
    const feedback: LocalFeedback = {
      ...feedbackData,
      id: `feedback-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    // Get existing feedback
    const feedbacks = await this.getItem<LocalFeedback[]>('feedbacks') || [];
    feedbacks.push(feedback);
    await this.setItem('feedbacks', feedbacks);

    return feedback;
  }

  async getUserFeedback(userId: string, limit: number = 50): Promise<LocalFeedback[]> {
    const feedbacks = await this.getItem<LocalFeedback[]>('feedbacks') || [];
    const userFeedbacks = feedbacks
      .filter(feedback => feedback.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
    
    return userFeedbacks;
  }

  // Clear all data (for testing)
  async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove([
      'current_user',
      'alarm_profiles',
      'feedbacks',
      'mock_user',
      'dev_user'
    ]);
  }

  // Get all data (for debugging)
  async getAllData(): Promise<{
    user: LocalUser | null;
    alarms: LocalAlarmProfile[];
    feedbacks: LocalFeedback[];
  }> {
    const user = await this.getCurrentUser();
    const alarms = await this.getItem<LocalAlarmProfile[]>('alarm_profiles') || [];
    const feedbacks = await this.getItem<LocalFeedback[]>('feedbacks') || [];

    return { user, alarms, feedbacks };
  }
}

export const localStorage = new LocalStorageService();
