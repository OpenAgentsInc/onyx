import { createContext, useContext, useEffect, useState } from "react"
import { RootStore, RootStoreModel } from "../RootStore"
import { setupRootStore } from "./setupRootStore"

/**
 * Create the initial context
 */
export const RootStoreContext = createContext<RootStore>({} as RootStore)

/**
 * The provider our root component will use to expose the root store
 */
export const RootStoreProvider = RootStoreContext.Provider

/**
 * A hook that screens can use to gain access to our stores:
 *
 * const rootStore = useStores()
 */
export const useStores = () => useContext(RootStoreContext)

/**
 * Used only in the app.tsx file, this hook sets up the RootStore
 * and then rehydrates it.
 */
export const useInitialRootStore = (callback?: () => void | Promise<void>) => {
  const [rehydrated, setRehydrated] = useState(false)

  // Kick off initial async loading actions
  useEffect(() => {
    let rootStore: RootStore
    ;(async () => {
      // set up the RootStore
      rootStore = await setupRootStore()

      // let the app know we've finished rehydrating
      setRehydrated(true)

      // invoke the callback, if provided
      if (callback) await callback()
    })()
  }, [])

  return { rehydrated }
}