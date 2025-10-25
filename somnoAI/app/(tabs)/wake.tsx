import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import GradientBackground from '@/components/ui/GradientBackground';
import { ThemedText } from '@/components/themed-text';
import SoftCard from '@/components/ui/SoftCard';
import { ScrollView } from 'react-native-gesture-handler';
import { useAlarm } from '@/hooks/useAlarm';
import { useDevAuthContext } from '@/lib/devAuthContext';

export default function WakeScreen() {
  const { devUser } = useDevAuthContext();
  const userId = devUser?.id || 'dev-user-123';
  
  // Time picker state
  const [selectedTime, setSelectedTime] = useState('07:00');
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Preset wake times
  const presetTimes = [
    '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', 
    '08:00', '08:30', '09:00', '09:30', '10:00'
  ];
  
  const {
    currentAlarm,
    isLoading,
    error,
    isBackendConnected,
    loadCurrentAlarm,
    generateNewAlarm,
    submitFeedback,
  } = useAlarm(userId);

  useEffect(() => {
    loadCurrentAlarm();
  }, [loadCurrentAlarm]);
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowTimePicker(false);
  };

  const handleGenerateAlarm = async () => {
    try {
      // Generate alarm for the selected time
      await generateNewAlarm(selectedTime);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate new alarm');
    }
  };

  const handleFeedback = (rating: number, effectiveness: 'gentle' | 'harsh' | 'just_right', wokeUpLate: boolean) => {
    Alert.alert(
      'Thank you!',
      'Your feedback helps improve your wake-up experience.',
      [
        {
          text: 'OK',
          onPress: () => submitFeedback({
            happiness_rating: rating,
            alarm_effectiveness: effectiveness,
            woke_up_late: wokeUpLate,
          }),
        },
      ]
    );
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const minute = parseInt(minutes);
      const date = new Date();
      date.setHours(hour, minute);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString;
    }
  };

  return (
    <GradientBackground variant="wake">
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <ThemedText type="title" style={styles.title}>Good Morning ☀️</ThemedText>
        
        {/* Wake Time Selector */}
        <SoftCard style={styles.timeSelectorCard}>
          <ThemedText type="subtitle" style={styles.timeSelectorTitle}>
            🕐 Set Your Wake Time
          </ThemedText>
          
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(!showTimePicker)}
          >
            <ThemedText style={styles.timeButtonText}>
              {selectedTime}
            </ThemedText>
            <ThemedText style={styles.timeButtonSubtext}>Tap to change</ThemedText>
          </TouchableOpacity>
          
          {showTimePicker && (
            <View style={styles.timeGrid}>
              {presetTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeOption,
                    selectedTime === time && styles.timeOptionSelected
                  ]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <ThemedText style={[
                    styles.timeOptionText,
                    selectedTime === time && styles.timeOptionTextSelected
                  ]}>
                    {time}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </SoftCard>
        
        {!isBackendConnected && (
          <SoftCard style={styles.warningCard}>
            <ThemedText style={styles.warningText}>
              ⚠️ Backend not connected. Start the Flask server to see AI-generated alarms.
            </ThemedText>
          </SoftCard>
        )}

        {isBackendConnected && (
          <>
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
                <ThemedText style={styles.loadingText}>Generating your perfect alarm...</ThemedText>
              </View>
            )}

            {error && (
              <SoftCard style={styles.errorCard}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </SoftCard>
            )}

            {currentAlarm && (
              <SoftCard style={styles.alarmCard}>
                <ThemedText type="subtitle" style={styles.alarmTitle}>
                  🎵 Your AI-Optimized Alarm
                </ThemedText>
                
                <View style={styles.alarmDetails}>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Wake Time:</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {formatTime(currentAlarm.wake_time)}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Sound:</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {currentAlarm.sound.charAt(0).toUpperCase() + currentAlarm.sound.slice(1)}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Duration:</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {currentAlarm.duration} minutes
                    </ThemedText>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Volume Ramp:</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {currentAlarm.volume_ramp} minutes
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.patternText}>
                  {currentAlarm.pattern}
                </ThemedText>

                {currentAlarm.reasoning && (
                  <ThemedText style={styles.reasoningText}>
                    💡 {currentAlarm.reasoning}
                  </ThemedText>
                )}
              </SoftCard>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={handleGenerateAlarm}
                disabled={isLoading}
              >
                <ThemedText style={styles.buttonText}>
                  {isLoading ? 'Generating...' : '🎯 Generate New Alarm'}
                </ThemedText>
              </TouchableOpacity>

              {currentAlarm && (
                <View style={styles.feedbackContainer}>
                  <ThemedText style={styles.feedbackTitle}>How was your wake-up?</ThemedText>
                  <View style={styles.feedbackButtons}>
                    <TouchableOpacity
                      style={styles.feedbackButton}
                      onPress={() => handleFeedback(5, 'just_right', false)}
                    >
                      <ThemedText style={styles.feedbackButtonText}>😊 Perfect</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.feedbackButton}
                      onPress={() => handleFeedback(3, 'gentle', false)}
                    >
                      <ThemedText style={styles.feedbackButtonText}>😐 Too Gentle</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.feedbackButton}
                      onPress={() => handleFeedback(2, 'harsh', false)}
                    >
                      <ThemedText style={styles.feedbackButtonText}>😤 Too Harsh</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 100, // Extra padding for scrolling
    gap: 16,
  },
  title: {
    marginTop: 60,
  },
  timeSelectorCard: {
    padding: 20,
    marginVertical: 10,
  },
  timeSelectorTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  timeButton: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  timeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  timeButtonSubtext: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  timeOption: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: '30%',
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
  },
  timeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  timeOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  card: {
    marginTop: 20,
  },
  warningCard: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
    padding: 16,
  },
  warningText: {
    color: '#92400e',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
  },
  errorCard: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
    borderWidth: 1,
    padding: 16,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
  alarmCard: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Dark background for better contrast
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  alarmTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
  },
  alarmDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '700',
    color: '#cbd5e1', // Light gray for labels
    fontSize: 15,
  },
  detailValue: {
    fontWeight: '600',
    color: '#ffffff', // White for values
    fontSize: 15,
  },
  patternText: {
    fontStyle: 'italic',
    color: '#e2e8f0', // Light color for pattern text
    marginBottom: 12,
    lineHeight: 22,
    fontSize: 15,
  },
  reasoningText: {
    fontSize: 14,
    color: '#1d4ed8',
    fontStyle: 'italic',
    fontWeight: '500',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  buttonContainer: {
    marginTop: 20,
  },
  generateButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackContainer: {
    marginTop: 20,
  },
  feedbackTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '700',
    color: '#0f172a',
    fontSize: 16,
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 8,
  },
  feedbackButton: {
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  feedbackButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});