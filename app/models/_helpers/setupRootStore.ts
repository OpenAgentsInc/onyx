import { onSnapshot } from "mobx-state-tree"
import { RootStore, RootStoreModel, RootStoreSnapshotIn } from "../RootStore"
import * as storage from "../../utils/storage"

const ROOT_STATE_STORAGE_KEY = "root"

export async function setupRootStore() {
  let rootStore: RootStore
  let data: RootStoreSnapshotIn

  try {
    // Load the last known state from storage
    data = (await storage.load(ROOT_STATE_STORAGE_KEY)) || {}
    rootStore = RootStoreModel.create(data)
  } catch (error) {
    // If there's any problems loading, then inform the dev what happened
    console.error(error instanceof Error ? error.message : "Unknown error loading root store")
    rootStore = RootStoreModel.create({})
  }

  // Track changes & save to storage
  onSnapshot(rootStore, (snapshot) => storage.save(ROOT_STATE_STORAGE_KEY, snapshot))

  return rootStore
}