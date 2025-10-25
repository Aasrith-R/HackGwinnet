/**
 * JournalScreen - Sleep tracking with AI insights and weekly summary
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-chart-kit';

import InsightCard from '../components/InsightCard';
import { generateSleepInsights } from '../utils/aiMock';
import { sleepStorage } from '../utils/storage';

const { width } = Dimensions.get('window');

export default function JournalScreen() {
  const [sleepLogs, setSleepLogs] = useState([]);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [insights, setInsights] = useState('');
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [newLog, setNewLog] = useState({
    bedtime: 22,
    wakeTime: 7,
    quality: 3
  });

  useEffect(() => {
    loadSleepData();
  }, []);

  const loadSleepData = async () => {
    try {
      const logs = await sleepStorage.getSleepLogs();
      const weekly = await sleepStorage.getWeeklyLogs();
      
      setSleepLogs(logs);
      setWeeklyLogs(weekly);
      
      const aiInsights = generateSleepInsights(weekly);
      setInsights(aiInsights);
    } catch (error) {
      console.error('Error loading sleep data:', error);
    }
  };

  const addSleepLog = async () => {
    if (newLog.bedtime >= newLog.wakeTime) {
      Alert.alert('Invalid Time', 'Wake time must be after bedtime');
      return;
    }

    try {
      const logData = {
        bedtime: newLog.bedtime,
        wakeTime: newLog.wakeTime,
        quality: newLog.quality,
        duration: newLog.wakeTime - newLog.bedtime
      };

      await sleepStorage.saveSleepLog(logData);
      await loadSleepData();
      
      setIsAddingLog(false);
      setNewLog({ bedtime: 22, wakeTime: 7, quality: 3 });
      
      Alert.alert('Success', 'Sleep log added successfully!');
    } catch (error) {
      console.error('Error adding sleep log:', error);
      Alert.alert('Error', 'Failed to save sleep log');
    }
  };

  const getQualityColor = (quality) => {
    if (quality >= 4) return '#10b981';
    if (quality >= 3) return '#f59e0b';
    return '#ef4444';
  };

  const getQualityText = (quality) => {
    if (quality >= 4) return 'Excellent';
    if (quality >= 3) return 'Good';
    if (quality >= 2) return 'Fair';
    return 'Poor';
  };

  const getChartData = () => {
    if (weeklyLogs.length === 0) return null;

    const labels = weeklyLogs.slice(-7).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const qualityData = weeklyLogs.slice(-7).map(log => log.quality);
    const durationData = weeklyLogs.slice(-7).map(log => log.duration);

    return {
      labels,
      datasets: [
        {
          data: qualityData,
          color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };

  const getWeeklyStats = () => {
    if (weeklyLogs.length === 0) return null;

    const avgQuality = weeklyLogs.reduce((sum, log) => sum + log.quality, 0) / weeklyLogs.length;
    const avgDuration = weeklyLogs.reduce((sum, log) => sum + log.duration, 0) / weeklyLogs.length;
    const totalDays = weeklyLogs.length;

    return {
      avgQuality: Math.round(avgQuality * 10) / 10,
      avgDuration: Math.round(avgDuration * 10) / 10,
      totalDays
    };
  };

  const stats = getWeeklyStats();
  const chartData = getChartData();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Sleep Journal</Text>
            <Text style={styles.subtitle}>Track your sleep patterns and insights</Text>
          </View>
          <Ionicons name="book" size={32} color="white" />
        </View>
      </LinearGradient>

      {/* Add Sleep Log */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingLog(!isAddingLog)}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.addButtonGradient}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>
              {isAddingLog ? 'Cancel' : 'Add Sleep Log'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {isAddingLog && (
          <View style={styles.logForm}>
            <Text style={styles.formTitle}>New Sleep Entry</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bedtime (24h format)</Text>
              <TextInput
                style={styles.input}
                value={newLog.bedtime.toString()}
                onChangeText={(text) => setNewLog({...newLog, bedtime: parseInt(text) || 22})}
                keyboardType="numeric"
                placeholder="22"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Wake Time (24h format)</Text>
              <TextInput
                style={styles.input}
                value={newLog.wakeTime.toString()}
                onChangeText={(text) => setNewLog({...newLog, wakeTime: parseInt(text) || 7})}
                keyboardType="numeric"
                placeholder="7"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Sleep Quality (1-5)</Text>
              <View style={styles.qualitySelector}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.qualityButton,
                      newLog.quality === rating && styles.qualityButtonSelected
                    ]}
                    onPress={() => setNewLog({...newLog, quality: rating})}
                  >
                    <Text style={[
                      styles.qualityButtonText,
                      newLog.quality === rating && styles.qualityButtonTextSelected
                    ]}>
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={addSleepLog}
            >
              <LinearGradient
                colors={['#6366f1', '#4f46e5']}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>Save Log</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Weekly Stats */}
      {stats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalDays}</Text>
              <Text style={styles.statLabel}>Days Tracked</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.avgQuality}/5</Text>
              <Text style={styles.statLabel}>Avg Quality</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.avgDuration}h</Text>
              <Text style={styles.statLabel}>Avg Duration</Text>
            </View>
          </View>
        </View>
      )}

      {/* Sleep Quality Chart */}
      {chartData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Quality Trend</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              width={width - 32}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#6366f1'
                }
              }}
              style={styles.chart}
            />
          </View>
        </View>
      )}

      {/* AI Insights */}
      {insights && (
        <View style={styles.section}>
          <InsightCard
            title="AI Sleep Insights"
            insight={insights}
            type="info"
          />
        </View>
      )}

      {/* Recent Sleep Logs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Entries</Text>
        {sleepLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No sleep logs yet</Text>
            <Text style={styles.emptySubtext}>Start tracking your sleep to see insights</Text>
          </View>
        ) : (
          <View style={styles.logsList}>
            {sleepLogs.slice(-5).reverse().map((log, index) => (
              <View key={index} style={styles.logItem}>
                <View style={styles.logHeader}>
                  <Text style={styles.logDate}>
                    {new Date(log.date).toLocaleDateString()}
                  </Text>
                  <View style={[
                    styles.qualityBadge,
                    { backgroundColor: getQualityColor(log.quality) }
                  ]}>
                    <Text style={styles.qualityBadgeText}>
                      {getQualityText(log.quality)}
                    </Text>
                  </View>
                </View>
                <View style={styles.logDetails}>
                  <View style={styles.logDetail}>
                    <Ionicons name="moon" size={16} color="#6b7280" />
                    <Text style={styles.logDetailText}>
                      {log.bedtime}:00 - {log.wakeTime}:00
                    </Text>
                  </View>
                  <View style={styles.logDetail}>
                    <Ionicons name="time" size={16} color="#6b7280" />
                    <Text style={styles.logDetailText}>
                      {log.duration} hours
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
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
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logForm: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  qualitySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  qualityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qualityButtonSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f1',
  },
  qualityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  qualityButtonTextSelected: {
    color: 'white',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  saveButtonGradient: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
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
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chart: {
    borderRadius: 16,
  },
  logsList: {
    gap: 12,
  },
  logItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  qualityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  logDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  logDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logDetailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
});
