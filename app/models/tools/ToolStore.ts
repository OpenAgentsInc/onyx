import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
  flow,
} from "mobx-state-tree"
import { withSetPropAction } from "../_helpers/withSetPropAction"
import { log } from "@/utils/log"
import { viewFile, viewHierarchy } from "../../services/gemini/tools/github-impl"
import { githubTools } from "../../services/gemini/tools/github"

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
  .volatile(self => ({
    implementation: undefined as ((...args: any[]) => Promise<any>) | undefined,
  }))
  .actions(self => ({
    setEnabled(enabled: boolean) {
      self.enabled = enabled
    },
    updateMetadata(metadata: any) {
      self.metadata = { ...self.metadata, ...metadata }
    },
    markUsed() {
      self.lastUsed = Date.now()
    },
    setImplementation(implementation: (...args: any[]) => Promise<any>) {
      self.implementation = implementation
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
  .actions((self) => {
    // Define base actions first
    const baseActions = {
      setError(error: string | null) {
        self.error = error
      },

      addTool(tool: {
        id: string
        name: string
        description: string
        parameters: Record<string, unknown>
        enabled?: boolean
        metadata?: any
        implementation?: (...args: any[]) => Promise<any>
      }) {
        const existingTool = self.tools.find(t => t.id === tool.id)
        if (existingTool) {
          if (tool.implementation) {
            existingTool.setImplementation(tool.implementation)
          }
          return existingTool
        }
        
        const newTool = ToolModel.create({
          ...tool,
          enabled: tool.enabled ?? true,
          metadata: {
            ...tool.metadata,
          },
        })

        if (tool.implementation) {
          newTool.setImplementation(tool.implementation)
        }

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
    }

    // Then define actions that depend on base actions
    const flowActions = {
      initializeDefaultTools: flow(function* () {
        try {
          log({
            name: "[ToolStore] initializeDefaultTools",
            preview: "Initializing tools",
            value: { currentTools: self.tools.map(t => t.id) },
            important: true,
          })

          // Add GitHub tools with implementations
          const viewFileTool = baseActions.addTool({
            id: "github_view_file",
            name: "view_file",
            description: githubTools.viewFile.description,
            parameters: githubTools.viewFile.parameters.properties,
            metadata: {
              category: "github",
            },
            implementation: viewFile,
          })

          log({
            name: "[ToolStore] Tool added",
            preview: "Added view_file tool",
            value: { 
              id: viewFileTool.id,
              hasImplementation: !!viewFileTool.implementation
            },
            important: true,
          })

          const viewHierarchyTool = baseActions.addTool({
            id: "github_view_hierarchy",
            name: "view_hierarchy",
            description: githubTools.viewHierarchy.description,
            parameters: githubTools.viewHierarchy.parameters.properties,
            metadata: {
              category: "github",
            },
            implementation: viewHierarchy,
          })

          log({
            name: "[ToolStore] Tool added",
            preview: "Added view_hierarchy tool",
            value: { 
              id: viewHierarchyTool.id,
              hasImplementation: !!viewHierarchyTool.implementation
            },
            important: true,
          })

          self.isInitialized = true

          log({
            name: "[ToolStore] initializeDefaultTools",
            preview: "Tools initialized",
            value: { 
              tools: self.tools.map(t => ({
                id: t.id,
                name: t.name,
                hasImplementation: !!t.implementation
              }))
            },
            important: true,
          })
        } catch (error) {
          log.error("[ToolStore]", error instanceof Error ? error.message : "Unknown error")
          baseActions.setError("Failed to initialize tools")
        }
      })
    }

    // Return all actions
    return {
      ...baseActions,
      ...flowActions,
    }
  })
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
      const tool = self.tools.find(t => t.id === id)
      log({
        name: "[ToolStore] getToolById",
        preview: `Getting tool ${id}`,
        value: { 
          id, 
          found: !!tool,
          hasImplementation: tool ? !!tool.implementation : false,
          tools: self.tools.map(t => ({
            id: t.id,
            hasImplementation: !!t.implementation
          }))
        },
        important: true,
      })
      return tool
    }
  }))

export interface ToolStore extends Instance<typeof ToolStoreModel> { }
export interface ToolStoreSnapshotOut extends SnapshotOut<typeof ToolStoreModel> { }
export interface ToolStoreSnapshotIn extends SnapshotIn<typeof ToolStoreModel> { }

export const createToolStoreDefaultModel = () =>
  ToolStoreModel.create({
    tools: [],
    isInitialized: false,
    error: null,
  })