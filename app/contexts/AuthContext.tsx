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
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state
  useEffect(() => {
    console.log("[Auth] Initializing auth state")
    checkAuthState();
  }, []);

  async function checkAuthState() {
    try {
      const token = await SecureStore.getItemAsync('session_token');
      console.log('[Auth] Checking auth state, token:', token);
      
      // Only set authenticated if token is valid (not $params.token)
      if (token && !token.includes('$params')) {
        setIsAuthenticated(true);
        const userJson = await SecureStore.getItemAsync('github_user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
        console.log('[Auth] Restored auth state:', { isAuthenticated: true });
      } else {
        console.log('[Auth] No valid token found');
        // Clear any invalid tokens
        await SecureStore.deleteItemAsync('session_token');
        await SecureStore.deleteItemAsync('github_user');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('[Auth] Error checking auth state:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setInitialized(true);
    }
  }

  async function login() {
    console.log('[Auth] Starting login flow');
    await githubAuth.login();
  }

  async function logout() {
    console.log('[Auth] Logging out');
    await SecureStore.deleteItemAsync('session_token');
    await SecureStore.deleteItemAsync('github_user');
    setIsAuthenticated(false);
    setUser(null);
    console.log('[Auth] Logged out');
  }

  async function handleAuthCallback(token: string) {
    console.log('[Auth] Handling auth callback with token:', token);
    try {
      if (!token || token.includes('$params')) {
        throw new Error('Invalid token');
      }

      // Store session token
      await SecureStore.setItemAsync('session_token', token);
      setIsAuthenticated(true);
      console.log('[Auth] Token stored, auth state updated');

      // Get user info from token (if available)
      const userJson = await SecureStore.getItemAsync('github_user');
      if (userJson) {
        const user = JSON.parse(userJson);
        setUser(user);
        console.log('[Auth] User info restored');
      }

      console.log('[Auth] Auth callback handled successfully');
    } catch (error) {
      console.error('[Auth] Error handling auth callback:', error);
      throw error;
    }
  }

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    handleAuthCallback,
  };

  // Don't render children until auth state is initialized
  if (!initialized) {
    return null;
  }

  console.log('[Auth] Providing auth context:', { isAuthenticated });

  return (
    <AuthContext.Provider value={value}>
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