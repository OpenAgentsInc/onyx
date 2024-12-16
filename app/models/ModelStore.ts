import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import type { LlamaContext } from "llama.rn"

const DownloadProgressModel = types.model({
  percentage: types.number,
  received: types.number,
  total: types.number,
})

export const ModelStoreModel = types
  .model("ModelStore")
  .props({
    isDownloading: types.optional(types.boolean, false),
    isInitializing: types.optional(types.boolean, false),
    downloadProgress: types.maybeNull(DownloadProgressModel),
    initProgress: types.maybeNull(types.number),
    error: types.maybeNull(types.string),
  })
  .volatile(() => ({
    _context: null as LlamaContext | null,
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    setContext(context: LlamaContext | null) {
      store._context = context
    },
    setDownloadProgress(progress: { percentage: number; received: number; total: number } | null) {
      store.setProp("downloadProgress", progress)
    },
    setInitProgress(progress: number | null) {
      store.setProp("initProgress", progress)
    },
    setError(error: string | null) {
      store.setProp("error", error)
    },
    setIsDownloading(value: boolean) {
      store.setProp("isDownloading", value)
    },
    setIsInitializing(value: boolean) {
      store.setProp("isInitializing", value)
    },
  }))
  .views((store) => ({
    get context() {
      return store._context
    },
    get isLoading() {
      return store.isDownloading || store.isInitializing
    },
    get statusText() {
      if (store.error) return `Error: ${store.error}`
      if (store.downloadProgress) {
        const { percentage, received, total } = store.downloadProgress
        const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1)
        return `Downloading: ${percentage}% (${mb(received)}MB / ${mb(total)}MB)`
      }
      if (store.initProgress) return `Initializing: ${store.initProgress}%`
      if (store._context) return 'Model loaded'
      return 'Model not loaded'
    },
  }))

export interface ModelStore extends Instance<typeof ModelStoreModel> { }
export interface ModelStoreSnapshot extends SnapshotOut<typeof ModelStoreModel> { }