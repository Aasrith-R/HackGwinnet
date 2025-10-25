/**
 * Backend Service
 * Handles communication with the SonmoAI Flask backend
 * Falls back to local storage when backend is unavailable
 */

import { localStorage, LocalAlarmProfile, LocalUser, LocalFeedback } from './localStorage';

// Use localhost for web, IP for mobile
const BACKEND_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:5001' 
  : 'http://10.21.205.43:5001';

export interface AlarmConfig {
  id: string;
  user_id: string;
  wake_time: string;
  sound: string;
  volume_ramp: number;
  duration: number;
  pattern: string;
  reasoning?: string;
  created_at: number;
}

export interface UserProfile {
  id: string;
  email: string;
  goal_wake_time: string;
  wake_up_duration: number;
  sleep_sensitivity?: string;
}

export interface FeedbackData {
  alarm_profile_id: string;
  user_id: string;
  happiness_rating: number;
  alarm_effectiveness: 'gentle' | 'harsh' | 'just_right';
  woke_up_late: boolean;
}

class BackendService {
  private baseUrl: string;

  constructor(baseUrl: string = BACKEND_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generate a new AI-optimized alarm configuration
   */
  async generateAlarm(userId: string, wakeTime?: string): Promise<AlarmConfig> {
    try {
      const response = await fetch(`${this.baseUrl}/api/alarm/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_id: userId,
          wake_time: wakeTime 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const alarm = data.alarm;
      
      // Save to local storage for offline access and dev tools
      await localStorage.createAlarmProfile({
        user_id: alarm.user_id,
        wake_time: alarm.wake_time,
        sound: alarm.sound,
        volume_ramp: alarm.volume_ramp,
        duration: alarm.duration,
        pattern: alarm.pattern
      });
      
      return alarm;
    } catch (error) {
      console.log('Backend unavailable, using local mock alarm generation');
      return this.generateMockAlarm(userId, wakeTime);
    }
  }

  /**
   * Generate a mock alarm when backend is unavailable
   */
  private async generateMockAlarm(userId: string, wakeTime?: string): Promise<AlarmConfig> {
    const mockAlarm: AlarmConfig = {
      id: `alarm-${Date.now()}`,
      user_id: userId,
      wake_time: wakeTime || '07:00',
      sound: 'nature',
      volume_ramp: 5,
      duration: 15,
      pattern: 'Gentle nature sounds starting soft, gradually increasing to pleasant volume over 5 minutes, followed by sustained wake-up sounds',
      reasoning: `Mock alarm generated locally for ${wakeTime || '07:00'} - uses gentle nature sounds for a pleasant wake-up experience`,
      created_at: Date.now()
    };

    // Save to local storage
    await localStorage.createAlarmProfile(mockAlarm);
    return mockAlarm;
  }

  /**
   * Get the current alarm configuration for a user
   */
  async getCurrentAlarm(userId: string): Promise<AlarmConfig | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/alarm/current?user_id=${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.alarm;
    } catch (error) {
      console.log('Backend unavailable, using local storage');
      const localAlarm = await localStorage.getCurrentAlarm(userId);
      return localAlarm ? this.convertLocalToAlarmConfig(localAlarm) : null;
    }
  }

  /**
   * Submit feedback for an alarm
   */
  async submitFeedback(feedback: FeedbackData): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/alarm/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.log('Backend unavailable, saving feedback locally');
      await localStorage.createFeedback(feedback);
    }
  }

  /**
   * Submit user quiz data
   */
  async submitQuiz(quizData: {
    email: string;
    goal_wake_time: string;
    wake_up_duration: number;
    sleep_sensitivity: string;
    preferred_sounds?: string[];
  }): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/api/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }

  /**
   * Get alarm history for a user
   */
  async getAlarmHistory(userId: string, limit: number = 10): Promise<AlarmConfig[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/alarm/history?user_id=${userId}&limit=${limit}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.alarms;
    } catch (error) {
      console.error('Error getting alarm history:', error);
      return [];
    }
  }

  /**
   * Check if the backend is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/`);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  /**
   * Convert local storage alarm to AlarmConfig format
   */
  private convertLocalToAlarmConfig(localAlarm: LocalAlarmProfile): AlarmConfig {
    return {
      id: localAlarm.id,
      user_id: localAlarm.user_id,
      wake_time: localAlarm.wake_time,
      sound: localAlarm.sound,
      volume_ramp: localAlarm.volume_ramp,
      duration: localAlarm.duration,
      pattern: localAlarm.pattern,
      created_at: new Date(localAlarm.created_at).getTime()
    };
  }
}

export const backendService = new BackendService();
