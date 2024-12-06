export { OnyxMCPClient } from './client/OnyxMCPClient';
export { WebSocketTransport } from './transport/WebSocketTransport';
export { ConnectionManager } from './transport/ConnectionManager';
export { ResourceCache } from './cache/ResourceCache';
export { useMCPClient } from './hooks/useMCPClient';
export { useMCPResource } from './hooks/useMCPResource';

export type { MCPConfig, Resource } from './client/types';
export type { TransportOptions, TransportMessage } from './transport/types';
export type { CacheConfig } from './cache/types';

export { MCPError, ConnectionError, ResourceError } from './client/errors';