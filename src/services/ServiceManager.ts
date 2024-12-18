import { keyService } from './KeyService'
import { breezService } from './breez/breezService'

class ServiceManagerImpl {
  private isInitialized = false
  private initializationPromise: Promise<void> | null = null

  async initializeServices(): Promise<void> {
    // If already initializing, wait for that to complete
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    // If already initialized, return immediately
    if (this.isInitialized) {
      return Promise.resolve()
    }

    this.initializationPromise = (async () => {
      try {
        // Initialize KeyService first
        await keyService.initialize()

        // Get mnemonic from KeyService
        const mnemonic = await keyService.getMnemonic()

        // Initialize BreezService with mnemonic from KeyService
        await breezService.initialize({
          mnemonic,
          network: 'TESTNET', // TODO: Make configurable
          apiKey: process.env.BREEZ_API_KEY
        })

        this.isInitialized = true
        console.log('All services initialized successfully')
      } catch (err) {
        console.error('Service initialization error:', err)
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
    // Reset all services in reverse order
    await breezService.disconnect()
    await keyService.reset()
    this.isInitialized = false
  }
}

// Export a singleton instance
export const serviceManager = new ServiceManagerImpl()