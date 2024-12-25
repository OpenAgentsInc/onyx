export interface ToolParameter {
  type: string
  description: string
  enum?: string[]
  required?: boolean
}

export interface ToolDefinition {
  name: string
  description: string
  parameters: Record<string, ToolParameter>
  execute: (params: Record<string, unknown>) => Promise<unknown>
}

export interface ToolResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface FileToolResult {
  content: string
  path: string
  sha?: string
  size?: number
  encoding?: string
}

export interface HierarchyToolResult {
  path: string
  type: "file" | "dir"
  name: string
  children?: HierarchyToolResult[]
}