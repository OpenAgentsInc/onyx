import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

// Interface for our storage operations
export interface Storage {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
}

// Web implementation using localStorage
class WebStorage implements Storage {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key)
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value)
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key)
  }
}

// Native implementation using AsyncStorage
class NativeStorage implements Storage {
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key)
  }

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value)
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key)
  }
}

// Export the appropriate storage implementation
export const storage: Storage = Platform.OS === 'web' ? new WebStorage() : new NativeStorage()