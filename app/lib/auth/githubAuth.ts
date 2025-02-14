import * as SecureStore from "expo-secure-store"
import { Linking } from "react-native"
import Config from "../../config"

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
  private static instance: GitHubAuthService;

  // OAuth configuration
  private config = {
    clientId: process.env.GITHUB_CLIENT_ID,
    redirectUri: 'onyx://auth/github/callback',
    scope: 'user repo',
  };

  private constructor() { }

  static getInstance(): GitHubAuthService {
    if (!GitHubAuthService.instance) {
      GitHubAuthService.instance = new GitHubAuthService();
    }
    return GitHubAuthService.instance;
  }

  async login() {
    console.log('[GitHubAuth] Starting OAuth flow');
    const url = `${Config.API_URL}/auth/github/login?platform=mobile`;
    await Linking.openURL(url);
  }

  async handleCallback(code: string): Promise<SessionResponse> {
    console.log('[GitHubAuth] Handling OAuth callback');
    const response = await fetch(`${Config.API_URL}/auth/github/callback`, {
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

  async setToken(token: string): Promise<void> {
    console.log('[GitHubAuth] Setting token');
    try {
      await SecureStore.setItemAsync('session_token', token);
    } catch (error) {
      console.error('[GitHubAuth] Error setting token:', error);
      throw error;
    }
  }

  private async storeSession(session: SessionResponse) {
    await this.setToken(session.token);
    if (session.user) {
      await SecureStore.setItemAsync('github_user', JSON.stringify(session.user));
    }
  }

  // This is used by the WebSocket connection
  async getSession(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('session_token');
    } catch (error) {
      console.error('[GitHubAuth] Error getting session:', error);
      return null;
    }
  }

  // Legacy method - now redirects to getSession
  async getToken(): Promise<string | null> {
    return this.getSession();
  }

  async getUser(): Promise<GitHubUser | null> {
    try {
      const userJson = await SecureStore.getItemAsync('github_user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('[GitHubAuth] Error getting user:', error);
      return null;
    }
  }

  async clearAuth(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('session_token');
      await SecureStore.deleteItemAsync('github_user');
    } catch (error) {
      console.error('[GitHubAuth] Error clearing auth:', error);
    }
  }
}

export const githubAuth = GitHubAuthService.getInstance();
