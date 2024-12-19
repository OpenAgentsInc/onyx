import React, { useEffect, useState } from "react"
import Screen from "./Screen"
import { useNostrContext } from "@/services/nostr/NostrContext"
import { DVMManager } from "@/services/nostr/dvm"
import { NostrPool } from "@/services/nostr/pool"

export default function MarketplaceWrapper() {
  const { npub, isLoading, error, pool } = useNostrContext()
  const [dvmManager, setDvmManager] = useState<DVMManager | null>(null)

  useEffect(() => {
    if (!pool) return

    // Initialize a new pool specifically for the Damus relay
    const damusPool = new NostrPool(pool.ident)
    damusPool.setRelays(['wss://relay.damus.io'])
    
    // Create DVM manager with the Damus pool
    const manager = new DVMManager(damusPool)
    setDvmManager(manager)

    return () => {
      damusPool.close()
    }
  }, [pool])

  return (
    <Screen
      npub={npub}
      isLoading={isLoading}
      error={error}
      dvmManager={dvmManager}
    />
  )
}