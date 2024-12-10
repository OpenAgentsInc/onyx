import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import React, { createContext, useEffect, useMemo, useState } from "react"
import {
  ChannelManager, connectDb, NostrDb, NostrIdentity, NostrPool,
  PrivateMessageManager
} from "@/services/nostr"
import { ContactManager } from "@/services/nostr/contacts"
import { ProfileManager } from "@/services/nostr/profile"
import { DVMManager } from "@/services/nostr/dvm"

interface RelayContextType {
  pool: NostrPool | null
  channelManager: ChannelManager | null
  contactManager: ContactManager | null
  profileManager: ProfileManager | null
  privMessageManager: PrivateMessageManager | null
  dvmManager: DVMManager | null
  isConnected: boolean
}

export const RelayContext = createContext<RelayContextType>({
  pool: null,
  channelManager: null,
  contactManager: null,
  profileManager: null,
  privMessageManager: null,
  dvmManager: null,
  isConnected: false
})

const db: NostrDb = connectDb()

export const RelayProvider = observer(function RelayProvider({
  children,
}: {
  children: React.ReactNode
}) {
  if (!db) throw new Error("cannot initialized db")

  const {
    userStore: { getRelays, privkey },
  } = useStores()

  const [isConnected, setIsConnected] = useState(false)

  const ident = useMemo(() => (privkey ? new NostrIdentity(privkey, "", "") : null), [privkey])
  const [pool, _setPool] = useState<NostrPool>(
    () => new NostrPool(ident, db, { skipVerification: true }),
  )
  const channelManager = useMemo(() => new ChannelManager(pool), [pool])
  const contactManager = useMemo(() => new ContactManager(pool), [pool])
  const profileManager = useMemo(() => new ProfileManager(pool), [pool])
  const privMessageManager = useMemo(() => new PrivateMessageManager(pool), [pool])
  const dvmManager = useMemo(() => new DVMManager(pool), [pool])

  useEffect(() => {
    pool.ident = ident

    async function initRelays() {
      await pool.setRelays(getRelays)
      console.log("connected to relays: ", getRelays)
      // Set connected state after relays are initialized
      setIsConnected(true)
    }

    initRelays().catch(console.error)

    return () => {
      pool.close()
      setIsConnected(false)
    }
  }, [ident, getRelays])

  const contextValue = useMemo(() => ({
    pool,
    channelManager,
    contactManager,
    profileManager,
    privMessageManager,
    dvmManager,
    isConnected
  }), [pool, channelManager, contactManager, profileManager, privMessageManager, dvmManager, isConnected])

  return (
    <RelayContext.Provider value={contextValue}>
      {children}
    </RelayContext.Provider>
  )
})