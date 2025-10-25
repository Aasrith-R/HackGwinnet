// Mock authentication service for development
export interface MockUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export const mockUser: MockUser = {
  id: 'dev-user-123',
  email: 'dev@example.com',
  name: 'Development User',
  avatar_url: 'https://via.placeholder.com/150/6366f1/ffffff?text=DEV',
};

export const mockAuth = {
  // Mock sign in
  signIn: async (email: string, password: string) => {
    console.log('🔧 Mock Auth: Sign in attempt', { email, password });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      user: mockUser,
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000, // 1 hour
      },
      error: null,
    };
  },

  // Mock sign up
  signUp: async (email: string, password: string) => {
    console.log('🔧 Mock Auth: Sign up attempt', { email, password });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      user: mockUser,
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000, // 1 hour
      },
      error: null,
    };
  },

  // Mock sign out
  signOut: async () => {
    console.log('🔧 Mock Auth: Sign out');
    return { error: null };
  },

  // Mock get current user
  getUser: async () => {
    console.log('🔧 Mock Auth: Get current user');
    return {
      user: mockUser,
      error: null,
    };
  },

  // Mock session management
  getSession: async () => {
    console.log('🔧 Mock Auth: Get session');
    return {
      session: {
        user: mockUser,
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000,
      },
      error: null,
    };
  },

  // Mock password reset
  resetPassword: async (email: string) => {
    console.log('🔧 Mock Auth: Password reset', { email });
    return { error: null };
  },

  // Mock update user
  updateUser: async (updates: Partial<MockUser>) => {
    console.log('🔧 Mock Auth: Update user', updates);
    return {
      user: { ...mockUser, ...updates },
      error: null,
    };
  },
};

// Development flag
export const isDevelopmentMode = __DEV__;

// Mock auth state
export const mockAuthState = {
  user: mockUser,
  session: {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: Date.now() + 3600000,
  },
  loading: false,
  error: null,
};
