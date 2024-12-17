# Onyx Wallet System

The Onyx wallet system is built on top of Breez SDK and provides secure mnemonic storage, balance management, and transaction handling.

## Architecture

The wallet system consists of several key components:

### 1. SecureStorageService

Located in `app/services/storage/secureStorage.ts`, this service handles secure storage of sensitive data:

```typescript
class SecureStorageService {
  static async getMnemonic(): Promise<string | null>
  static async setMnemonic(mnemonic: string): Promise<boolean>
  static async generateMnemonic(): Promise<string>
  static async deleteMnemonic(): Promise<void>
}
```

- Uses `expo-secure-store` for encrypted storage
- Validates mnemonics using BIP39
- Provides atomic operations for mnemonic management
- Uses versioned storage keys for future migrations

### 2. WalletStore

Located in `app/models/WalletStore.ts`, this MobX-State-Tree store manages wallet state:

```typescript
const WalletStoreModel = types
  .model("WalletStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    balanceSat: types.number,
    pendingSendSat: types.number,
    pendingReceiveSat: types.number,
    transactions: types.array(TransactionModel),
    mnemonic: types.maybeNull(types.string),
  })
```

Key responsibilities:
- Manages wallet initialization state
- Handles balance and transaction data
- Coordinates between SecureStorage and BreezService
- Provides actions for wallet operations
- Handles error states

### 3. WalletProvider

Located in `app/providers/WalletProvider.tsx`, this React provider ensures wallet initialization:

```typescript
export const WalletProvider = observer(({ children }) => {
  const { walletStore } = useStores()

  useEffect(() => {
    walletStore.initialize()
  }, [walletStore])

  // ... loading state handling
})
```

- Initializes wallet on app start
- Shows loading state during initialization
- Provides wallet context to app

### 4. BalanceHeader

Located in `app/components/BalanceHeader.tsx`, this component displays and manages balance:

```typescript
const BalanceHeader = (): ReactElement => {
  // ... balance display and refresh logic
}
```

- Displays current balance
- Periodically refreshes balance data
- Shows loading states
- Handles errors

## Initialization Flow

1. App starts → WalletProvider mounts
2. WalletProvider calls walletStore.initialize()
3. WalletStore:
   - Checks for mnemonic in store
   - If not found, uses SecureStorageService to get/generate mnemonic
   - Initializes breezService with the mnemonic
   - Fetches initial balance
4. BalanceHeader begins periodic balance updates

## Wallet Restoration

When restoring a wallet:

1. User enters mnemonic in RestoreWalletScreen
2. WalletStore.restoreWallet():
   - Validates mnemonic
   - Saves to SecureStorage
   - Reinitializes wallet system
   - Fetches updated balance

## Security Considerations

1. Sensitive Data Storage
   - Mnemonics stored in expo-secure-store
   - MobX state not persisted for sensitive data
   - Versioned storage keys for migrations

2. Initialization Safety
   - Validation before storage
   - Error handling at each step
   - Clean disconnection handling

3. State Management
   - Clear initialization states
   - Error boundary support
   - Proper cleanup on unmount

## Development Guidelines

1. Sensitive Data
   - Always use SecureStorageService for mnemonics
   - Never log sensitive data
   - Clear sensitive data on logout

2. State Updates
   - Use walletStore.setProp for state updates
   - Handle errors appropriately
   - Clean up subscriptions and intervals

3. UI Components
   - Show loading states during operations
   - Handle error states gracefully
   - Provide feedback for user actions

## Testing

Key areas to test:

1. Initialization
   - New wallet creation
   - Existing wallet loading
   - Error handling

2. Restoration
   - Valid mnemonic handling
   - Invalid mnemonic handling
   - State cleanup

3. Balance Updates
   - Initial load
   - Periodic updates
   - Error recovery

## Future Improvements

1. Migration System
   - Version storage keys
   - Upgrade paths
   - Data validation

2. Enhanced Security
   - Biometric authentication
   - Timeout locks
   - Encrypted backup

3. Performance
   - Caching strategies
   - Optimistic updates
   - Background refresh

## Troubleshooting

Common issues and solutions:

1. Balance not updating
   - Check initialization state
   - Verify breezService connection
   - Check error states

2. Restoration fails
   - Validate mnemonic format
   - Check secure storage access
   - Verify initialization flow

3. Initialization hangs
   - Check breezService status
   - Verify API key configuration
   - Check network connectivity