import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Supabase client for development when network is blocked
class MockSupabaseClient {
  private authService = {
    getUser: async () => {
      try {
        const userStr = await AsyncStorage.getItem('mock_user');
        return { data: { user: userStr ? JSON.parse(userStr) : null }, error: null };
      } catch {
        return { data: { user: null }, error: null };
      }
    },
    signOut: async () => {
      await AsyncStorage.removeItem('mock_user');
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Mock subscription
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  };

  get auth() {
    return this.authService;
  }
}

// Use mock client when network is blocked
const isNetworkBlocked = true; // Set to true when Supabase is blocked

export const supabase = isNetworkBlocked 
  ? new MockSupabaseClient() as any
  : (() => {
      try {
        const { createClient } = require('@supabase/supabase-js');
        return createClient('https://csttoixzxdcwoaaavdho.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdHRvaXh6eGRjd29hYWF2ZGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzOTU0NTcsImV4cCI6MjA3Njk3MTQ1N30.AgAzzx56LOLHozq4wMq929HHoHftqCL7VHQsCi1dcak', {
          auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
          },
        });
      } catch (error) {
        console.log('Supabase blocked, using mock client');
        return new MockSupabaseClient() as any;
      }
    })();

// Auth state helpers
export const getCurrentUser = async () => {
  try {
    if (isNetworkBlocked) {
      const userStr = await AsyncStorage.getItem('mock_user');
      return userStr ? JSON.parse(userStr) : null;
    }
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const signOut = async () => {
  try {
    if (isNetworkBlocked) {
      await AsyncStorage.removeItem('mock_user');
      return;
    }
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};