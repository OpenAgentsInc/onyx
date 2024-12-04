# Breez SDK Integration in Onyx

## Overview

This document describes the integration of the Breez SDK into the Onyx mobile app, providing Lightning Network payment capabilities through a self-custodial solution.

## Architecture

### 1. Breez Service (`app/services/breez/`)

Core service layer that handles direct interaction with the Breez SDK.

#### Files:
- `types.ts` - Type definitions
- `breezService.ts` - Core SDK functionality
- `index.ts` - Export file

#### Key Features:
- SDK initialization and configuration
- Mnemonic management
- Working directory setup
- Balance and transaction handling
- Payment operations

### 2. WalletStore (`app/models/WalletStore.ts`)

MobX State Tree store for wallet state management.

```typescript
import { useStores } from '@/models'

function MyComponent() {
  const { walletStore } = useStores()
  const { balanceSat, isInitialized, error } = walletStore
}
```

#### Properties:
- `isInitialized`: boolean
- `error`: string | null
- `balanceSat`: number
- `pendingSendSat`: number
- `pendingReceiveSat`: number
- `transactions`: Transaction[]

#### Actions:
- `initialize()`
- `disconnect()`
- `fetchBalanceInfo()`
- `fetchTransactions()`
- `sendPayment(bolt11: string, amount: number)`
- `receivePayment(amount: number, description?: string)`

#### Views:
- `totalBalance`
- `hasPendingTransactions`
- `recentTransactions`
- `pendingTransactions`

### 3. Components

#### BalanceDisplay (`app/components/BalanceDisplay.tsx`)
- Shows current balance
- Displays pending transactions
- Auto-updates every 30 seconds
- Handles loading and error states

#### WalletScreen (`app/screens/WalletScreen.tsx`)
- Main wallet interface
- Transaction history
- Send/receive functionality

## Implementation Details

### Initialization Flow

1. App starts
2. WalletStore initializes
3. Breez service configures working directory
4. Checks for existing mnemonic
5. Generates new mnemonic if needed
6. Initializes SDK
7. Starts balance auto-update cycle

### Balance Updates

1. Initial fetch on SDK initialization
2. Automatic updates every 30 seconds
3. Manual refresh available
4. Updates stored in WalletStore

### Transaction Management

1. Transactions stored in WalletStore
2. Automatic updates with balance checks
3. Persistent storage
4. Status tracking (pending/complete)

### Error Handling

The integration includes error handling for:
- SDK initialization failures
- Network connectivity issues
- Invalid mnemonic
- Working directory problems
- Balance fetch failures
- Transaction failures

## Security Considerations

### Mnemonic Management
- Generated using bip39
- Stored in AsyncStorage
- Validated before use
- Never exposed to external services

### Working Directory
- Uses Expo's secure document directory
- Permissions verified on startup
- Write access tested
- Cleanup on unmount

### Network Security
- SSL/TLS for all communications
- API key stored securely
- No sensitive data in logs

## Usage Examples

### Sending a Payment

```typescript
const { walletStore } = useStores()

try {
  await walletStore.sendPayment(bolt11, amount)
} catch (error) {
  console.error('Payment failed:', error)
}
```

### Receiving a Payment

```typescript
const { walletStore } = useStores()

try {
  const invoice = await walletStore.receivePayment(amount, 'Payment description')
  // Use invoice.bolt11 for QR code or sharing
} catch (error) {
  console.error('Failed to create invoice:', error)
}
```

### Checking Balance

```typescript
const { walletStore } = useStores()
const { balanceSat, pendingSendSat, pendingReceiveSat } = walletStore

// Force refresh
await walletStore.fetchBalanceInfo()
```

## Testing

### Manual Testing Steps
1. Install dependencies
2. Run app in development
3. Navigate to WalletScreen
4. Verify initialization
5. Check balance display
6. Test transactions
7. Verify auto-updates
8. Test error states

### Common Issues

1. SDK Initialization Failures
   - Check working directory permissions
   - Verify mnemonic storage
   - Check network connectivity

2. Balance Update Issues
   - Verify SDK connection
   - Check update interval
   - Review error logs

## Future Improvements

1. UI/UX Enhancements
   - Enhanced transaction history
   - Advanced filtering options
   - Fiat conversion display
   - QR code scanning

2. Technical Improvements
   - Offline support
   - Background updates
   - Enhanced error reporting
   - Automated backups

3. Security Enhancements
   - Biometric authentication
   - Enhanced key storage
   - Backup encryption

## Support

For issues or questions:
1. Check error logs
2. Review documentation
3. Contact development team
4. Submit GitHub issue

## References

- [Breez SDK Documentation](https://sdk-doc.breez.technology/)
- [MobX State Tree Documentation](https://mobx-state-tree.js.org/)
- [React Native Async Storage](https://react-native-async-storage.github.io/async-storage/)
- [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/)