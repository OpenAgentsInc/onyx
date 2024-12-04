import { defaultConfig, connect, disconnect, getInfo, LiquidNetwork } from '@breeztech/react-native-breez-sdk-liquid'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system'
import * as bip39 from 'bip39'
import { BalanceInfo, BreezConfig, BreezService, Transaction } from './types'

const MNEMONIC_KEY = '@breez_mnemonic'

// Helper function to convert file:// URL to path
const fileUrlToPath = (fileUrl: string) => {
  return decodeURIComponent(fileUrl.replace('file://', ''))
}

class BreezServiceImpl implements BreezService {
  private sdk: any = null
  private mnemonic: string | null = null
  private isInitializedFlag = false

  async initialize(config: BreezConfig): Promise<void> {
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
      } catch (err) {
        throw new Error(`Working directory is not writable: ${err.message}`)
      }

      // Get or generate mnemonic
      let currentMnemonic = await AsyncStorage.getItem(MNEMONIC_KEY)
      if (!currentMnemonic) {
        currentMnemonic = bip39.generateMnemonic()
        await AsyncStorage.setItem(MNEMONIC_KEY, currentMnemonic)
      }

      // Verify mnemonic is valid
      if (!bip39.validateMnemonic(currentMnemonic)) {
        currentMnemonic = bip39.generateMnemonic()
        await AsyncStorage.setItem(MNEMONIC_KEY, currentMnemonic)
      }

      this.mnemonic = currentMnemonic

      // Initialize SDK with proper working directory
      const sdkConfig = await defaultConfig(
        config.network === 'MAINNET' ? LiquidNetwork.MAINNET : LiquidNetwork.TESTNET,
        config.apiKey
      )
      
      sdkConfig.workingDir = workingDir

      this.sdk = await connect({ mnemonic: currentMnemonic, config: sdkConfig })
      this.isInitializedFlag = true
    } catch (err) {
      console.error('Breez initialization error:', err)
      throw err
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.sdk) {
        await disconnect()
        this.sdk = null
        this.isInitializedFlag = false
      }
    } catch (err) {
      console.error('Error disconnecting from Breez:', err)
      throw err
    }
  }

  async getBalance(): Promise<BalanceInfo> {
    if (!this.isInitializedFlag) {
      throw new Error('Breez SDK not initialized')
    }

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

  async sendPayment(bolt11: string, amount: number): Promise<Transaction> {
    if (!this.isInitializedFlag) {
      throw new Error('Breez SDK not initialized')
    }

    try {
      const result = await this.sdk.sendPayment(bolt11, amount)
      return {
        id: result.paymentHash,
        amount: result.amountSat,
        timestamp: Date.now(),
        type: 'send',
        status: result.status === 'complete' ? 'complete' : 'pending',
        paymentHash: result.paymentHash,
        fee: result.feeSat,
      }
    } catch (err) {
      console.error('Error sending payment:', err)
      throw err
    }
  }

  async receivePayment(amount: number, description?: string): Promise<string> {
    if (!this.isInitializedFlag) {
      throw new Error('Breez SDK not initialized')
    }

    try {
      const invoice = await this.sdk.receivePayment({
        amountSat: amount,
        description: description || 'Payment request',
      })
      return invoice.bolt11
    } catch (err) {
      console.error('Error creating invoice:', err)
      throw err
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    if (!this.isInitializedFlag) {
      throw new Error('Breez SDK not initialized')
    }

    try {
      const txs = await this.sdk.listPayments()
      return txs.map(tx => ({
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

  isInitialized(): boolean {
    return this.isInitializedFlag
  }
}

// Export a singleton instance
export const breezService = new BreezServiceImpl()