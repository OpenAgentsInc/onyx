import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { LocalModelService, ModelInfo } from "@/services/local-models/LocalModelService"
import { withSetPropAction } from "./helpers/withSetPropAction"

const ModelInfoModel = types.model("ModelInfo", {
  key: types.string,
  displayName: types.string,
  path: types.maybeNull(types.string),
  status: types.enumeration(["idle", "downloading", "initializing", "ready", "error"]),
  progress: types.number,
  error: types.maybe(types.string),
})

export const LLMStoreModel = types
  .model("LLMStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    models: types.array(ModelInfoModel),
    selectedModelKey: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .actions((self) => {
    const localModelService = new LocalModelService()

    const setError = (message: string | null) => {
      self.error = message
    }

    const initialize = flow(function* () {
      try {
        // Fetch info for all models
        const models: ModelInfo[] = yield localModelService.getLocalModels()
        self.models.replace(models)

        // If we have a ready model, select it
        const readyModel = models.find(m => m.status === "ready")
        if (readyModel) {
          self.selectedModelKey = readyModel.key
        }

        self.isInitialized = true
        setError(null)
      } catch (error) {
        console.error("[LLMStore] Initialization error:", error)
        setError(error instanceof Error ? error.message : "Failed to initialize LLM store")
        throw error
      }
    })

    const startModelDownload = flow(function* (modelKey: string) {
      try {
        // Find model in store
        const modelIndex = self.models.findIndex(m => m.key === modelKey)
        if (modelIndex === -1) {
          throw new Error("Model not found")
        }

        // Update status
        self.models[modelIndex].status = "downloading"
        self.models[modelIndex].error = undefined

        // Start download
        const finalPath = yield localModelService.startDownload(modelKey, (progress) => {
          self.models[modelIndex].progress = progress
        })

        // Update model info
        self.models[modelIndex].path = finalPath
        self.models[modelIndex].status = "ready"
        self.models[modelIndex].progress = 100

        // Select this model if none selected
        if (!self.selectedModelKey) {
          self.selectedModelKey = modelKey
        }

        setError(null)
      } catch (error) {
        console.error("[LLMStore] Download error:", error)
        const modelIndex = self.models.findIndex(m => m.key === modelKey)
        if (modelIndex !== -1) {
          self.models[modelIndex].status = "error"
          self.models[modelIndex].error = error instanceof Error ? error.message : "Download failed"
        }
        setError(error instanceof Error ? error.message : "Failed to download model")
      }
    })

    const cancelModelDownload = flow(function* (modelKey: string) {
      try {
        yield localModelService.cancelDownload()
        
        const modelIndex = self.models.findIndex(m => m.key === modelKey)
        if (modelIndex !== -1) {
          self.models[modelIndex].status = "idle"
          self.models[modelIndex].progress = 0
          self.models[modelIndex].error = undefined
        }
        
        setError(null)
      } catch (error) {
        console.error("[LLMStore] Cancel download error:", error)
        setError(error instanceof Error ? error.message : "Failed to cancel download")
      }
    })

    const deleteModel = flow(function* (modelKey: string) {
      try {
        yield localModelService.deleteModel(modelKey)
        
        const modelIndex = self.models.findIndex(m => m.key === modelKey)
        if (modelIndex !== -1) {
          self.models[modelIndex].status = "idle"
          self.models[modelIndex].path = null
          self.models[modelIndex].progress = 0
          self.models[modelIndex].error = undefined
        }

        // If this was the selected model, clear selection
        if (self.selectedModelKey === modelKey) {
          self.selectedModelKey = null
        }
        
        setError(null)
      } catch (error) {
        console.error("[LLMStore] Delete model error:", error)
        setError(error instanceof Error ? error.message : "Failed to delete model")
      }
    })

    const selectModel = (modelKey: string | null) => {
      self.selectedModelKey = modelKey
    }

    return {
      setError,
      initialize,
      startModelDownload,
      cancelModelDownload,
      deleteModel,
      selectModel,
    }
  })
  .views((store) => ({
    get selectedModel() {
      return store.selectedModelKey 
        ? store.models.find(m => m.key === store.selectedModelKey) ?? null
        : null
    },
    get downloadingModel() {
      return store.models.find(m => m.status === "downloading") ?? null
    },
    get hasReadyModel() {
      return store.models.some(m => m.status === "ready")
    },
  }))

export interface LLMStore extends Instance<typeof LLMStoreModel> { }
export interface LLMStoreSnapshotOut extends SnapshotOut<typeof LLMStoreModel> { }
export interface LLMStoreSnapshotIn extends SnapshotIn<typeof LLMStoreModel> { }

export const createLLMStoreDefaultModel = () =>
  LLMStoreModel.create({
    isInitialized: false,
    error: null,
    models: [],
    selectedModelKey: null,
  })