export interface MCPConfig {
  version: string;
  serverUrl?: string;
}

export interface Resource {
  uri: string;
  type: string;
  metadata?: Record<string, any>;
  content?: string;
}

export interface CachedResource {
  data: Resource;
  timestamp: number;
}

export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export interface ListResourcesParams extends PaginationParams {
  type?: string;
  query?: string;
}

export interface ListResourcesResult {
  resources: Resource[];
  nextCursor?: string;
  total?: number;
}

export interface ResourceUpdate {
  type: 'created' | 'updated' | 'deleted';
  resource: Resource;
  timestamp: number;
}

export const ListResourcesResultSchema = {
  type: 'object',
  properties: {
    resources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string' },
          type: { type: 'string' },
          metadata: { type: 'object', optional: true }
        },
        required: ['uri', 'type']
      }
    },
    nextCursor: { type: 'string', optional: true },
    total: { type: 'number', optional: true }
  },
  required: ['resources']
};

export const ReadResourceResultSchema = {
  type: 'object',
  properties: {
    uri: { type: 'string' },
    type: { type: 'string' },
    content: { type: 'string' },
    metadata: { type: 'object', optional: true }
  },
  required: ['uri', 'type', 'content']
};

export const ResourceUpdateSchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['created', 'updated', 'deleted'] },
    resource: {
      type: 'object',
      properties: {
        uri: { type: 'string' },
        type: { type: 'string' },
        metadata: { type: 'object', optional: true }
      },
      required: ['uri', 'type']
    },
    timestamp: { type: 'number' }
  },
  required: ['type', 'resource', 'timestamp']
};