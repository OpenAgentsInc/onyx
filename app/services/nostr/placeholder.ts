import { getPublicKey, nip19 } from 'nostr-tools'

export interface NostrKeys {
  privateKey: string // hex format
  publicKey: string // hex format
  npub: string // bech32 format
  nsec: string // bech32 format
}

/**
 * Derives Nostr keys from a hex private key
 * The private key should be derived from the Breez mnemonic
 */
export async function deriveNostrKeys(privateKey: string): Promise<NostrKeys> {
  // Get public key using nostr-tools
  const publicKey = getPublicKey(privateKey)
  
  // Convert to bech32 format using nostr-tools
  const npub = nip19.npubEncode(publicKey)
  const nsec = nip19.nsecEncode(privateKey)

  return {
    privateKey,
    publicKey,
    npub,
    nsec
  }
}