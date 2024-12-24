import { flow, Instance } from "mobx-state-tree"
import { log } from "@/utils/log"

/**
 * Tool actions for managing tool execution and state
 */
export const withToolActions = (self: Instance<any>) => ({
  /**
   * Executes a tool and handles the result
   */
  executeTool: flow(function* (
    toolId: string,
    params: Record<string, unknown>
  ) {
    try {
      const tool = self.getToolById(toolId)
      if (!tool) {
        throw new Error(`Tool ${toolId} not found`)
      }

      if (!tool.enabled) {
        throw new Error(`Tool ${toolId} is disabled`)
      }

      // Mark tool as used
      tool.markUsed()

      // Execute tool implementation
      const result = yield tool.metadata.implementation(params)

      // Update tool metadata with result
      tool.updateMetadata({
        lastResult: result,
        lastExecuted: Date.now(),
      })

      return result
    } catch (error) {
      if (__DEV__) {
        log.error("[ToolActions]", `Error executing tool ${toolId}: ${error}`)
      }
      self.setError(`Failed to execute tool ${toolId}`)
      throw error
    }
  }),

  /**
   * Initializes default tools
   */
  initializeDefaultTools: flow(function* () {
    try {
      // Add GitHub tools
      self.addTool({
        id: "github_view_file",
        name: "view_file",
        description: "View file contents at path",
        parameters: {
          path: "string",
          owner: "string",
          repo: "string",
          branch: "string"
        },
        metadata: {
          category: "github",
          implementation: async (params: any) => {
            // Implementation will be injected
            return null
          }
        }
      })

      self.addTool({
        id: "github_view_hierarchy",
        name: "view_hierarchy", 
        description: "View file/folder hierarchy at path",
        parameters: {
          path: "string",
          owner: "string", 
          repo: "string",
          branch: "string"
        },
        metadata: {
          category: "github",
          implementation: async (params: any) => {
            // Implementation will be injected
            return null
          }
        }
      })

      self.isInitialized = true
    } catch (error) {
      if (__DEV__) {
        log.error("[ToolActions]", `Error initializing tools: ${error}`)
      }
      self.setError("Failed to initialize tools")
    }
  })
})