# Breez SDK Integration in Onyx

## Overview

This document describes the integration of the Breez SDK into the Onyx mobile app, providing Lightning Network payment capabilities through a self-custodial solution.

## Components

### 1. BreezProvider (`app/providers/BreezProvider.tsx`)

Manages the Breez SDK lifecycle and provides global access to the SDK instance and wallet information.

```typescript
import { useBreez } from '@/providers/BreezProvider'

function MyComponent() {
  const { 
    sdk, 
    isInitialized, 
    error,
    balanceInfo,
    fetchBalanceInfo 
  } = useBreez()
  
  // Access balance information
  const { balanceSat, pendingSendSat, pendingReceiveSat } = balanceInfo || {};
}
```

Key features:
- Automatic SDK initialization
- Mnemonic generation and management
- Working directory setup
- Connection state management
- Balance tracking and auto-updates
- Error handling

### 2. WalletStore (`app/models/WalletStore.ts`)

MobX State Tree store for wallet state management.

```typescript
import { useStores } from '@/models'

function MyComponent() {
  const { walletStore } = useStores()
  const { balanceSat, pendingSendSat, pendingReceiveSat } = walletStore
}
```

Properties:
- `balanceSat`: Current balance in satoshis
- `pendingSendSat`: Pending outgoing transactions
- `pendingReceiveSat`: Pending incoming transactions
- `transactions`: Transaction history

Actions:
- `setBalance(balance: number)`
- `setPendingSend(amount: number)`
- `setPendingReceive(amount: number)`
- `setTransactions(txs: any[])`
- `fetchBalanceInfo()`

### 3. BalanceDisplay (`app/components/BalanceDisplay.tsx`)

React component for displaying wallet balance information.

Features:
- Real-time balance updates
- Pending transaction indicators
- Auto-refresh every 30 seconds
- Error handling

### 4. WalletScreen (`app/screens/WalletScreen.tsx`)

Main wallet interface screen.

Features:
- Balance display
- Loading state handling
- Error state handling

## Installation

1. Install required packages:
```bash
yarn add @breeztech/react-native-breez-sdk-liquid @react-native-async-storage/async-storage expo-file-system expo-crypto buffer bip39
```

2. Add BreezProvider to app.tsx:
```typescript
import { BreezProvider } from '@/providers/BreezProvider'

function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <KeyboardProvider>
          <BreezProvider>
            <AppNavigator />
          </BreezProvider>
        </KeyboardProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}
```

## Implementation Details

### Initialization Flow

1. BreezProvider mounts
2. Checks for existing mnemonic
3. Generates new mnemonic if needed
4. Sets up working directory
5. Initializes Breez SDK
6. Makes SDK instance available via context
7. Starts balance auto-update cycle

### Balance Updates

1. Initial fetch on SDK initialization
2. Automatic updates every 30 seconds
3. Manual refresh available via fetchBalanceInfo()
4. Updates stored in balanceInfo state
5. Error handling for failed updates

### Using getInfo() for Balance

The SDK uses getInfo() to fetch balance information:

```typescript
import { getInfo } from '@breeztech/react-native-breez-sdk-liquid';

const fetchBalanceInfo = async () => {
  const info = await getInfo();
  return {
    balanceSat: info.balanceSat,
    pendingSendSat: info.pendingSendSat,
    pendingReceiveSat: info.pendingReceiveSat,
  };
};
```

### Error Handling

The integration includes error handling for:
- SDK initialization failures
- Network connectivity issues
- Invalid mnemonic
- Working directory problems
- Balance fetch failures
- Auto-update cycle issues

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

## Testing

### Manual Testing Steps
1. Install dependencies
2. Run app in development
3. Navigate to WalletScreen
4. Verify initialization
5. Check balance display
6. Test error states
7. Verify auto-updates
8. Test manual refresh

### Common Issues

1. SDK Initialization Failures
   - Check working directory permissions
   - Verify mnemonic storage
   - Check network connectivity

2. Balance Update Issues
   - Verify SDK connection
   - Check update interval
   - Review error logs
   - Confirm getInfo() availability

## Future Improvements

1. UI/UX Enhancements
   - Transaction history view
   - QR code generation/scanning
   - Send/receive screens
   - Fiat conversion display

2. Technical Improvements
   - Offline support
   - Background balance updates
   - Enhanced error reporting
   - Automated backups
   - Multi-device sync

3. Security Enhancements
   - Biometric authentication
   - Transaction signing confirmation
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