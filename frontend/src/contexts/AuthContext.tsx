import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, User } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<{ error?: string; requiresOTP?: boolean; email?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ error?: string }>;
  resendOTP: (email: string) => Promise<{ error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Verify token is still valid
          const response = await authAPI.getProfile();
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signUp = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const response = await authAPI.signUp({ firstName, lastName, email, password });
      
      if (response.data.requiresOTP) {
        return { requiresOTP: true, email };
      }

      if (response.data.token && response.data.user) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }

      return {};
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Signup failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.signIn({ email, password });
      
      if (response.data.token && response.data.user) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }

      return {};
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Signin failed' };
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await authAPI.verifyOTP({ email, otp });
      
      if (response.data.token && response.data.user) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }

      return {};
    } catch (error: any) {
      return { error: error.response?.data?.error || 'OTP verification failed' };
    }
  };

  const resendOTP = async (email: string) => {
    try {
      await authAPI.resendOTP({ email });
      return {};
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to resend OTP' };
    }
  };

  const signOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    verifyOTP,
    resendOTP,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}