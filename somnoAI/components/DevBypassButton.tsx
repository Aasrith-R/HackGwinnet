import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface DevBypassButtonProps {
  onBypass: () => void;
  isVisible?: boolean;
}

export default function DevBypassButton({ onBypass, isVisible = true }: DevBypassButtonProps) {
  // Only show in development mode
  if (!__DEV__ || !isVisible) {
    return null;
  }

  const handleBypass = () => {
    Alert.alert(
      '🚀 Development Mode',
      'Bypassing authentication for development. This will only work in development builds.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Bypass Auth',
          style: 'destructive',
          onPress: onBypass,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleBypass}>
        <LinearGradient
          colors={['#ff6b6b', '#ee5a24']}
          style={styles.gradient}
        >
          <Ionicons name="flash" size={20} color="white" />
          <Text style={styles.buttonText}>Dev Bypass</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
