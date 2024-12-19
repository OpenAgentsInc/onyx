import { Event, nip19 } from "nostr-tools"
import React, { useEffect, useState } from "react"
import { View, ViewStyle } from "react-native"
import { useNostr } from "@/services/hooks/useNostr"
import { DVMManager } from "@/services/nostr/dvm"
import { NostrIdentity } from "@/services/nostr/ident"
import { NostrPool } from "@/services/nostr/pool"
import Screen from "./Screen"

interface DVMService {
  id: string
  title: string
  description: string
  pubkey: string
  created_at: number
}

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
  const [services, setServices] = useState<DVMService[]>([])

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
      damusPool.setRelays(['wss://relay.damus.io', 'wss://offchain.pub', 'wss://purplepag.es/', 'wss://relay.snort.social/'])

      // Create DVM manager with the Damus pool
      const manager = new DVMManager(damusPool)
      setDvmManager(manager)

      // Subscribe to services
      const handleService = (event: Event) => {
        console.log(event)
        try {
          const service = manager.parseServiceAnnouncement(event)
          setServices(prev => {
            // Deduplicate by id
            const exists = prev.find(s => s.id === service.id)
            if (exists) return prev
            return [...prev, service]
          })
        } catch (e) {
          console.error('Error parsing service:', e)
        }
      }

      const sub = manager.subscribeToServices(handleService)

      return () => {
        // sub.unsub()
        console.log('closing pool')
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
        services={services}
      />
    </View>
  )
}
