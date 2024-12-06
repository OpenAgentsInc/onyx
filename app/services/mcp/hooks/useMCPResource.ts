import { useState, useEffect } from 'react';
import { useMCPClient } from './useMCPClient';
import { Resource } from '../client/types';
import { MCPError } from '../client/errors';

export function useMCPResource(uri: string) {
  const { client, error: clientError } = useMCPClient();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!client || clientError) {
      setError(clientError || new MCPError('MCP client not initialized'));
      setLoading(false);
      return;
    }

    const fetchResource = async () => {
      try {
        setLoading(true);
        const data = await client.readResource(uri);
        setResource(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new MCPError('Failed to fetch resource'));
        setResource(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [uri, client, clientError]);

  const refresh = async () => {
    if (!client) {
      setError(new MCPError('MCP client not initialized'));
      return;
    }

    try {
      setLoading(true);
      const data = await client.readResource(uri);
      setResource(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new MCPError('Failed to refresh resource'));
    } finally {
      setLoading(false);
    }
  };

  return { 
    resource, 
    loading, 
    error,
    refresh 
  };
}