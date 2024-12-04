import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import { fromSeed } from 'bip32'
import { schnorr } from '@noble/secp256k1'
import { bech32 } from 'bech32'
import type { NostrKeys, NostrEvent, NostrAuthEvent, NostrConfig, NostrAuthState } from './nostr.types'

const NOSTR_BECH32_PREFIX = {
  PUBKEY: 'npub',
  PRIVKEY: 'nsec',
  NOTE: 'note'
}

export class NostrService {
  private config: NostrConfig
  private authState: NostrAuthState = {
    authenticated: false
  }
  private keys?: NostrKeys

  constructor(config: NostrConfig) {
    this.config = config
  }

  /**
   * Generate new Nostr keys from BIP39 mnemonic
   */
  async generateKeys(mnemonic?: string): Promise<NostrKeys> {
    // Generate or use provided mnemonic
    const seedPhrase = mnemonic || generateMnemonic()
    
    // Convert mnemonic to seed
    const seed = mnemonicToSeedSync(seedPhrase)
    
    // Derive private key using BIP32
    const node = fromSeed(seed)
    const child = node.derivePath("m/44'/1237'/0'/0/0")
    if (!child.privateKey) throw new Error('Failed to derive private key')
    
    const privateKeyHex = child.privateKey.toString('hex')
    const publicKeyHex = schnorr.getPublicKey(privateKeyHex).toString('hex')

    this.keys = {
      privateKey: privateKeyHex,
      publicKey: publicKeyHex,
      npub: this.encodeBech32(publicKeyHex, NOSTR_BECH32_PREFIX.PUBKEY),
      nsec: this.encodeBech32(privateKeyHex, NOSTR_BECH32_PREFIX.PRIVKEY)
    }

    return this.keys
  }

  /**
   * Encode hex string to bech32 format
   */
  private encodeBech32(hexString: string, prefix: string): string {
    const words = bech32.toWords(Buffer.from(hexString, 'hex'))
    return bech32.encode(prefix, words)
  }

  /**
   * Decode bech32 string to hex format
   */
  private decodeBech32(bech32String: string): string {
    const { words } = bech32.decode(bech32String)
    return Buffer.from(bech32.fromWords(words)).toString('hex')
  }

  /**
   * Create and sign an authentication event
   */
  async createAuthEvent(challenge: string): Promise<NostrAuthEvent> {
    if (!this.keys) throw new Error('Keys not initialized')

    const event: NostrAuthEvent = {
      kind: 22242,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['relay', this.config.relayUrl],
        ['challenge', challenge]
      ],
      content: '',
      pubkey: this.keys.publicKey,
      id: '', // Will be set after serializing
      sig: '' // Will be set after signing
    }

    // Calculate event ID
    const serialized = JSON.stringify([
      0,
      event.pubkey,
      event.created_at,
      event.kind,
      event.tags,
      event.content
    ])
    event.id = schnorr.utils.sha256(serialized).toString('hex')

    // Sign the event
    event.sig = schnorr.sign(event.id, this.keys.privateKey).toString('hex')

    return event
  }

  /**
   * Handle authentication with relay
   */
  async authenticate(challenge: string): Promise<boolean> {
    try {
      const authEvent = await this.createAuthEvent(challenge)
      
      // TODO: Send auth event to relay via websocket
      // For now just update local state
      this.authState = {
        authenticated: true,
        challenge,
        authEvent
      }

      return true
    } catch (error) {
      console.error('Authentication failed:', error)
      return false
    }
  }

  /**
   * Get current authentication state
   */
  getAuthState(): NostrAuthState {
    return this.authState
  }
}

// Singleton instance
export const nostrService = new NostrService({
  relayUrl: 'wss://relay.example.com' // TODO: Configure actual relay URL
})