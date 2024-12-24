import { Tool } from "../gemini-api.types"

export const githubTools: Record<string, Tool> = {
  viewFile: {
    name: "view_file",
    description: "View file contents at path",
    parameters: {
      path: {
        type: "string",
        description: "The path of the file to view",
      },
      owner: {
        type: "string",
        description: "The owner of the repository",
      },
      repo: {
        type: "string",
        description: "The name of the repository",
      },
      branch: {
        type: "string",
        description: "The branch to view the file from",
      },
    },
    execute: async (params: Record<string, unknown>) => {
      try {
        // Implementation will be injected by the tool store
        return null
      } catch (error) {
        throw new Error(`Failed to view file: ${error instanceof Error ? error.message : String(error)}`)
      }
    },
  },

  viewHierarchy: {
    name: "view_hierarchy",
    description: "View file/folder hierarchy at path",
    parameters: {
      path: {
        type: "string",
        description: "The path to view the hierarchy",
      },
      owner: {
        type: "string",
        description: "The owner of the repository",
      },
      repo: {
        type: "string",
        description: "The name of the repository",
      },
      branch: {
        type: "string",
        description: "The branch to view the hierarchy from",
      },
    },
    execute: async (params: Record<string, unknown>) => {
      try {
        // Implementation will be injected by the tool store
        return null
      } catch (error) {
        throw new Error(`Failed to view hierarchy: ${error instanceof Error ? error.message : String(error)}`)
      }
    },
  },
}