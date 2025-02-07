import React, { createContext, useContext, useState, useEffect } from 'react';
import { githubAuth } from '../services/auth';
import * as SecureStore from 'expo-secure-store';

interface GitHubUser {
  id: number;
  login: string;
  name?: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleAuthCallback: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);

  // Initialize auth state
  useEffect(() => {
    checkAuthState();
  }, []);

  async function checkAuthState() {
    try {
      const token = await SecureStore.getItemAsync('session_token');
      console.log('Checking auth state, token:', token);
      
      if (token) {
        setIsAuthenticated(true);
        const userJson = await SecureStore.getItemAsync('github_user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  }

  async function login() {
    await githubAuth.login();
  }

  async function logout() {
    await githubAuth.logout();
    setIsAuthenticated(false);
    setUser(null);
  }

  async function handleAuthCallback(token: string) {
    console.log('Handling auth callback with token:', token);
    try {
      // Store session token
      await SecureStore.setItemAsync('session_token', token);
      setIsAuthenticated(true);

      // Get user info from token (if available)
      const userJson = await SecureStore.getItemAsync('github_user');
      if (userJson) {
        const user = JSON.parse(userJson);
        setUser(user);
      }

      console.log('Auth callback handled successfully');
    } catch (error) {
      console.error('Error handling auth callback:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        handleAuthCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}