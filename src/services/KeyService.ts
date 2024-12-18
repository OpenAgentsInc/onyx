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
    console.log('KeyService: Starting initialization...')
    
    // If already initializing, wait for that to complete
    if (this.initializationPromise) {
      console.log('KeyService: Already initializing, waiting...')
      return this.initializationPromise
    }

    // If already initialized, return immediately
    if (this.isInitializedFlag && this.mnemonic) {
      console.log('KeyService: Already initialized')
      return Promise.resolve()
    }

    this.initializationPromise = (async () => {
      try {
        console.log('KeyService: Checking for stored mnemonic...')
        // First try to load existing mnemonic from storage
        let mnemonic = await AsyncStorage.getItem(MNEMONIC_STORAGE_KEY)

        // If no stored mnemonic, check for config
        if (!mnemonic && config?.existingMnemonic) {
          console.log('KeyService: Using provided mnemonic from config')
          mnemonic = config.existingMnemonic
        }

        // If still no mnemonic, generate a new one
        if (!mnemonic) {
          console.log('KeyService: Generating new mnemonic')
          mnemonic = generateMnemonic(wordlist)
        } else {
          console.log('KeyService: Using existing mnemonic')
        }

        // Validate the mnemonic
        console.log('KeyService: Validating mnemonic...')
        if (!validateMnemonic(mnemonic, wordlist)) {
          throw new Error('Invalid mnemonic')
        }

        // Store the mnemonic
        console.log('KeyService: Storing mnemonic...')
        await AsyncStorage.setItem(MNEMONIC_STORAGE_KEY, mnemonic)
        
        this.mnemonic = mnemonic
        this.isInitializedFlag = true

        console.log('KeyService: Initialization complete')
      } catch (err) {
        console.error('KeyService: Initialization error:', err)
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
      console.error('KeyService: Attempted to use service before initialization')
      throw new Error('KeyService not initialized')
    }
  }

  async getMnemonic(): Promise<string> {
    console.log('KeyService: Getting mnemonic...')
    this.ensureInitialized()
    return this.mnemonic!
  }

  isInitialized(): boolean {
    return this.isInitializedFlag && this.mnemonic !== null
  }

  async reset(): Promise<void> {
    console.log('KeyService: Resetting...')
    await AsyncStorage.removeItem(MNEMONIC_STORAGE_KEY)
    this.mnemonic = null
    this.isInitializedFlag = false
    console.log('KeyService: Reset complete')
  }
}

// Export a singleton instance
export const keyService = new KeyServiceImpl()