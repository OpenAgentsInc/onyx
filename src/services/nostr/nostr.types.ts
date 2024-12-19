export interface NostrKeys {
  privateKey: string // hex format
  publicKey: string // hex format
  npub: string // bech32 format
  nsec: string // bech32 format
}

export interface NostrService {
  initialize(): Promise<void>
  getKeys(): Promise<NostrKeys>
  isInitialized(): boolean
}
