import { getPublicKey, generatePrivateKey, nip19 } from 'nostr-tools'
import { sha256 } from '@noble/hashes/sha256'
import { bytesToHex } from '@noble/hashes/utils'

export interface NostrKeys {
  privateKey: string // hex format
  publicKey: string // hex format
  npub: string // bech32 format
  nsec: string // bech32 format
}

/**
 * Derives Nostr keys from a mnemonic by hashing it to create a private key
 */
export async function deriveNostrKeys(mnemonic: string): Promise<NostrKeys> {
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