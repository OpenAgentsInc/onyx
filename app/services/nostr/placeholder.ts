import { getPublicKey, nip19 } from 'nostr-tools'
import { mnemonicToSeedSync } from 'bip39'
import { fromSeed } from 'bip32'

export interface NostrKeys {
  privateKey: string // hex format
  publicKey: string // hex format
  npub: string // bech32 format
  nsec: string // bech32 format
}

/**
 * Derives Nostr keys from a BIP39 mnemonic using BIP32 path m/44'/1237'/0'/0/0
 * as specified in NIP-06
 */
export async function deriveNostrKeys(mnemonic: string): Promise<NostrKeys> {
  // Convert mnemonic to seed
  const seed = mnemonicToSeedSync(mnemonic)
  
  // Derive private key using BIP32
  const node = fromSeed(seed)
  const child = node.derivePath("m/44'/1237'/0'/0/0")
  const privateKey = child.privateKey!.toString('hex')
  
  // Get public key from private key
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