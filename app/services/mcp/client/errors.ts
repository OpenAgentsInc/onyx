export class MCPError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MCPError';
  }
}

export class ConnectionError extends MCPError {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionError';
  }
}

export class ResourceError extends MCPError {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceError';
  }
}

export class ValidationError extends MCPError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}