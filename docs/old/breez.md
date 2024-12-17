# Breez SDK Integration

## Overview
The Breez SDK provides a self-custodial Lightning payment solution that we'll integrate into Onyx for Bitcoin payments. It offers an end-to-end solution for integrating Lightning payments, utilizing the Liquid Network with on-chain interoperability and third-party fiat on-ramps.

## Key Features

- **Self-custodial**: Users maintain control of their funds
- **No KYC required**: Lower barriers to adoption
- **Built-in liquidity**: No manual channel management needed
- **Interoperable**: Multiple apps can interact with the same user node
- **Global P2P**: Avoids regulatory hurdles
- **Multi-device support**: Sync across devices
- **Real-time state backup**: Automatic backup of wallet state
- **Fiat on-ramps**: Built-in support for buying bitcoin

## Core Functions

- **Sending payments** via:
  - bolt11
  - lnurl-pay
  - lightning address
  - btc address
- **Receiving payments** via:
  - bolt11
  - lnurl-withdraw
  - btc address
- **Wallet interactions**:
  - Balance checking
  - Max payment limits
  - Max receive limits
  - On-chain balance

## How It Works

The Breez SDK uses submarine swaps and reverse submarine swaps to send and receive payments, enabling funds to move between the Lightning Network and the Liquid sidechain:

- **Sending**: Converts L-BTC from user's Liquid wallet into sats on Lightning Network
- **Receiving**: Converts incoming sats into L-BTC for deposit in Liquid wallet

## Technical Details

- Minimum payment size: 1,000 sats
- Static Liquid on-chain fees
- No channel management required
- No LSP needed
- No setup fees for end-users

## Integration Plan

1. **Initial Setup**
   - Add Breez SDK dependencies
   - Configure API keys and environment
   - Initialize SDK in app startup

2. **Core Features**
   - Lightning address creation/management
   - Send/receive payments
   - Generate invoices
   - Payment history

3. **UI Components**
   - Payment QR code display
   - Transaction history view
   - Balance display
   - Send/receive screens

4. **Error Handling**
   - Network connectivity issues
   - Payment failures
   - Balance insufficient errors
   - Node connection problems

## Security Considerations

- Secure storage of keys
- Backup and recovery procedures
- Transaction signing security
- Network security measures

## Future Enhancements

- Advanced payment features
- Multiple wallet support
- Enhanced analytics
- Automated backups
- Custom notifications
- Mobile push notifications
