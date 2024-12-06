import { useState, useEffect } from 'react';
import { OnyxMCPClient } from '../client/OnyxMCPClient';
import { MCPConfig } from '../client/types';
import { MCPError } from '../client/errors';

export function useMCPClient(config: MCPConfig) {
  const [client, setClient] = useState<OnyxMCPClient | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const initClient = async () => {
      try {
        setIsConnecting(true);
        const mcpClient = new OnyxMCPClient(config);
        
        if (config.serverUrl) {
          await mcpClient.connect(config.serverUrl);
        }
        
        setClient(mcpClient);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new MCPError('Failed to initialize MCP client'));
        setClient(null);
      } finally {
        setIsConnecting(false);
      }
    };

    initClient();

    return () => {
      if (client) {
        client.disconnect().catch(console.error);
      }
    };
  }, [config]);

  return { 
    client, 
    error, 
    isConnecting,
    status: client?.getConnectionStatus() 
  };
}