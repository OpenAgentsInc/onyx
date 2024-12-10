import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import React, { createContext, useEffect, useMemo, useState } from "react"
import {
  ChannelManager, connectDb, NostrDb, NostrIdentity, NostrPool,
  PrivateMessageManager
} from "@/services/nostr"
import { ContactManager } from "@/services/nostr/contacts"
import { ProfileManager } from "@/services/nostr/profile"

export const RelayContext = createContext({
  pool: null as unknown as NostrPool,
  channelManager: null as unknown as ChannelManager,
  contactManager: null as unknown as ContactManager,
  profileManager: null as unknown as ProfileManager,
  privMessageManager: null as unknown as PrivateMessageManager,
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

  const ident = useMemo(() => (privkey ? new NostrIdentity(privkey, "", "") : null), [privkey])
  const [pool, _setPool] = useState<NostrPool>(
    () => new NostrPool(ident, db, { skipVerification: true }),
  )
  const channelManager = useMemo(() => new ChannelManager(pool), [pool])
  const contactManager = useMemo(() => new ContactManager(pool), [pool])
  const profileManager = useMemo(() => new ProfileManager(pool), [pool])
  const privMessageManager = useMemo(() => new PrivateMessageManager(pool), [pool])

  useEffect(() => {
    pool.ident = ident

    async function initRelays() {
      await pool.setRelays(getRelays)
      console.log("connected to relays: ", getRelays)
    }

    initRelays().catch(console.error)

    return () => {
      pool.close()
    }
  }, [ident, getRelays])

  return (
    <RelayContext.Provider
      value={{ pool, channelManager, contactManager, profileManager, privMessageManager }}
    >
      {children}
    </RelayContext.Provider>
  )
})
