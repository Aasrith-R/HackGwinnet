/**
 * SoundMixer Component
 * Handles playback of mixed ambient sounds with AI-generated profiles
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Slider,
  Alert
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { generateSoundProfile } from '../utils/aiMock';

// Mock sound files - in production, these would be actual audio files
const SOUND_FILES = {
  rain: require('../../assets/sounds/rain.mp3'), // Placeholder - would be actual file
  ocean: require('../../assets/sounds/ocean.mp3'),
  fan: require('../../assets/sounds/fan.mp3'),
  forest: require('../../assets/sounds/forest.mp3'),
  whiteNoise: require('../../assets/sounds/white-noise.mp3'),
  pinkNoise: require('../../assets/sounds/pink-noise.mp3'),
  brownNoise: require('../../assets/sounds/brown-noise.mp3'),
  birdsong: require('../../assets/sounds/birdsong.mp3'),
  wind: require('../../assets/sounds/wind.mp3')
};

export default function SoundMixer({ mood, onSoundChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundProfile, setSoundProfile] = useState(null);
  const [soundIntensities, setSoundIntensities] = useState({});
  const [sounds, setSounds] = useState({});

  // Generate sound profile when mood changes
  useEffect(() => {
    const profile = generateSoundProfile(mood);
    setSoundProfile(profile);
    
    // Initialize intensities
    const intensities = {};
    profile.sounds.forEach((sound, index) => {
      intensities[sound] = profile.intensities[index] || 0.5;
    });
    setSoundIntensities(intensities);
  }, [mood]);

  // Load sounds when profile changes
  useEffect(() => {
    if (soundProfile) {
      loadSounds();
    }
  }, [soundProfile]);

  const loadSounds = async () => {
    try {
      const soundObjects = {};
      
      for (const soundName of soundProfile.sounds) {
        // In production, load actual audio files
        // For demo, we'll simulate loading
        soundObjects[soundName] = {
          sound: null, // Would be actual Audio.Sound object
          isLoaded: false
        };
      }
      
      setSounds(soundObjects);
    } catch (error) {
      console.error('Error loading sounds:', error);
      Alert.alert('Error', 'Failed to load sound files');
    }
  };

  const togglePlayback = async () => {
    try {
      if (isPlaying) {
        // Stop all sounds
        for (const soundName in sounds) {
          if (sounds[soundName].sound) {
            await sounds[soundName].sound.stopAsync();
          }
        }
        setIsPlaying(false);
      } else {
        // Start playing sounds
        for (const soundName of soundProfile.sounds) {
          if (sounds[soundName] && sounds[soundName].sound) {
            const intensity = soundIntensities[soundName] || 0.5;
            await sounds[soundName].sound.setVolumeAsync(intensity);
            await sounds[soundName].sound.playAsync();
          }
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      Alert.alert('Error', 'Failed to control audio playback');
    }
  };

  const updateIntensity = (soundName, intensity) => {
    setSoundIntensities(prev => ({
      ...prev,
      [soundName]: intensity
    }));
    
    // Update volume in real-time if playing
    if (isPlaying && sounds[soundName] && sounds[soundName].sound) {
      sounds[soundName].sound.setVolumeAsync(intensity);
    }
  };

  const getSoundIcon = (soundName) => {
    const icons = {
      rain: 'rainy',
      ocean: 'water',
      fan: 'leaf',
      forest: 'tree',
      whiteNoise: 'radio',
      pinkNoise: 'radio',
      brownNoise: 'radio',
      birdsong: 'bird',
      wind: 'cloudy'
    };
    return icons[soundName] || 'musical-notes';
  };

  const getSoundLabel = (soundName) => {
    const labels = {
      rain: 'Rain',
      ocean: 'Ocean',
      fan: 'Fan',
      forest: 'Forest',
      whiteNoise: 'White Noise',
      pinkNoise: 'Pink Noise',
      brownNoise: 'Brown Noise',
      birdsong: 'Birdsong',
      wind: 'Wind'
    };
    return labels[soundName] || soundName;
  };

  if (!soundProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading sound profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Sound Mix</Text>
        <Text style={styles.description}>{soundProfile.description}</Text>
      </View>

      <TouchableOpacity
        style={[styles.playButton, isPlaying && styles.playButtonActive]}
        onPress={togglePlayback}
      >
        <LinearGradient
          colors={isPlaying ? ['#ef4444', '#dc2626'] : ['#10b981', '#059669']}
          style={styles.playButtonGradient}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={32}
            color="white"
          />
          <Text style={styles.playButtonText}>
            {isPlaying ? 'Stop' : 'Play'} Sounds
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.soundControls}>
        {soundProfile.sounds.map((soundName, index) => (
          <View key={soundName} style={styles.soundControl}>
            <View style={styles.soundHeader}>
              <Ionicons
                name={getSoundIcon(soundName)}
                size={20}
                color="#6366f1"
              />
              <Text style={styles.soundLabel}>{getSoundLabel(soundName)}</Text>
              <Text style={styles.intensityValue}>
                {Math.round((soundIntensities[soundName] || 0.5) * 100)}%
              </Text>
            </View>
            
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={soundIntensities[soundName] || 0.5}
              onValueChange={(value) => updateIntensity(soundName, value)}
              minimumTrackTintColor="#6366f1"
              maximumTrackTintColor="#e5e7eb"
              thumbStyle={styles.sliderThumb}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
  },
  playButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  playButtonActive: {
    // Additional styles for active state
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  playButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  soundControls: {
    gap: 16,
  },
  soundControl: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  soundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  soundLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginLeft: 8,
  },
  intensityValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#6366f1',
    width: 20,
    height: 20,
  },
});
