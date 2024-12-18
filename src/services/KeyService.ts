import { generateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'

class KeyService {
  private static instance: KeyService
  private mnemonic: string | null = null
  private isInitialized = false
  
  private constructor() {}
  
  static getInstance(): KeyService {
    if (!KeyService.instance) {
      KeyService.instance = new KeyService()
    }
    return KeyService.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return
    
    try {
      // Generate new mnemonic if one doesn't exist
      // TODO: Check storage for existing mnemonic first
      this.mnemonic = generateMnemonic(wordlist)
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize KeyService:', error)
      throw error
    }
  }

  getMnemonic(): string | null {
    if (!this.isInitialized) {
      throw new Error('KeyService not initialized')
    }
    return this.mnemonic
  }

  isReady(): boolean {
    return this.isInitialized
  }
}

export default KeyService.getInstance()