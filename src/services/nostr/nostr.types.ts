export interface NostrKeys {
  privateKey: string
  publicKey: string
  npub: string
  nsec: string
}

export interface NostrService {
  initialize(): Promise<void>
  getKeys(): Promise<NostrKeys>
  isInitialized(): boolean
}