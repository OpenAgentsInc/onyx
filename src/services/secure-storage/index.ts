import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

// Web-safe version of secure storage using localStorage
class WebSecureStorage {
  async getItemAsync(key: string): Promise<string | null> {
    return localStorage.getItem(key)
  }

  async setItemAsync(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value)
  }

  async deleteItemAsync(key: string): Promise<void> {
    localStorage.removeItem(key)
  }
}

// Use SecureStore for native, WebSecureStorage for web
const storage = Platform.OS === 'web' ? new WebSecureStorage() : SecureStore

// Only expose what we absolutely need to store securely
export const secureStorage = {
  getMnemonic: async () => {
    console.log('SecureStorage: Getting mnemonic...')
    try {
      // Log what methods are available on SecureStore
      console.log('SecureStorage: Available methods:', Object.keys(storage))
      
      const result = await storage.getItemAsync('mnemonic')
      console.log('SecureStorage: Got mnemonic result:', result ? '[REDACTED]' : 'null')
      return result
    } catch (error) {
      console.error('SecureStorage: Error getting mnemonic:', error)
      throw error
    }
  },
  
  setMnemonic: async (value: string) => {
    console.log('SecureStorage: Setting mnemonic...')
    try {
      await storage.setItemAsync('mnemonic', value)
      console.log('SecureStorage: Mnemonic set successfully')
    } catch (error) {
      console.error('SecureStorage: Error setting mnemonic:', error)
      throw error
    }
  },
  
  removeMnemonic: async () => {
    console.log('SecureStorage: Removing mnemonic...')
    try {
      await storage.deleteItemAsync('mnemonic')
      console.log('SecureStorage: Mnemonic removed successfully')
    } catch (error) {
      console.error('SecureStorage: Error removing mnemonic:', error)
      throw error
    }
  }
}