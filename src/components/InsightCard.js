/**
 * InsightCard Component
 * Displays AI-generated sleep insights and recommendations
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function InsightCard({ 
  title, 
  insight, 
  recommendation, 
  type = 'info',
  onPress,
  style 
}) {
  const getCardColors = (type) => {
    const colors = {
      success: ['#10b981', '#059669'],
      warning: ['#f59e0b', '#d97706'],
      info: ['#6366f1', '#4f46e5'],
      error: ['#ef4444', '#dc2626']
    };
    return colors[type] || colors.info;
  };

  const getIcon = (type) => {
    const icons = {
      success: 'checkmark-circle',
      warning: 'warning',
      info: 'information-circle',
      error: 'alert-circle'
    };
    return icons[type] || 'information-circle';
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getCardColors(type)}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Ionicons
            name={getIcon(type)}
            size={24}
            color="white"
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <Text style={styles.insight}>{insight}</Text>
        
        {recommendation && (
          <View style={styles.recommendationContainer}>
            <Ionicons name="bulb" size={16} color="rgba(255, 255, 255, 0.9)" />
            <Text style={styles.recommendation}>{recommendation}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
    flex: 1,
  },
  insight: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: 12,
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  recommendation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});
