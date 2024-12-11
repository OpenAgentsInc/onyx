import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import React, { createContext, useEffect, useMemo, useState } from "react"
import {
  ChannelManager, connectDb, NostrDb, NostrIdentity, NostrPool,
  PrivateMessageManager, nostr
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
    userStore: { getRelays },
    walletStore: { mnemonic, isInitialized }
  } = useStores()

  // State declarations first
  const [db, setDb] = useState<NostrDb | null>(null)
  const [isDbReady, setIsDbReady] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [pool, setPool] = useState<NostrPool | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [nostrKeys, setNostrKeys] = useState<{ privateKey: string } | null>(null)

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

  // Derive Nostr keys when mnemonic is available
  useEffect(() => {
    const deriveKeys = async () => {
      if (!mnemonic) {
        console.log("No mnemonic available for key derivation")
        return
      }

      try {
        console.log("Deriving Nostr keys from mnemonic...")
        const keys = await nostr.deriveNostrKeys(mnemonic)
        setNostrKeys(keys)
        console.log("Nostr keys derived successfully")
      } catch (error) {
        console.error("Failed to derive Nostr keys:", error)
      }
    }

    deriveKeys()
  }, [mnemonic])

  // Create NostrIdentity when keys are available
  const ident = useMemo(() => {
    if (!nostrKeys?.privateKey) {
      console.log("No Nostr keys available for identity")
      return null
    }
    console.log("Creating NostrIdentity with derived keys")
    return new NostrIdentity(nostrKeys.privateKey, "", "")
  }, [nostrKeys])

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
      hasKeys: !!nostrKeys,
      isInitialized,
      hasMnemonic: !!mnemonic,
      relayCount: getRelays?.length
    })
  }, [isDbReady, pool, isConnected, ident, nostrKeys, isInitialized, mnemonic, getRelays])

  if (isInitializing || !isDbReady || !db) {
    console.log("Waiting for initialization...")
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
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