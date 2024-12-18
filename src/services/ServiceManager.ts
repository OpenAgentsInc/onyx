import { keyService } from './KeyService'
import { breezService } from './breez/breezService'
import { nostrService } from './nostr/nostrService'

class ServiceManagerImpl {
  private isInitialized = false
  private initializationPromise: Promise<void> | null = null

  async initializeServices(): Promise<void> {
    console.log('ServiceManager: Starting initialization...')
    
    // If already initializing, wait for that to complete
    if (this.initializationPromise) {
      console.log('ServiceManager: Already initializing, waiting...')
      return this.initializationPromise
    }

    // If already initialized, return immediately
    if (this.isInitialized) {
      console.log('ServiceManager: Already initialized')
      return Promise.resolve()
    }

    this.initializationPromise = (async () => {
      try {
        console.log('ServiceManager: Initializing KeyService...')
        // Initialize KeyService first
        await keyService.initialize()
        console.log('ServiceManager: KeyService initialized')

        // Get mnemonic from KeyService
        const mnemonic = await keyService.getMnemonic()
        console.log('ServiceManager: Got mnemonic from KeyService')

        console.log('ServiceManager: Starting parallel service initialization...')
        // Initialize services that depend on the mnemonic
        await Promise.all([
          // Initialize BreezService with mnemonic from KeyService
          breezService.initialize({
            mnemonic,
            network: 'TESTNET', // TODO: Make configurable
            apiKey: process.env.BREEZ_API_KEY
          }).then(() => console.log('ServiceManager: BreezService initialized')),
          // Initialize NostrService
          nostrService.initialize().then(() => console.log('ServiceManager: NostrService initialized'))
        ])

        this.isInitialized = true
        console.log('ServiceManager: All services initialized successfully')
      } catch (err) {
        console.error('ServiceManager: Initialization error:', err)
        this.isInitialized = false
        throw err
      } finally {
        this.initializationPromise = null
      }
    })()

    return this.initializationPromise
  }

  isReady(): boolean {
    return this.isInitialized
  }

  async reset(): Promise<void> {
    console.log('ServiceManager: Resetting all services...')
    // Reset all services in reverse order
    await breezService.disconnect()
    await keyService.reset()
    this.isInitialized = false
    console.log('ServiceManager: Reset complete')
  }
}

// Export a singleton instance
export const serviceManager = new ServiceManagerImpl()