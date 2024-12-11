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

  // Initialize database
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

  // Initialize pool when database is ready
  useEffect(() => {
    if (db && ident) {
      console.log("Initializing pool with db and ident")
      const newPool = new NostrPool(ident, db, { skipVerification: true })
      setPool(newPool)
    }
  }, [db, ident])

  // Initialize relays when pool is ready
  useEffect(() => {
    if (!pool || !getRelays || !ident) {
      console.log("Not ready for relay connection:", {
        hasPool: !!pool,
        hasRelays: !!getRelays,
        hasIdent: !!ident
      })
      return
    }

    console.log("Setting up relay connection")
    pool.ident = ident

    const initRelays = async () => {
      try {
        await pool.setRelays(getRelays)
        console.log("Connected to relays:", getRelays)
        setIsConnected(true)
      } catch (error) {
        console.error("Failed to connect to relays:", error)
        setIsConnected(false)
      }
    }

    initRelays()

    return () => {
      console.log("Cleaning up pool connection")
      pool.close()
      setIsConnected(false)
    }
  }, [pool, getRelays, ident])

  // Initialize managers only when pool is ready
  const channelManager = useMemo(() => {
    if (!pool) return null
    console.log("Initializing channel manager")
    return new ChannelManager(pool)
  }, [pool])

  const contactManager = useMemo(() => {
    if (!pool) return null
    console.log("Initializing contact manager")
    return new ContactManager(pool)
  }, [pool])

  const profileManager = useMemo(() => {
    if (!pool) return null
    console.log("Initializing profile manager")
    return new ProfileManager(pool)
  }, [pool])

  const privMessageManager = useMemo(() => {
    if (!pool) return null
    console.log("Initializing private message manager")
    return new PrivateMessageManager(pool)
  }, [pool])

  const dvmManager = useMemo(() => {
    if (!pool) return null
    console.log("Initializing DVM manager")
    return new DVMManager(pool)
  }, [pool])

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

  // Debug logging
  useEffect(() => {
    console.log("RelayProvider state:", {
      isDbReady,
      hasPool: !!pool,
      isConnected,
      hasIdent: !!ident,
      relayCount: getRelays?.length
    })
  }, [isDbReady, pool, isConnected, ident, getRelays])

  if (!isDbReady || !db) {
    console.log("Waiting for database initialization...")
    return null // Or a loading indicator
  }

  return (
    <RelayContext.Provider value={contextValue}>
      {children}
    </RelayContext.Provider>
  )
})