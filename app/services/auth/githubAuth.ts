import { Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';

interface AuthTokens {
  accessToken: string;
  tokenType: string;
  scope: string;
}

interface GitHubUser {
  id: number;
  login: string;
  name?: string;
  email?: string;
}

interface SessionResponse {
  token: string;
  user: GitHubUser;
}

class GitHubAuthService {
  // OAuth configuration (public values only)
  private config = {
    clientId: process.env.GITHUB_CLIENT_ID,
    redirectUri: 'onyx://auth/github/callback',
    scope: 'user repo',
  };

  // Start OAuth flow
  async login() {
    const url = `https://github.com/login/oauth/authorize?client_id=${this.config.clientId}&redirect_uri=${encodeURIComponent(this.config.redirectUri)}&scope=${encodeURIComponent(this.config.scope)}`;
    await Linking.openURL(url);
  }

  // Handle OAuth callback
  async handleCallback(code: string): Promise<SessionResponse> {
    // Exchange code for session via OpenAgents
    const response = await fetch(`${API_URL}/auth/github/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Authentication failed: ${error}`);
    }

    const session = await response.json();
    await this.storeSession(session);
    return session;
  }

  // Store session securely
  private async storeSession(session: SessionResponse) {
    await SecureStore.setItemAsync('session_token', session.token);
    await SecureStore.setItemAsync('github_user', JSON.stringify(session.user));
  }

  // Get stored session
  async getSession(): Promise<string | null> {
    return await SecureStore.getItemAsync('session_token');
  }

  // Get stored GitHub user
  async getGitHubUser(): Promise<GitHubUser | null> {
    const userJson = await SecureStore.getItemAsync('github_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  // Clear session on logout
  async logout() {
    await SecureStore.deleteItemAsync('session_token');
    await SecureStore.deleteItemAsync('github_user');
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getSession();
    return !!token;
  }
}

export const githubAuth = new GitHubAuthService();