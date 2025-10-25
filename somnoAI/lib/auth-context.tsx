import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser } from './supabase';
import { mockUser } from './mockAuth';
import type { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setDevUser: (user: any) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  setDevUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    // In development, check if we should use mock auth
    if (__DEV__) {
      // Try to get dev user from storage first
      const checkDevUser = async () => {
        try {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          const devUserStr = await AsyncStorage.getItem('dev_user');
          if (devUserStr) {
            const devUser = JSON.parse(devUserStr);
            setUser(devUser as any);
            setDevMode(true);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log('No dev user found');
        }
        
        // If no dev user, try real auth
        try {
          const realUser = await getCurrentUser();
          setUser(realUser);
          setLoading(false);
        } catch (error) {
          console.log('Failed to get user:', error);
          setLoading(false);
        }
      };
      
      checkDevUser();
      
      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!devMode) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Production mode - use real auth
      getCurrentUser().then(user => {
        setUser(user);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [devMode]);

  const setDevUser = (user: any) => {
    if (__DEV__) {
      setUser(user);
      setDevMode(true);
      // Store in AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      AsyncStorage.setItem('dev_user', JSON.stringify(user));
    }
  };

  const value = {
    user,
    loading,
    signOut: async () => {
      if (devMode) {
        setUser(null);
        setDevMode(false);
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        AsyncStorage.removeItem('dev_user');
      } else {
        await supabase.auth.signOut();
        setUser(null);
      }
    },
    setDevUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};