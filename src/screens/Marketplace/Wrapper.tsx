import React, { useEffect, useState } from "react"
import { View, ViewStyle } from 'react-native'
import { useNostr } from '@/services/hooks/useNostr'
import Screen from "./Screen"
import { DVMManager } from "@/services/nostr/dvm"
import { NostrPool } from "@/services/nostr/pool"
import { NostrIdentity } from "@/services/nostr/ident"

const $container: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'transparent',
}

export default function MarketplaceWrapper() {
  const { npub, isLoading, error, privateKey, publicKey } = useNostr()
  const [dvmManager, setDvmManager] = useState<DVMManager | null>(null)

  useEffect(() => {
    if (!privateKey || !publicKey) return

    // Create NostrIdentity instance
    const identity = new NostrIdentity({
      privateKey,
      publicKey
    })

    // Initialize a new pool specifically for the Damus relay
    const damusPool = new NostrPool(identity)
    damusPool.setRelays(['wss://relay.damus.io'])
    
    // Create DVM manager with the Damus pool
    const manager = new DVMManager(damusPool)
    setDvmManager(manager)

    return () => {
      damusPool.close()
    }
  }, [privateKey, publicKey])

  return (
    <View style={$container}>
      <Screen
        npub={npub}
        isLoading={isLoading}
        error={error}
        dvmManager={dvmManager}
      />
    </View>
  )
}