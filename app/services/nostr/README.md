# Nostr Services

This directory contains the core Nostr service implementations for the Onyx app. Here's an overview of each file:

## Core Files

### channel.ts
Manages Nostr channels, including both public and private channels. Handles channel creation, messaging, metadata management, and subscription functionality. Supports both encrypted and unencrypted channels through NIP-28 implementation.

### comment_to_trade.ts
Provides utilities for parsing and creating trade commands in a standardized format. Handles BUY/SELL commands with amount ranges, currencies, prices, and payment tags. Includes support for additional metadata like expiration dates.

### contacts.ts
Manages user contacts in the Nostr network. Handles both public and private contacts, contact list synchronization, and pubkey resolution. Includes support for NIP-05 identifier resolution and various Nostr address formats.

### encchannel.ts
Implements encrypted channel functionality for private communications. Handles channel creation, invitation, message encryption/decryption, and metadata management. Uses NIP-04 and custom encryption schemes for secure messaging.

### ident.ts
Core identity management and cryptographic operations. Implements various NIPs (Nostr Implementation Possibilities) including NIP-04 encryption, NIP-44 encryption, and custom encryption schemes. Handles key generation, event signing, and message encryption/decryption.

### listing.ts
Implements the Arcade marketplace listing system. Manages buy/sell listings, offers, and actions (accept/finalize/comment) with support for both public and private interactions. Includes geohash-based location support and expiration handling.

### nip28channel.ts
Implementation of NIP-28 channel protocol for public chat channels. Handles channel creation, metadata management, messaging, and event subscriptions. Supports channel discovery, message threading, and user muting capabilities.

### nostr.ts
Main Nostr network interaction class. Provides key derivation from mnemonics and conversion between different key formats (hex/bech32). Based on the arclib library for core Nostr functionality.

### nostr.types.ts
Type definitions for Nostr-related data structures, including key formats (private/public keys in hex and bech32 formats).

### pool.ts
Core relay pool management with automatic reconnection handling. Manages relay connections, subscriptions, and event publishing. Includes support for NIP-11 relay capability detection and LRU caching of subscriptions.

### private.ts
Handles private messaging functionality with support for multiple encryption schemes (NIP-04, NIP-44). Includes features for message threading, blinded events, and LRU caching of decrypted messages.

### profile.ts
Manages user profiles with support for both public and private profile data. Handles profile creation, updates, and retrieval with encrypted storage of sensitive profile information.

### util.ts
Utility functions for debugging and object tracking. Provides unique identifier generation for objects using WeakMap for memory-efficient object-to-id mapping.

## Usage

These services form the core Nostr functionality of the Onyx app, providing:
- Channel management (public/private)
- Contact management
- Trade command parsing
- Nostr event handling
- Encrypted communication
- Profile management
- Identity and cryptographic operations
- Marketplace listings and trading
- Public chat channels (NIP-28)
- Key management and derivation
- Relay pool management and auto-reconnection
- Private messaging with multiple encryption schemes
- Profile data management with privacy controls

Each service is designed to work with the NostrPool class for relay communication and event handling.

## Implementation Notes

- Uses LRU caching for optimized performance
- Supports multiple NIPs (Nostr Implementation Possibilities)
- Implements various encryption schemes for different use cases
- Handles automatic relay reconnection
- Provides geohash-based location services
- Includes comprehensive error handling
- Supports both public and private data management
- Uses WeakMap for memory-efficient object tracking