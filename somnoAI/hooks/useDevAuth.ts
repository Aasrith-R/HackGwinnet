import { useState, useEffect } from 'react';
import { mockAuth, mockUser, MockUser } from '../lib/mockAuth';

interface AuthState {
  user: MockUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const useDevAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  });

  const [isDevMode, setIsDevMode] = useState(__DEV__);

  // Initialize with mock user in development
  useEffect(() => {
    if (__DEV__) {
      setAuthState({
        user: mockUser,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await mockAuth.signIn(email, password);
      
      if (result.error) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: result.error.message,
        }));
      } else {
        setAuthState({
          user: result.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'An unexpected error occurred',
      }));
    }
  };

  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await mockAuth.signUp(email, password);
      
      if (result.error) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: result.error.message,
        }));
      } else {
        setAuthState({
          user: result.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'An unexpected error occurred',
      }));
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      await mockAuth.signOut();
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'An unexpected error occurred',
      }));
    }
  };

  const bypassAuth = () => {
    console.log('🚀 Development: Bypassing authentication');
    setAuthState({
      user: mockUser,
      loading: false,
      error: null,
      isAuthenticated: true,
    });
  };

  const resetAuth = () => {
    setAuthState({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    bypassAuth,
    resetAuth,
    isDevMode,
  };
};
