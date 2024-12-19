import React, { useEffect, useState } from "react"
import { View, ViewStyle } from 'react-native'
import { useNostr } from '@/services/hooks/useNostr'
import Screen from "./Screen"
import { DVMManager } from "@/services/nostr/dvm"
import { NostrPool } from "@/services/nostr/pool"
import { NostrIdentity } from "@/services/nostr/ident"
import { nip19 } from 'nostr-tools'

const $container: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'transparent',
}

export default function MarketplaceWrapper() {
  const { npub, isLoading, error, nsec } = useNostr()
  const [dvmManager, setDvmManager] = useState<DVMManager | null>(null)

  useEffect(() => {
    if (!nsec || isLoading) return

    try {
      // Decode the nsec to get the private key
      const { type, data: privateKey } = nip19.decode(nsec)
      if (type !== 'nsec') throw new Error('Invalid nsec')

      // Create NostrIdentity instance
      const identity = new NostrIdentity(privateKey)

      // Initialize a new pool specifically for the Damus relay
      const damusPool = new NostrPool(identity)
      damusPool.setRelays(['wss://relay.damus.io'])
      
      // Create DVM manager with the Damus pool
      const manager = new DVMManager(damusPool)
      setDvmManager(manager)

      return () => {
        damusPool.close()
      }
    } catch (e) {
      console.error('Error initializing DVM manager:', e)
    }
  }, [nsec, isLoading])

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