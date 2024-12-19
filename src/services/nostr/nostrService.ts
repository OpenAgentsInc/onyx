import { getPublicKey, nip19 } from "nostr-tools"
import { sha256 } from "@noble/hashes/sha256"
import { bytesToHex } from "@noble/hashes/utils"
import { keyService } from "../KeyService"
import { NostrKeys, NostrService } from "./nostr.types"

class NostrServiceImpl implements NostrService {
  private keys: NostrKeys | null = null
  private isInitializedFlag = false
  private initializationPromise: Promise<void> | null = null

  async initialize(): Promise<void> {
    console.log('NostrService: Starting initialization...')

    // If already initializing, wait for that to complete
    if (this.initializationPromise) {
      console.log('NostrService: Already initializing, waiting...')
      return this.initializationPromise
    }

    // If already initialized, return immediately
    if (this.isInitializedFlag && this.keys) {
      console.log('NostrService: Already initialized')
      return Promise.resolve()
    }

    this.initializationPromise = (async () => {
      try {
        console.log('NostrService: Getting mnemonic from KeyService...')
        // Get mnemonic from KeyService
        const mnemonic = await keyService.getMnemonic()

        console.log('NostrService: Deriving Nostr keys...')
        // Derive Nostr keys from mnemonic
        this.keys = await this.deriveNostrKeys(mnemonic)
        this.isInitializedFlag = true

        console.log('NostrService: Initialization complete. Public key:', this.keys.npub)
      } catch (err) {
        console.error('NostrService: Initialization error:', err)
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
    console.log('NostrService: Starting key derivation...')
    // Hash the mnemonic to get a 32-byte private key
    const hash = sha256(mnemonic)
    const privateKey = bytesToHex(hash)

    // Get public key using nostr-tools
    const publicKey = getPublicKey(privateKey)

    // Convert to bech32 format
    const npub = nip19.npubEncode(publicKey)
    const nsec = nip19.nsecEncode(privateKey)

    console.log('NostrService: Key derivation complete')
    return {
      privateKey,
      publicKey,
      npub,
      nsec
    }
  }

  async getKeys(): Promise<NostrKeys> {
    console.log('NostrService: Getting keys...')
    if (!this.isInitializedFlag || !this.keys) {
      console.error('NostrService: Attempted to get keys before initialization')
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
