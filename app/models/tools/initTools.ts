import { RootStore } from "../RootStore"
import { viewFile, viewHierarchy } from "../../services/gemini/tools/github-impl"

export async function initializeTools(rootStore: RootStore) {
  const { toolStore } = rootStore

  // Add GitHub tools
  toolStore.addTool({
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
      implementation: viewFile
    }
  })

  toolStore.addTool({
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
      implementation: viewHierarchy
    }
  })

  toolStore.isInitialized = true
}