import { getPublicKey, nip19 } from "nostr-tools"
import { sha256 } from "@noble/hashes/sha256"
import { bytesToHex } from "@noble/hashes/utils"
import { NostrKeys, NostrService } from "./nostr.types"
import { keyService } from "../KeyService"

class NostrServiceImpl implements NostrService {
  private keys: NostrKeys | null = null
  private isInitializedFlag = false
  private initializationPromise: Promise<void> | null = null

  async initialize(): Promise<void> {
    // If already initializing, wait for that to complete
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    // If already initialized, return immediately
    if (this.isInitializedFlag && this.keys) {
      return Promise.resolve()
    }

    this.initializationPromise = (async () => {
      try {
        // Get mnemonic from KeyService
        const mnemonic = await keyService.getMnemonic()

        // Derive Nostr keys from mnemonic
        this.keys = await this.deriveNostrKeys(mnemonic)
        this.isInitializedFlag = true

        console.log('NostrService initialized successfully')
      } catch (err) {
        console.error('NostrService initialization error:', err)
        this.isInitializedFlag = false
        this.keys = null
        throw err
      } finally {
        this.initializationPromise = null
      }
    })()

    return this.initializationPromise
  }

  private async deriveNostrKeys(mnemonic: string): Promise<NostrKeys> {
    // Hash the mnemonic to get a 32-byte private key
    const hash = sha256(mnemonic)
    const privateKey = bytesToHex(hash)

    // Get public key using nostr-tools
    const publicKey = getPublicKey(privateKey)

    // Convert to bech32 format
    const npub = nip19.npubEncode(publicKey)
    const nsec = nip19.nsecEncode(privateKey)

    return {
      privateKey,
      publicKey,
      npub,
      nsec
    }
  }

  async getKeys(): Promise<NostrKeys> {
    if (!this.isInitializedFlag || !this.keys) {
      throw new Error('NostrService not initialized')
    }
    return this.keys
  }

  isInitialized(): boolean {
    return this.isInitializedFlag && this.keys !== null
  }
}

// Export a singleton instance
export const nostrService = new NostrServiceImpl()