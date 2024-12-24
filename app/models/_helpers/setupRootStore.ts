import { applySnapshot, IDisposer, onSnapshot } from "mobx-state-tree"
import { log } from "@/utils/log"
import * as storage from "../../utils/storage"
import { RootStore, RootStoreSnapshotIn } from "../RootStore"

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = "root-v1aaaf34567"

/**
 * Setup the root state.
 */
export async function setupRootStore(rootStore: RootStore) {
  let restoredState: RootStoreSnapshotIn | undefined | null

  try {
    // load the last known state from AsyncStorage
    restoredState = ((await storage.load(ROOT_STATE_STORAGE_KEY)) ?? {}) as RootStoreSnapshotIn
    applySnapshot(rootStore, restoredState)
  } catch (e) {
    // if there's any problems loading, then inform the dev what happened
    if (__DEV__) {
      console.error(e instanceof Error ? e.message : "Error loading root store")
    }
  }

  // Initialize tools immediately after restoring state
  try {
    log({
      name: "[setupRootStore] Initializing tools",
      preview: "Starting tool initialization",
      value: { isInitialized: rootStore.toolStore.isInitialized },
      important: true,
    })

    // Force initialize tools regardless of isInitialized state
    await rootStore.toolStore.initializeDefaultTools()

    log({
      name: "[setupRootStore] Tools initialized",
      preview: "Tool initialization complete",
      value: {
        tools: rootStore.toolStore.tools.map(t => t.id),
        isInitialized: rootStore.toolStore.isInitialized
      },
      important: true,
    })
  } catch (e) {
    log.error("[setupRootStore] Failed to initialize tools:", e)
  }

  // track changes & save to AsyncStorage
  const unsubscribe = onSnapshot(rootStore, (snapshot) => storage.save(ROOT_STATE_STORAGE_KEY, snapshot))

  return { rootStore, restoredState, unsubscribe }
}
