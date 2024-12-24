import { Tool } from "../gemini-api.types"
import { viewFile, viewHierarchy } from "./github-impl"

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
    execute: viewFile,
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
    execute: viewHierarchy,
  },
}