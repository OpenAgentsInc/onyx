import { 
  defaultConfig, 
  connect, 
  disconnect, 
  getInfo, 
  LiquidNetwork, 
  parse, 
  InputTypeVariant, 
  prepareLnurlPay, 
  lnurlPay,
  receivePayment,
  prepareReceivePayment
} from '@breeztech/react-native-breez-sdk-liquid'
import * as FileSystem from 'expo-file-system'
import { BalanceInfo, BreezConfig, BreezService, Transaction } from './types'

// Helper function to convert file:// URL to path
const fileUrlToPath = (fileUrl: string) => {
  return decodeURIComponent(fileUrl.replace('file://', ''))
}

class BreezServiceImpl implements BreezService {
  private sdk: any = null
  private mnemonic: string | null = null
  private isInitializedFlag = false
  private initializationPromise: Promise<void> | null = null

  async initialize(config: BreezConfig): Promise<void> {
    // If already initializing, wait for that to complete
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    // If already initialized, return immediately
    if (this.isInitializedFlag && this.sdk) {
      return Promise.resolve()
    }

    // Create a new initialization promise
    this.initializationPromise = (async () => {
      try {
        // Use Expo's document directory which is guaranteed to be writable
        const workingDirUrl = `${FileSystem.documentDirectory}breez`
        const workingDir = fileUrlToPath(workingDirUrl)
        
        // Create working directory if it doesn't exist
        const dirInfo = await FileSystem.getInfoAsync(workingDirUrl)
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(workingDirUrl, { intermediates: true })
        }

        // Test directory write permissions
        try {
          const testFile = `${workingDirUrl}/test.txt`
          await FileSystem.writeAsStringAsync(testFile, 'test')
          await FileSystem.deleteAsync(testFile, { idempotent: true })
        } catch (err: any) {
          throw new Error(`Working directory is not writable: ${err.message}`)
        }

        // Use provided mnemonic
        if (!config.mnemonic) {
          throw new Error("Mnemonic is required for initialization")
        }
        this.mnemonic = config.mnemonic

        // Initialize SDK with proper working directory
        const sdkConfig = await defaultConfig(
          config.network === 'MAINNET' ? LiquidNetwork.MAINNET : LiquidNetwork.TESTNET,
          config.apiKey
        )
        
        sdkConfig.workingDir = workingDir

        // Connect to the SDK and store the instance
        this.sdk = await connect({ 
          mnemonic: this.mnemonic, 
          config: sdkConfig 
        })

        // Only set initialized after successful connect
        this.isInitializedFlag = true

        console.log('Breez SDK initialized successfully')
      } catch (err) {
        console.error('Breez initialization error:', err)
        this.isInitializedFlag = false
        this.sdk = null
        this.mnemonic = null
        throw err
      } finally {
        this.initializationPromise = null
      }
    })()

    return this.initializationPromise
  }

  private ensureInitialized() {
    if (!this.isInitializedFlag || !this.sdk) {
      throw new Error('Breez SDK not initialized')
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.sdk) {
        await disconnect()
        this.sdk = null
        this.isInitializedFlag = false
        this.mnemonic = null
      }
    } catch (err) {
      console.error('Error disconnecting from Breez:', err)
      throw err
    }
  }

  async getBalance(): Promise<BalanceInfo> {
    this.ensureInitialized()

    try {
      const info = await getInfo()
      return {
        balanceSat: info.balanceSat,
        pendingSendSat: info.pendingSendSat,
        pendingReceiveSat: info.pendingReceiveSat,
      }
    } catch (err) {
      console.error('Error fetching balance:', err)
      throw err
    }
  }

  async sendPayment(input: string, amount: number): Promise<Transaction> {
    this.ensureInitialized()

    try {
      // Try to parse the input as a Lightning Address or LNURL
      const parsedInput = await parse(input)
      
      if (parsedInput.type === InputTypeVariant.LN_URL_PAY) {
        // Handle Lightning Address payment
        const amountMsat = amount * 1000 // Convert sats to msats
        const prepareResponse = await prepareLnurlPay({
          data: parsedInput.data,
          amountMsat,
          comment: undefined,
          validateSuccessActionUrl: true
        })

        // Execute the LNURL payment
        const result = await lnurlPay({
          prepareResponse
        })

        return {
          id: result.paymentHash,
          amount: amount,
          timestamp: Date.now(),
          type: 'send',
          status: 'complete',
          paymentHash: result.paymentHash,
          fee: prepareResponse.feesSat,
        }
      } else {
        // Handle regular BOLT11 invoice
        const result = await this.sdk.sendPayment(input, amount)
        return {
          id: result.paymentHash,
          amount: result.amountSat,
          timestamp: Date.now(),
          type: 'send',
          status: result.status === 'complete' ? 'complete' : 'pending',
          paymentHash: result.paymentHash,
          fee: result.feeSat,
        }
      }
    } catch (err) {
      console.error('Error sending payment:', err)
      throw err
    }
  }

  async receivePayment(amount: number, description?: string): Promise<string> {
    this.ensureInitialized()

    try {
      // First prepare the receive payment
      const prepareResponse = await prepareReceivePayment({
        amountSat: amount,
        description: description || 'Payment request',
      })

      // Then create the actual invoice
      const result = await receivePayment({
        prepareResponse
      })
      
      return result.bolt11
    } catch (err) {
      console.error('Error creating invoice:', err)
      throw err
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    this.ensureInitialized()

    try {
      const txs = await this.sdk.listPayments()
      return txs.map((tx: any) => ({
        id: tx.id,
        amount: tx.amountSat,
        timestamp: tx.timestamp,
        type: tx.type === 'sent' ? 'send' : 'receive',
        status: tx.status,
        description: tx.description,
        paymentHash: tx.paymentHash,
        fee: tx.feeSat,
      }))
    } catch (err) {
      console.error('Error fetching transactions:', err)
      throw err
    }
  }

  async getMnemonic(): Promise<string> {
    this.ensureInitialized()
    if (!this.mnemonic) {
      throw new Error('Mnemonic not available')
    }
    return this.mnemonic
  }

  isInitialized(): boolean {
    return this.isInitializedFlag && this.sdk !== null
  }
}

// Export a singleton instance
export const breezService = new BreezServiceImpl()