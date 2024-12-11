import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import React, { createContext, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import {
  ChannelManager, connectDb, nostr, NostrDb, NostrIdentity, NostrPool,
  PrivateMessageManager
} from "@/services/nostr"
import { ContactManager } from "@/services/nostr/contacts"
import { DVMManager } from "@/services/nostr/dvm"
import { ProfileManager } from "@/services/nostr/profile"

interface RelayContextType {
  pool: NostrPool | null;
  db: NostrDb | null;
  channelManager: ChannelManager | null;
  contactManager: ContactManager | null;
  profileManager: ProfileManager | null;
  privMessageManager: PrivateMessageManager | null;
  dvmManager: DVMManager | null;
  isConnected: boolean;
}

export const RelayContext = createContext<RelayContextType>({
  pool: null,
  db: null,
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
    let mounted = true
    const initDb = async () => {
      try {
        console.log("[DB] Opening database connection...")
        const database = await connectDb()
        if (!mounted) return
        setDb(database)
        setIsDbReady(true)
        console.log("[DB] Database initialized successfully")
      } catch (error) {
        console.error("[DB] Failed to initialize database:", error)
        if (!mounted) return
        setIsDbReady(false)
      }
    }
    initDb()
    return () => {
      mounted = false
    }
  }, [])

  // Derive Nostr keys when mnemonic is available
  useEffect(() => {
    const deriveKeys = async () => {
      if (!mnemonic) {
        console.log("[Nostr] No mnemonic available for key derivation")
        return
      }

      try {
        console.log("[Nostr] Deriving keys from mnemonic...")
        const keys = await nostr.deriveNostrKeys(mnemonic)
        setNostrKeys(keys)
        console.log("[Nostr] Keys derived successfully")
      } catch (error) {
        console.error("[Nostr] Failed to derive keys:", error)
      }
    }

    deriveKeys()
  }, [mnemonic])

  // Create NostrIdentity when keys are available
  const ident = useMemo(() => {
    if (!nostrKeys?.privateKey) {
      console.log("[Nostr] No keys available for identity")
      return null
    }
    console.log("[Nostr] Creating identity with derived keys")
    return new NostrIdentity(nostrKeys.privateKey, "", "")
  }, [nostrKeys])

  // Initialize pool when database and identity are ready
  useEffect(() => {
    if (!db || !ident) {
      console.log("[Pool] Waiting for initialization:", {
        hasDb: !!db,
        hasIdent: !!ident
      })
      return
    }

    console.log("[Pool] Initializing with db and identity")
    const newPool = new NostrPool(ident, db, { skipVerification: true })
    setPool(newPool)
    setIsInitializing(false)
  }, [db, ident])

  // Initialize relays when pool is ready
  useEffect(() => {
    if (!pool || !getRelays || !ident) {
      console.log("[Relay] Waiting for connection:", {
        hasPool: !!pool,
        hasRelays: !!getRelays,
        hasIdent: !!ident
      })
      return
    }

    console.log("[Relay] Setting up connection with relays:", getRelays)
    pool.ident = ident

    const initRelays = async () => {
      try {
        await pool.setRelays(getRelays)
        console.log("[Relay] Connected to relays:", getRelays)
        setIsConnected(true)
      } catch (error) {
        console.error("[Relay] Failed to connect:", error)
        setIsConnected(false)
      }
    }

    initRelays()

    return () => {
      console.log("[Relay] Cleaning up connection")
      pool.close()
      setIsConnected(false)
    }
  }, [pool, getRelays, ident])

  // Initialize managers only when pool is ready
  const channelManager = useMemo(() => {
    if (!pool) return null
    console.log("[Manager] Initializing channel manager")
    return new ChannelManager(pool)
  }, [pool])

  const contactManager = useMemo(() => {
    if (!pool) return null
    console.log("[Manager] Initializing contact manager")
    return new ContactManager(pool)
  }, [pool])

  const profileManager = useMemo(() => {
    if (!pool) return null
    console.log("[Manager] Initializing profile manager")
    return new ProfileManager(pool)
  }, [pool])

  const privMessageManager = useMemo(() => {
    if (!pool) return null
    console.log("[Manager] Initializing private message manager")
    return new PrivateMessageManager(pool)
  }, [pool])

  const dvmManager = useMemo(() => {
    if (!pool) return null
    console.log("[Manager] Initializing DVM manager")
    return new DVMManager(pool)
  }, [pool])

  const contextValue = useMemo(() => ({
    pool,
    db,
    channelManager,
    contactManager,
    profileManager,
    privMessageManager,
    dvmManager,
    isConnected
  }), [pool, db, channelManager, contactManager, profileManager,
    privMessageManager, dvmManager, isConnected])

  // Debug logging
  useEffect(() => {
    console.log("[Provider] State:", {
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

  // if (!isInitialized) {
  //   console.log("[Provider] Waiting for wallet initialization...")
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
  //       <ActivityIndicator size="large" color="#ffffff" />
  //     </View>
  //   )
  // }

  // if (isInitializing || !isDbReady || !db) {
  //   console.log("[Provider] Waiting for database initialization...")
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
  //       <ActivityIndicator size="large" color="#ffffff" />
  //     </View>
  //   )
  // }

  return (
    <RelayContext.Provider value={contextValue}>
      {children}
    </RelayContext.Provider>
  )
})
