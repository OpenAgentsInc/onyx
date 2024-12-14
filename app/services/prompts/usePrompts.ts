import { useCallback, useState } from 'react';
import { pylonConfig } from '@/config/websocket';
import { useWebSocket } from '@/services/websocket/useWebSocket';
import { Prompt, PromptResponse } from '@/types/prompts';

export const usePrompts = () => {
  const { state, sendMessage } = useWebSocket(pylonConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listPrompts = useCallback(async (): Promise<Prompt[]> => {
    if (!state.connected) {
      throw new Error('WebSocket is not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage({
        jsonrpc: '2.0',
        method: 'prompts/list',
        params: {}
      });
      return result.prompts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list prompts';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [state.connected, sendMessage]);

  const getPrompt = useCallback(async (name: string, args?: Record<string, string>): Promise<PromptResponse> => {
    if (!state.connected) {
      throw new Error('WebSocket is not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await sendMessage({
        jsonrpc: '2.0',
        method: 'prompts/get',
        params: {
          name,
          arguments: args
        }
      });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get prompt';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [state.connected, sendMessage]);

  return {
    listPrompts,
    getPrompt,
    isLoading,
    error,
    connected: state.connected
  };
};