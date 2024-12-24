import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from "mobx-state-tree"
import { withSetPropAction } from "../_helpers/withSetPropAction"
import { log } from "@/utils/log"

export const ToolModel = types
  .model("Tool", {
    id: types.identifier,
    name: types.string,
    description: types.string,
    parameters: types.frozen(),
    enabled: types.optional(types.boolean, true),
    lastUsed: types.maybe(types.number),
    metadata: types.optional(types.frozen(), {}),
  })
  .actions(self => ({
    setEnabled(enabled: boolean) {
      self.enabled = enabled
    },
    updateMetadata(metadata: any) {
      self.metadata = { ...self.metadata, ...metadata }
    },
    markUsed() {
      self.lastUsed = Date.now()
    }
  }))

export interface ITool extends Instance<typeof ToolModel> { }

export const ToolStoreModel = types
  .model("ToolStore")
  .props({
    tools: types.array(ToolModel),
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    addTool(tool: {
      id: string
      name: string
      description: string
      parameters: Record<string, unknown>
      enabled?: boolean
      metadata?: any
    }) {
      const existingTool = self.tools.find(t => t.id === tool.id)
      if (existingTool) {
        return existingTool
      }
      
      const newTool = ToolModel.create({
        ...tool,
        enabled: tool.enabled ?? true,
        metadata: tool.metadata ?? {},
      })
      self.tools.push(newTool)
      return newTool
    },

    removeTool(id: string) {
      const idx = self.tools.findIndex(t => t.id === id)
      if (idx >= 0) {
        self.tools.splice(idx, 1)
      }
    },

    enableTool(id: string) {
      const tool = self.tools.find(t => t.id === id)
      if (tool) {
        tool.setEnabled(true)
      }
    },

    disableTool(id: string) {
      const tool = self.tools.find(t => t.id === id)
      if (tool) {
        tool.setEnabled(false)
      }
    },

    setError(error: string | null) {
      self.error = error
    },
  }))
  .views((self) => ({
    get enabledTools() {
      return self.tools.filter(tool => tool.enabled)
    },

    get githubTools() {
      return self.tools.filter(tool => 
        tool.metadata.category === "github" && tool.enabled
      )
    },

    getToolById(id: string) {
      return self.tools.find(t => t.id === id)
    }
  }))

export interface ToolStore extends Instance<typeof ToolStoreModel> { }
export interface ToolStoreSnapshotOut extends SnapshotOut<typeof ToolStoreModel> { }
export interface ToolStoreSnapshotIn extends SnapshotIn<typeof ToolStoreModel> { }

// Add tool actions
import { withToolActions } from "./ToolActions"

export const ToolStoreWithActions = types.compose(
  "ToolStoreWithActions",
  ToolStoreModel,
  types.model({})
    .actions(withToolActions)
)

export const createToolStoreDefaultModel = () =>
  ToolStoreWithActions.create({
    tools: [],
    isInitialized: false,
    error: null,
  })