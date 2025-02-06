import React, { createContext, useContext, useState, useEffect } from 'react';
import { githubAuth } from '../services/auth';

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
  handleAuthCallback: (code: string) => Promise<void>;
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
    const isAuthed = await githubAuth.isAuthenticated();
    setIsAuthenticated(isAuthed);
    if (isAuthed) {
      const user = await githubAuth.getGitHubUser();
      setUser(user);
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

  async function handleAuthCallback(code: string) {
    const session = await githubAuth.handleCallback(code);
    setIsAuthenticated(true);
    setUser(session.user);
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