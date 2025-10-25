/**
 * MoodSelector Component
 * Dropdown for selecting current mood with visual feedback
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MOODS = [
  { id: 'Peaceful', label: 'Peaceful', icon: 'leaf', color: '#10b981', gradient: ['#10b981', '#059669'] },
  { id: 'Anxious', label: 'Anxious', icon: 'cloudy', color: '#f59e0b', gradient: ['#f59e0b', '#d97706'] },
  { id: 'Tired', label: 'Tired', icon: 'moon', color: '#6366f1', gradient: ['#6366f1', '#4f46e5'] },
  { id: 'Stressed', label: 'Stressed', icon: 'flash', color: '#ef4444', gradient: ['#ef4444', '#dc2626'] },
  { id: 'Energetic', label: 'Energetic', icon: 'sunny', color: '#f59e0b', gradient: ['#f59e0b', '#d97706'] }
];

export default function MoodSelector({ selectedMood, onMoodChange, style }) {
  const [isVisible, setIsVisible] = useState(false);

  const selectedMoodData = MOODS.find(mood => mood.id === selectedMood) || MOODS[0];

  const handleMoodSelect = (mood) => {
    onMoodChange(mood.id);
    setIsVisible(false);
  };

  const renderMoodItem = ({ item }) => (
    <TouchableOpacity
      style={styles.moodItem}
      onPress={() => handleMoodSelect(item)}
    >
      <LinearGradient
        colors={item.gradient}
        style={styles.moodItemGradient}
      >
        <Ionicons name={item.icon} size={24} color="white" />
        <Text style={styles.moodItemText}>{item.label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsVisible(true)}
      >
        <LinearGradient
          colors={selectedMoodData.gradient}
          style={styles.selectorGradient}
        >
          <Ionicons name={selectedMoodData.icon} size={20} color="white" />
          <Text style={styles.selectorText}>{selectedMoodData.label}</Text>
          <Ionicons name="chevron-down" size={16} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your Mood</Text>
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={MOODS}
              renderItem={renderMoodItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.moodList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  selector: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  selectorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: width * 0.9,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  moodList: {
    gap: 12,
  },
  moodItem: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  moodItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  moodItemText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
