# Wallet Store Documentation

The Wallet Store is a MobX-State-Tree (MST) based store that manages the Lightning wallet state and operations. It's designed with a modular architecture that separates concerns and maintains clear dependencies between different parts of the system.

## Architecture

### Core Components

1. **WalletStore.ts**
   - Main store definition
   - Properties and views
   - Action declarations that delegate to implementation files
   - Organized in dependency order

2. **actions/**
   - Separate files for each action implementation
   - Clear separation of concerns
   - Typed interfaces for different store capabilities

### Type Hierarchy

The store uses a layered interface approach to manage dependencies:

1. **IWalletStoreBase**
   - Basic properties and actions
   - Minimal interface for simple operations
   ```typescript
   interface IWalletStoreBase extends IStateTreeNode {
     isInitialized: boolean
     error: string | null
     mnemonic: string | null
     setMnemonic: (mnemonic: string) => void
     setError: (message: string | null) => void
   }
   ```

2. **IWalletStoreBalance**
   - Extends base interface
   - Adds balance-related properties and actions
   ```typescript
   interface IWalletStoreBalance extends IWalletStoreBase {
     balanceSat: number
     pendingSendSat: number
     pendingReceiveSat: number
     fetchBalanceInfo: () => Promise<void>
   }
   ```

3. **IWalletStoreWithTransactions**
   - Extends balance interface
   - Adds transaction-related properties and methods
   ```typescript
   interface IWalletStoreWithTransactions extends IWalletStoreBalance {
     transactions: {
       clear: () => void
       replace: (items: any[]) => void
       push: (item: any) => void
     }
   }
   ```

4. **IWalletStore**
   - Full interface with all capabilities
   - Used by actions that need complete store access
   ```typescript
   interface IWalletStore extends IWalletStoreWithTransactions {
     setup: () => Promise<void>
     fetchTransactions: () => Promise<void>
     sendPayment: (bolt11: string, amount: number) => Promise<void>
     receivePayment: (amount: number, description?: string) => Promise<void>
     disconnect: () => Promise<void>
   }
   ```

## Action Organization

Actions are organized in dependency order:

1. **Basic Actions**
   - setMnemonic
   - setError

2. **Core Actions**
   - setup
   - fetchBalanceInfo
   - disconnect

3. **Transaction Actions**
   - fetchTransactions
   - sendPayment
   - receivePayment

## Usage Example

```typescript
const store = WalletStoreModel.create({
  isInitialized: false,
  error: null,
  balanceSat: 0,
  pendingSendSat: 0,
  pendingReceiveSat: 0,
  transactions: [],
  mnemonic: null,
})

// Initialize the wallet
await store.setup()

// Send a payment
try {
  const tx = await store.sendPayment(bolt11, amount)
  console.log("Payment sent:", tx)
} catch (error) {
  console.error("Payment failed:", error)
}
```

## Views

The store provides several computed views:

- `totalBalance`: Current balance in satoshis
- `hasPendingTransactions`: Whether there are any pending transactions
- `recentTransactions`: Transactions sorted by timestamp
- `pendingTransactions`: Only pending transactions

## Error Handling

All actions use a consistent error handling pattern:
1. Set error state using setError
2. Log errors with context
3. Throw or return as appropriate for the action

## Dependencies

The store integrates with several services:
- breezService: Lightning network operations
- SecureStorageService: Mnemonic storage
- TransactionModel: Transaction data structure

## Type Safety Notes

1. The store uses proper type casting with `as unknown as IWalletStore` in actions to maintain type safety while allowing necessary type conversions.
2. Balance properties match the breezService API exactly (balanceSat, pendingSendSat, pendingReceiveSat).
3. Transaction array methods (clear, replace, push) are properly typed in the interfaces.

## Best Practices

1. Always use the most specific interface for actions
2. Maintain action dependencies in the correct order
3. Keep action implementations separate from the store definition
4. Use consistent error handling patterns
5. Document complex operations and dependencies
6. Use proper type casting when necessary
7. Match external API property names exactly