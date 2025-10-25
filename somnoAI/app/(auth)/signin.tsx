import React, { useState } from 'react';
import { StyleSheet, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import GradientBackground from '@/components/ui/GradientBackground';
import SoftCard from '@/components/ui/SoftCard';
import DevBypassButton from '@/components/DevBypassButton';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { mockUser } from '@/lib/mockAuth';
import { Spacing, Palette } from '@/constants/theme';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setDevUser } = useAuth();

  const handleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDevBypass = () => {
    console.log('🚀 Development: Bypassing authentication');
    // Set mock user in auth context
    setDevUser(mockUser);
    // The AuthGuard will automatically redirect to /(tabs) when it sees the user
  };

  return (
    <GradientBackground variant="home">
      <DevBypassButton onBypass={handleDevBypass} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>Welcome Back 🌙</ThemedText>
          <ThemedText style={styles.subtitle}>Sign in to track your sleep journey</ThemedText>

          <SoftCard style={styles.form}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />

            {error && (
              <ThemedText style={styles.error}>{error}</ThemedText>
            )}

            <ThemedView 
              style={[styles.button, loading && styles.buttonDisabled]}
              onTouchEnd={!loading ? handleSignIn : undefined}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Sign In</ThemedText>
              )}
            </ThemedView>
          </SoftCard>

          <Link href="/(auth)/signup" asChild>
            <ThemedText style={styles.link}>
              Don't have an account? Sign up
            </ThemedText>
          </Link>
        </ThemedView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    opacity: 0.8,
  },
  form: {
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  input: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    color: '#1E293B',
  },
  button: {
    height: 50,
    borderRadius: 12,
    backgroundColor: Palette.lavender,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    color: Palette.lavender,
  },
});