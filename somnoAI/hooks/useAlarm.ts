import { useState, useEffect, useCallback } from 'react';
import { backendService, AlarmConfig } from '@/lib/backendService';

export const useAlarm = (userId: string) => {
  const [currentAlarm, setCurrentAlarm] = useState<AlarmConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isHealthy = await backendService.healthCheck();
        setIsBackendConnected(isHealthy);
      } catch (error) {
        console.error('Backend connection check failed:', error);
        setIsBackendConnected(false);
      }
    };

    checkConnection();
  }, []);

  // Load current alarm
  const loadCurrentAlarm = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const alarm = await backendService.getCurrentAlarm(userId);
      setCurrentAlarm(alarm);
    } catch (error) {
      setError('Failed to load current alarm');
      console.error('Error loading current alarm:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Generate new alarm
  const generateNewAlarm = useCallback(async (wakeTime?: string) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const newAlarm = await backendService.generateAlarm(userId, wakeTime);
      setCurrentAlarm(newAlarm);
    } catch (error) {
      setError('Failed to generate new alarm');
      console.error('Error generating alarm:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Submit feedback
  const submitFeedback = useCallback(async (feedback: {
    happiness_rating: number;
    alarm_effectiveness: 'gentle' | 'harsh' | 'just_right';
    woke_up_late: boolean;
  }) => {
    if (!currentAlarm || !userId) return;

    try {
      await backendService.submitFeedback({
        alarm_profile_id: currentAlarm.id,
        user_id: userId,
        ...feedback,
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  }, [currentAlarm, userId]);

  return {
    currentAlarm,
    isLoading,
    error,
    isBackendConnected,
    loadCurrentAlarm,
    generateNewAlarm,
    submitFeedback,
  };
};
