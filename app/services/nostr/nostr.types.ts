export interface NostrKeys {
  privateKey: string // hex format
  publicKey: string // hex format
  npub: string // bech32 format
  nsec: string // bech32 format
}

export interface NostrEvent {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  sig: string
}

export interface NostrAuthEvent extends NostrEvent {
  kind: 22242
  tags: [
    ["relay", string],
    ["challenge", string]
  ]
}

export interface NostrConfig {
  relayUrl: string
  timeout?: number
}

export interface NostrAuthState {
  authenticated: boolean
  challenge?: string
  authEvent?: NostrAuthEvent
}