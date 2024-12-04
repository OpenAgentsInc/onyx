# Breez SDK Integration Guide

## Overview

This document describes the integration of the Breez SDK into the Onyx mobile app, providing Lightning Network payment capabilities.

## Architecture

The integration consists of several key components:

### 1. BreezProvider (app/providers/BreezProvider.tsx)

A React Context provider that initializes and manages the Breez SDK instance. It handles:
- SDK initialization
- Working directory setup
- Mnemonic management
- Connection state

Usage:
```tsx
import { useBreez } from '../providers/BreezProvider'

function MyComponent() {
  const { sdk, isInitialized, error } = useBreez()
  // Use sdk for Breez operations
}
```

### 2. WalletStore (app/models/WalletStore.ts)

A MobX State Tree store that manages the wallet state:
- Balance tracking
- Pending transactions
- Transaction history

Features:
- Real-time balance updates
- Pending transaction tracking
- Transaction history management

### 3. BalanceDisplay (app/components/BalanceDisplay.tsx)

A React component that displays:
- Current balance in sats
- Pending send amounts
- Pending receive amounts

## Setup

1. Install required packages:
```bash
yarn add @breeztech/react-native-breez-sdk-liquid @react-native-async-storage/async-storage expo-file-system expo-crypto buffer bip39
```

2. Initialize the providers in app.tsx:
```tsx
<SafeAreaProvider>
  <ErrorBoundary>
    <BreezProvider>
      <App />
    </BreezProvider>
  </ErrorBoundary>
</SafeAreaProvider>
```

## Usage

### Accessing Breez SDK

```tsx
import { useBreez } from '../providers/BreezProvider'

function MyComponent() {
  const { sdk, isInitialized } = useBreez()
  
  useEffect(() => {
    if (isInitialized && sdk) {
      // Perform SDK operations
    }
  }, [isInitialized, sdk])
}
```

### Managing Wallet State

```tsx
import { useStores } from '../models'

function MyComponent() {
  const { walletStore } = useStores()
  const { balanceSat, pendingSendSat } = walletStore
  
  // Access wallet state and actions
}
```

## Security Considerations

1. Mnemonic Storage
   - Stored securely using AsyncStorage
   - Generated only once per installation
   - Validated before use

2. Working Directory
   - Uses Expo's secure document directory
   - Permissions verified on startup
   - Write access tested before use

3. Network Security
   - SSL/TLS for all communications
   - Mainnet/Testnet configuration managed via SDK
   - API keys stored securely

## Error Handling

The integration includes comprehensive error handling:
- SDK initialization errors
- Network connectivity issues
- Balance fetch failures
- Transaction errors

## Testing

To test the integration:
1. Run in development mode
2. Check SDK initialization
3. Verify balance display
4. Test send/receive functionality
5. Verify error handling

## Troubleshooting

Common issues and solutions:
1. SDK Initialization Failures
   - Check working directory permissions
   - Verify mnemonic storage
   - Check network connectivity

2. Balance Update Issues
   - Verify SDK connection
   - Check update interval
   - Review error logs

## Future Improvements

Planned enhancements:
1. Transaction history UI
2. Payment request generation
3. QR code scanning
4. Fiat conversion display
5. Enhanced error reporting
6. Automated backups