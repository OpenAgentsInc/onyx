export interface Tool {
  id: string
  name: string
  description: string
}

export const AVAILABLE_TOOLS: Tool[] = [
  { id: "view_file", name: "View File", description: "View file contents at path" },
  { id: "view_folder", name: "View Folder", description: "View file/folder hierarchy at path" },
  { id: "create_file", name: "Create File", description: "Create a new file at path with content" },
  { id: "rewrite_file", name: "Rewrite File", description: "Rewrite file at path with new content" },
]
