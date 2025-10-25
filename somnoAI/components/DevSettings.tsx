import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDevAuthContext } from '@/lib/devAuthContext';

export default function DevSettings() {
  const { user, isAuthenticated, signOut, resetAuth, isDevMode } = useDevAuthContext();

  // Only show in development mode
  if (!__DEV__ || !isDevMode) {
    return null;
  }

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleResetAuth = () => {
    Alert.alert(
      'Reset Auth',
      'This will reset the authentication state.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetAuth },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Development Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication Status</Text>
        <View style={styles.statusCard}>
          <Ionicons 
            name={isAuthenticated ? "checkmark-circle" : "close-circle"} 
            size={20} 
            color={isAuthenticated ? "#10b981" : "#ef4444"} 
          />
          <Text style={styles.statusText}>
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Text>
        </View>
        
        {user && (
          <View style={styles.userCard}>
            <Text style={styles.userLabel}>User:</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userId}>ID: {user.id}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.buttonGradient}>
            <Ionicons name="log-out" size={20} color="white" />
            <Text style={styles.buttonText}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleResetAuth}>
          <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.buttonGradient}>
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.buttonText}>Reset Auth</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Development Info</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>• Mock authentication is active</Text>
          <Text style={styles.infoText}>• All network requests are simulated</Text>
          <Text style={styles.infoText}>• User data is stored locally</Text>
          <Text style={styles.infoText}>• This will not appear in production</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginLeft: 8,
  },
  userCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  userLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  userId: {
    fontSize: 12,
    color: '#6b7280',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
});
