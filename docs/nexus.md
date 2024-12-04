# Onyx <> Nexus

Onyx is a Nostr client that connects to a Nexus relay on the backend.

Nexus is an opinionated Nostr relay written in Rust that implements a subset of the Nostr protocol plus additional functionality specific to the OpenAgents network.

## Authentication

User authenticates to the mobile app with a BIP39 seed phrase. This controls their Bitcoin wallet and Nostr identity.
- A BIP39 seed phrase is used to initialize the Breez SDK
- Paired with the BIP32 derivation path specified in [NIP-06](https://github.com/nostr-protocol/nips/blob/master/06.md) we get the user's Nostr identity (and [NIP-19](https://github.com/nostr-protocol/nips/blob/master/19.md) for its npub/nsec)

User authenticates to Onyx through [NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md) by signing an encrypted message with their Nostr key.
