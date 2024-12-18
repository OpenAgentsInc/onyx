import { generateMnemonic, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import AsyncStorage from '@react-native-async-storage/async-storage'

const MNEMONIC_STORAGE_KEY = '@onyx/mnemonic'

interface KeyServiceConfig {
  existingMnemonic?: string
  storage?: {
    type: 'secure' | 'file'
    path?: string
  }
}

class KeyServiceImpl {
  private mnemonic: string | null = null
  private isInitializedFlag = false
  private initializationPromise: Promise<void> | null = null

  async initialize(config?: KeyServiceConfig): Promise<void> {
    // If already initializing, wait for that to complete
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    // If already initialized, return immediately
    if (this.isInitializedFlag && this.mnemonic) {
      return Promise.resolve()
    }

    this.initializationPromise = (async () => {
      try {
        // First try to load existing mnemonic from storage
        let mnemonic = await AsyncStorage.getItem(MNEMONIC_STORAGE_KEY)

        // If no stored mnemonic, check for config
        if (!mnemonic && config?.existingMnemonic) {
          mnemonic = config.existingMnemonic
        }

        // If still no mnemonic, generate a new one
        if (!mnemonic) {
          mnemonic = generateMnemonic(wordlist)
        }

        // Validate the mnemonic
        if (!validateMnemonic(mnemonic, wordlist)) {
          throw new Error('Invalid mnemonic')
        }

        // Store the mnemonic
        await AsyncStorage.setItem(MNEMONIC_STORAGE_KEY, mnemonic)
        
        this.mnemonic = mnemonic
        this.isInitializedFlag = true

        console.log('KeyService initialized successfully')
      } catch (err) {
        console.error('KeyService initialization error:', err)
        this.isInitializedFlag = false
        this.mnemonic = null
        throw err
      } finally {
        this.initializationPromise = null
      }
    })()

    return this.initializationPromise
  }

  private ensureInitialized() {
    if (!this.isInitializedFlag || !this.mnemonic) {
      throw new Error('KeyService not initialized')
    }
  }

  async getMnemonic(): Promise<string> {
    this.ensureInitialized()
    return this.mnemonic!
  }

  isInitialized(): boolean {
    return this.isInitializedFlag && this.mnemonic !== null
  }

  async reset(): Promise<void> {
    await AsyncStorage.removeItem(MNEMONIC_STORAGE_KEY)
    this.mnemonic = null
    this.isInitializedFlag = false
  }
}

// Export a singleton instance
export const keyService = new KeyServiceImpl()