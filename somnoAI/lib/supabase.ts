import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and anon key
const supabaseUrl = 'https://csttoixzxdcwoaaavdho.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdHRvaXh6eGRjd29hYWF2ZGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzOTU0NTcsImV4cCI6MjA3Njk3MTQ1N30.AgAzzx56LOLHozq4wMq929HHoHftqCL7VHQsCi1dcak';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth state helpers
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};