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

## Additional Files
(More files to be documented as they are reviewed)

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

Each service is designed to work with the NostrPool class for relay communication and event handling.