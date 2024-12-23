import AsyncStorage from '@react-native-async-storage/async-storage'

export async function clearAllStorage() {
  try {
    await AsyncStorage.clear()
    console.log('Storage successfully cleared!')
  } catch (e) {
    console.error('Error clearing storage:', e)
  }
}

// For development/testing, you can call this function directly
// clearAllStorage()