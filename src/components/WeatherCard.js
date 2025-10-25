/**
 * WeatherCard Component
 * Displays current weather with mock data
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { generateMockWeather } from '../utils/aiMock';

export default function WeatherCard({ style }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const weatherData = generateMockWeather();
      setWeather(weatherData);
    } catch (error) {
      console.error('Error loading weather:', error);
      // Fallback weather data
      setWeather({
        temperature: 72,
        condition: 'clear',
        humidity: 60,
        description: 'Perfect weather for sleep'
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: 'sunny',
      cloudy: 'cloudy',
      rainy: 'rainy',
      clear: 'partly-sunny'
    };
    return icons[condition] || 'partly-sunny';
  };

  const getWeatherGradient = (condition) => {
    const gradients = {
      sunny: ['#f59e0b', '#d97706'],
      cloudy: ['#6b7280', '#4b5563'],
      rainy: ['#3b82f6', '#2563eb'],
      clear: ['#10b981', '#059669']
    };
    return gradients[condition] || ['#6366f1', '#4f46e5'];
  };

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading weather...</Text>
        </View>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.errorText}>Unable to load weather data</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={getWeatherGradient(weather.condition)}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Ionicons
            name={getWeatherIcon(weather.condition)}
            size={32}
            color="white"
          />
          <Text style={styles.temperature}>{weather.temperature}°F</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.condition}>
            {weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}
          </Text>
          <Text style={styles.description}>{weather.description}</Text>
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="water" size={16} color="white" />
              <Text style={styles.detailText}>{weather.humidity}% humidity</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    gap: 8,
  },
  condition: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  details: {
    marginTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
