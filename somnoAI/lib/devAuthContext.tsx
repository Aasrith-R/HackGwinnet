import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './auth-context';

interface DevAuthContextType {
  devUser: any;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  bypassAuth: () => void;
  resetAuth: () => void;
  isDevMode: boolean;
}

const DevAuthContext = createContext<DevAuthContextType | undefined>(undefined);

interface DevAuthProviderProps {
  children: ReactNode;
}

export function DevAuthProvider({ children }: DevAuthProviderProps) {
  const { user, loading, signOut, setDevUser } = useAuth();

  const bypassAuth = () => {
    if (__DEV__) {
      const mockUser = {
        id: 'dev-user-123',
        email: 'dev@example.com',
        goal_wake_time: '07:00',
        wake_up_duration: 15,
        sleep_sensitivity: 'medium'
      };
      setDevUser(mockUser);
    }
  };

  const resetAuth = () => {
    if (__DEV__) {
      signOut();
    }
  };

  const value = {
    devUser: user,
    loading,
    error: null,
    isAuthenticated: !!user,
    signIn: async () => {},
    signUp: async () => {},
    signOut,
    bypassAuth,
    resetAuth,
    isDevMode: __DEV__,
  };

  return (
    <DevAuthContext.Provider value={value}>
      {children}
    </DevAuthContext.Provider>
  );
}

export function useDevAuthContext() {
  const context = useContext(DevAuthContext);
  if (context === undefined) {
    throw new Error('useDevAuthContext must be used within a DevAuthProvider');
  }
  return context;
}
