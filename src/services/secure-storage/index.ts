import * as SecureStore from 'expo-secure-store'

// Only expose what we absolutely need to store securely
export const secureStorage = {
  getMnemonic: async () => {
    console.log('SecureStorage: Getting mnemonic...')
    try {
      // Log what methods are available on SecureStore
      console.log('SecureStorage: Available methods:', Object.keys(SecureStore))
      
      const result = await SecureStore.getItemAsync('mnemonic')
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
      await SecureStore.setItemAsync('mnemonic', value)
      console.log('SecureStorage: Mnemonic set successfully')
    } catch (error) {
      console.error('SecureStorage: Error setting mnemonic:', error)
      throw error
    }
  },
  
  removeMnemonic: async () => {
    console.log('SecureStorage: Removing mnemonic...')
    try {
      await SecureStore.deleteItemAsync('mnemonic')
      console.log('SecureStorage: Mnemonic removed successfully')
    } catch (error) {
      console.error('SecureStorage: Error removing mnemonic:', error)
      throw error
    }
  }
}