export interface MCPConfig {
  version: string;
  serverUrl?: string;
}

export interface Resource {
  uri: string;
  type: string;
  metadata?: Record<string, any>;
}

export interface CachedResource {
  data: Resource;
  timestamp: number;
}

export interface ListResourcesResult {
  resources: Resource[];
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
    }
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