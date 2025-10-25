import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { localStorage } from '@/lib/localStorage';

export default function DevTools() {
  const [data, setData] = useState<any>(null);

  const loadAllData = async () => {
    try {
      const allData = await localStorage.getAllData();
      setData(allData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all local and backend data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear local storage
              await localStorage.clearAllData();
              
              // Clear backend feedback data
              const backendUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                ? 'http://localhost:5001' 
                : 'http://10.21.205.43:5001';
              const response = await fetch(`${backendUrl}/api/alarm/clear-feedback`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              
              if (response.ok) {
                setData(null);
                Alert.alert('Success', 'All data cleared (local + backend)');
              } else {
                Alert.alert('Warning', 'Local data cleared, but backend clearing failed');
              }
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear all data');
            }
          },
        },
      ]
    );
  };

  const createMockUser = async () => {
    try {
      const user = await localStorage.createUser({
        email: 'dev@example.com',
        goal_wake_time: '07:00',
        wake_up_duration: 15,
        sleep_sensitivity: 'medium'
      });
      Alert.alert('Success', `Created user: ${user.id}`);
      loadAllData();
    } catch (error) {
      Alert.alert('Error', 'Failed to create user');
    }
  };

  const createMockAlarm = async () => {
    try {
      const alarm = await localStorage.createAlarmProfile({
        user_id: 'dev-user-123',
        wake_time: '07:00',
        sound: 'nature',
        volume_ramp: 5,
        duration: 15,
        pattern: 'Mock alarm pattern for testing'
      });
      Alert.alert('Success', `Created alarm: ${alarm.id}`);
      loadAllData();
    } catch (error) {
      Alert.alert('Error', 'Failed to create alarm');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔧 Development Tools</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity style={styles.button} onPress={loadAllData}>
          <Text style={styles.buttonText}>📊 Load All Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={createMockUser}>
          <Text style={styles.buttonText}>👤 Create Mock User</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={createMockAlarm}>
          <Text style={styles.buttonText}>⏰ Create Mock Alarm</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={clearAllData}>
          <Text style={styles.buttonText}>🗑️ Clear All Data</Text>
        </TouchableOpacity>
      </View>

      {data && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Data</Text>
          
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>User:</Text>
            <Text style={styles.dataText}>
              {data.user ? JSON.stringify(data.user, null, 2) : 'No user'}
            </Text>
          </View>
          
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Alarms ({data.alarms.length}):</Text>
            <Text style={styles.dataText}>
              {data.alarms.length > 0 
                ? data.alarms.map((alarm: any) => `${alarm.id}: ${alarm.wake_time}`).join('\n')
                : 'No alarms'
              }
            </Text>
          </View>
          
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Feedback ({data.feedbacks.length}):</Text>
            <Text style={styles.dataText}>
              {data.feedbacks.length > 0 
                ? data.feedbacks.map((feedback: any) => `${feedback.id}: ${feedback.happiness_rating}/5`).join('\n')
                : 'No feedback'
              }
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dataContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  dataText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
});
