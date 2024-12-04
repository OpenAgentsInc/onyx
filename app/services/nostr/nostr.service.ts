import { mnemonicToSeedSync } from 'bip39'
import * as bip32 from 'bip32'
import * as secp256k1 from '@noble/secp256k1'
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
   * Derive Nostr keys from Breez SDK mnemonic
   */
  async deriveKeys(breezMnemonic: string): Promise<NostrKeys> {
    if (!breezMnemonic) throw new Error('Breez mnemonic is required')
    
    // Convert mnemonic to seed
    const seed = mnemonicToSeedSync(breezMnemonic)
    
    // Derive private key using BIP32
    const node = bip32.fromSeed(seed)
    const child = node.derivePath("m/44'/1237'/0'/0/0")
    if (!child.privateKey) throw new Error('Failed to derive private key')
    
    const privateKeyHex = child.privateKey.toString('hex')
    const publicKeyHex = Buffer.from(secp256k1.schnorrGetPublicKey(privateKeyHex)).toString('hex')

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
    const hash = await secp256k1.utils.sha256(Buffer.from(serialized))
    event.id = Buffer.from(hash).toString('hex')

    // Sign the event
    const signature = await secp256k1.schnorr.sign(hash, this.keys.privateKey)
    event.sig = Buffer.from(signature).toString('hex')

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