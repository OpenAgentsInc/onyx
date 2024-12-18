import KeyService from './KeyService'

class ServiceManager {
  private static instance: ServiceManager
  private isInitialized = false
  
  private constructor() {}
  
  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager()
    }
    return ServiceManager.instance
  }

  async initializeServices(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Critical services first
      await KeyService.initialize()
      
      // Then parallel initialization of non-critical services
      await Promise.all([
        // Add other service initializations here
        // StorageService.initialize(),
        // NetworkService.initialize()
      ])

      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize services:', error)
      throw error
    }
  }

  isReady(): boolean {
    return this.isInitialized
  }
}

export default ServiceManager.getInstance()