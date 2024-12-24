import { log } from "@/utils/log"
import type { FileToolResult, HierarchyToolResult, ToolResult } from "./types"

const GITHUB_API_BASE = "https://api.github.com"

/**
 * Fetches file contents from GitHub
 */
export async function viewFile(params: {
  path: string
  owner: string
  repo: string
  branch: string
}): Promise<ToolResult<FileToolResult>> {
  try {
    const { path, owner, repo, branch } = params

    // Validate params
    if (!path || !owner || !repo || !branch) {
      throw new Error("Missing required parameters")
    }

    // Fetch file content
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Onyx-Agent",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()

    // GitHub returns base64 encoded content
    const content = Buffer.from(data.content, "base64").toString()

    return {
      success: true,
      data: {
        content,
        path: data.path,
        sha: data.sha,
        size: data.size,
        encoding: data.encoding,
      },
    }
  } catch (error) {
    log.error("[GitHub Tools]", "viewFile error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error viewing file",
    }
  }
}

/**
 * Fetches directory structure from GitHub
 */
export async function viewHierarchy(params: {
  path: string
  owner: string
  repo: string
  branch: string
}): Promise<ToolResult<HierarchyToolResult[]>> {
  try {
    const { path, owner, repo, branch } = params

    // Validate params
    if (!owner || !repo || !branch) {
      throw new Error("Missing required parameters")
    }

    // Fetch directory contents
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Onyx-Agent",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Convert GitHub response to our hierarchy format
    const hierarchy: HierarchyToolResult[] = Array.isArray(data)
      ? data.map(item => ({
          path: item.path,
          type: item.type === "dir" ? "dir" : "file",
          name: item.name,
        }))
      : [{
          path: data.path,
          type: data.type === "dir" ? "dir" : "file",
          name: data.name,
        }]

    return {
      success: true,
      data: hierarchy,
    }
  } catch (error) {
    log.error("[GitHub Tools]", "viewHierarchy error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error viewing hierarchy",
    }
  }
}