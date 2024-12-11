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

export const RelayProvider = observer(function RelayProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    userStore: { getRelays, privkey },
  } = useStores()

  // State declarations first
  const [db, setDb] = useState<NostrDb | null>(null)
  const [isDbReady, setIsDbReady] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [pool, setPool] = useState<NostrPool | null>(null)

  // Memoized values
  const ident = useMemo(() => 
    privkey ? new NostrIdentity(privkey, "", "") : null
  , [privkey])

  const channelManager = useMemo(() => 
    pool ? new ChannelManager(pool) : null
  , [pool])

  const contactManager = useMemo(() => 
    pool ? new ContactManager(pool) : null
  , [pool])

  const profileManager = useMemo(() => 
    pool ? new ProfileManager(pool) : null
  , [pool])

  const privMessageManager = useMemo(() => 
    pool ? new PrivateMessageManager(pool) : null
  , [pool])

  const dvmManager = useMemo(() => 
    pool ? new DVMManager(pool) : null
  , [pool])

  const contextValue = useMemo(() => ({
    pool,
    channelManager,
    contactManager,
    profileManager,
    privMessageManager,
    dvmManager,
    isConnected
  }), [pool, channelManager, contactManager, profileManager, 
      privMessageManager, dvmManager, isConnected])

  // Effects
  useEffect(() => {
    const initDb = async () => {
      try {
        const database = await connectDb()
        setDb(database)
        setIsDbReady(true)
      } catch (error) {
        console.error("Failed to initialize database:", error)
      }
    }
    initDb()
  }, [])

  useEffect(() => {
    if (db && ident && !pool) {
      const newPool = new NostrPool(ident, db, { skipVerification: true })
      setPool(newPool)
    }
  }, [db, ident])

  useEffect(() => {
    if (!pool) return

    pool.ident = ident

    async function initRelays() {
      await pool.setRelays(getRelays)
      console.log("connected to relays: ", getRelays)
      setIsConnected(true)
    }

    initRelays().catch(console.error)

    return () => {
      pool.close()
      setIsConnected(false)
    }
  }, [pool, ident, getRelays])

  if (!isDbReady || !db) {
    return null // Or a loading indicator
  }

  return (
    <RelayContext.Provider value={contextValue}>
      {children}
    </RelayContext.Provider>
  )
})