import { makeAutoObservable } from "mobx";
import { ToolService } from "../tools";
import { ChatMessage } from "./LlamaTypes";

const TOOL_SYSTEM_PROMPT = `You are a helpful AI assistant with access to the following tools:

list_directory: List contents of a directory
Input schema: {
  "type": "object",
  "properties": {
    "path": {
      "type": "string",
      "description": "Directory path to list (relative to workspace root)"
    }
  },
  "required": ["path"]
}

read_file: Read contents of a file
Input schema: {
  "type": "object",
  "properties": {
    "path": {
      "type": "string",
      "description": "File path to read (relative to workspace root)"
    }
  },
  "required": ["path"]
}

To use a tool, include a tool call in your response like this:
<tool>
{
  "name": "tool_name",
  "arguments": {
    "param1": "value1"
  }
}
</tool>

Guidelines for tool use:
1. Use list_directory when asked about folder contents or to explore directories
2. Use read_file when asked about file contents or to analyze files
3. Always use relative paths starting from the workspace root
4. Handle errors gracefully and explain them to the user
5. After using a tool, explain the results in a natural way

Remember:
- You can use tools multiple times in one response
- Always format tool calls exactly as shown
- Wait for each tool's response before proceeding
- If a tool returns an error, explain it to the user and suggest alternatives`;

export class LlamaToolChat {
  private toolService: ToolService;
  private messages: ChatMessage[] = [];

  constructor(toolService: ToolService) {
    this.toolService = toolService;
    makeAutoObservable(this);
    this.initializeChat();
  }

  private initializeChat() {
    // Add system prompt
    this.messages.push({
      role: "system",
      content: TOOL_SYSTEM_PROMPT
    });
  }

  // Parse model output for tool calls
  private async handleToolCalls(text: string): Promise<string> {
    const toolRegex = /<tool>([\s\S]*?)<\/tool>/g;
    let result = text;
    let match;

    while ((match = toolRegex.exec(text)) !== null) {
      try {
        // Parse tool call
        const toolCall = JSON.parse(match[1]);
        
        // Execute tool
        const toolResult = await this.toolService.executeTool(
          toolCall.name,
          toolCall.arguments
        );

        // Replace tool call with result
        const resultText = toolResult.content
          .map(c => c.type === "text" ? c.text : "[Non-text content]")
          .join("\\n");

        result = result.replace(match[0], resultText);

      } catch (error) {
        // Replace tool call with error
        result = result.replace(
          match[0],
          `Error executing tool: ${error.message}`
        );
      }
    }

    return result;
  }

  // Process a message through the chat
  async processMessage(message: ChatMessage): Promise<ChatMessage> {
    // Add user message to history
    this.messages.push(message);

    // Get model response
    // Note: This will be implemented when we integrate with LlamaContext
    const modelResponse = await this.getModelResponse();

    // Process any tool calls in the response
    const processedResponse = await this.handleToolCalls(modelResponse);

    // Create assistant message
    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: processedResponse
    };

    // Add to history
    this.messages.push(assistantMessage);

    return assistantMessage;
  }

  // Placeholder for model response
  // This will be replaced with actual Llama integration
  private async getModelResponse(): Promise<string> {
    throw new Error("Not implemented - needs Llama integration");
  }

  // Get chat history
  getMessages(): ChatMessage[] {
    return this.messages;
  }

  // Clear chat history but keep system prompt
  clearChat() {
    this.messages = this.messages.slice(0, 1); // Keep system prompt
  }
}