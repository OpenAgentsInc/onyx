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
import { ActivityIndicator, View } from "react-native"

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
    userStore: { getRelays, privkey, isLoggedIn },
  } = useStores()

  // State declarations first
  const [db, setDb] = useState<NostrDb | null>(null)
  const [isDbReady, setIsDbReady] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [pool, setPool] = useState<NostrPool | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize database
  useEffect(() => {
    const initDb = async () => {
      try {
        console.log("Initializing database...")
        const database = await connectDb()
        setDb(database)
        setIsDbReady(true)
        console.log("Database initialized successfully")
      } catch (error) {
        console.error("Failed to initialize database:", error)
      }
    }
    initDb()
  }, [])

  // Create NostrIdentity when privkey is available
  const ident = useMemo(() => {
    if (!privkey) {
      console.log("No private key available")
      return null
    }
    console.log("Creating NostrIdentity with private key")
    return new NostrIdentity(privkey, "", "")
  }, [privkey])

  // Initialize pool when database and identity are ready
  useEffect(() => {
    if (!db || !ident) {
      console.log("Pool initialization waiting for:", {
        hasDb: !!db,
        hasIdent: !!ident
      })
      return
    }

    console.log("Initializing pool with db and ident")
    const newPool = new NostrPool(ident, db, { skipVerification: true })
    setPool(newPool)
    setIsInitializing(false)
  }, [db, ident])

  // Initialize relays when pool is ready
  useEffect(() => {
    if (!pool || !getRelays || !ident) {
      console.log("Relay connection waiting for:", {
        hasPool: !!pool,
        hasRelays: !!getRelays,
        hasIdent: !!ident
      })
      return
    }

    console.log("Setting up relay connection with relays:", getRelays)
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
      isLoggedIn,
      relayCount: getRelays?.length
    })
  }, [isDbReady, pool, isConnected, ident, isLoggedIn, getRelays])

  if (isInitializing || !isDbReady || !db) {
    console.log("Waiting for initialization...")
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    )
  }

  return (
    <RelayContext.Provider value={contextValue}>
      {children}
    </RelayContext.Provider>
  )
})