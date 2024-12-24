import { flow, Instance } from "mobx-state-tree"
import { log } from "@/utils/log"
import type { ToolResult } from "../../services/gemini/tools/types"

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
  ): Generator<any, ToolResult<unknown>, any> {
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
      const implementation = tool.metadata.implementation
      if (!implementation) {
        throw new Error(`No implementation found for tool ${toolId}`)
      }

      const result = yield implementation(params)

      // Update tool metadata with result
      tool.updateMetadata({
        lastResult: result,
        lastExecuted: Date.now(),
      })

      return {
        success: true,
        data: result
      }
    } catch (error) {
      log.error("[ToolActions]", error instanceof Error ? error.message : "Unknown error")
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error executing tool"
      }
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
          implementation: async (params: Record<string, unknown>) => {
            const { viewFile } = await import("../../services/gemini/tools/github-impl")
            return viewFile(params as any)
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
          implementation: async (params: Record<string, unknown>) => {
            const { viewHierarchy } = await import("../../services/gemini/tools/github-impl")
            return viewHierarchy(params as any)
          }
        }
      })

      self.isInitialized = true
    } catch (error) {
      log.error("[ToolActions]", error instanceof Error ? error.message : "Unknown error")
      self.setError("Failed to initialize tools")
    }
  })
})