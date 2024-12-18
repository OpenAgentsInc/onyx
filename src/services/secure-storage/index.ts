import * as SecureStore from 'expo-secure-store'

// Only expose what we absolutely need to store securely
export const secureStorage = {
  getMnemonic: () => SecureStore.getItemAsync('mnemonic'),
  setMnemonic: (value: string) => SecureStore.setItemAsync('mnemonic', value),
  removeMnemonic: () => SecureStore.deleteItemAsync('mnemonic'),
}