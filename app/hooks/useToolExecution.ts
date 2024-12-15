import { useCallback } from 'react';
import { ToolService } from '@/services/tools';
import { ChatMessage } from '@/services/llama/LlamaTypes';

export const useToolExecution = (toolService: ToolService) => {
  // Process text for tool calls and execute them
  const processToolCalls = useCallback(async (text: string): Promise<string> => {
    const toolRegex = /<tool>([\s\S]*?)<\/tool>/g;
    let result = text;
    let match;

    while ((match = toolRegex.exec(text)) !== null) {
      try {
        // Parse tool call
        const toolCall = JSON.parse(match[1]);
        
        // Execute tool
        const toolResult = await toolService.executeTool(
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
  }, [toolService]);

  // Process a message and handle any tool calls
  const processMessage = useCallback(async (
    message: ChatMessage,
    addMessage: (msg: ChatMessage) => void
  ): Promise<ChatMessage> => {
    if (message.type !== 'text') return message;

    try {
      // Process any tool calls in the text
      const processedText = await processToolCalls(message.text);

      // Return updated message
      return {
        ...message,
        text: processedText
      };
    } catch (error) {
      // Add error message
      addMessage({
        author: { id: 'system' },
        createdAt: Date.now(),
        id: Math.random().toString(),
        text: `Error processing tools: ${error.message}`,
        type: 'text',
        metadata: { system: true }
      });

      return message;
    }
  }, [processToolCalls]);

  return {
    processMessage,
    processToolCalls
  };
};