# MCP Sampling

The Model Context Protocol (MCP) provides a standardized way for servers to request LLM sampling (completions/generations) from language models via clients. This enables servers to leverage AI capabilities while clients maintain control over model access, selection, and permissions—without requiring server API keys.

## Overview

- Servers can request text or image-based interactions
- Clients control model access and selection
- Human-in-the-loop review is recommended for safety
- Flexible model selection via preferences and hints

## Capabilities

Clients supporting sampling must declare the capability during initialization:

```json
{
  "capabilities": {
    "sampling": {}
  }
}
```

## Message Flow

1. Server initiates sampling request
2. Client presents request for human review (recommended)
3. User reviews/approves request
4. Client forwards to model
5. Model generates response
6. Client presents response for review
7. User approves response
8. Client returns approved response

## Message Format

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "What is the capital of France?"
        }
      }
    ],
    "modelPreferences": {
      "hints": [
        {
          "name": "claude-3-sonnet"
        }
      ],
      "intelligencePriority": 0.8,
      "speedPriority": 0.5
    },
    "systemPrompt": "You are a helpful assistant.",
    "maxTokens": 100
  }
}
```

### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "role": "assistant",
    "content": {
      "type": "text", 
      "text": "The capital of France is Paris."
    },
    "model": "claude-3-sonnet-20240307",
    "stopReason": "endTurn"
  }
}
```

## Content Types

Messages can contain:

### Text Content

```json
{
  "type": "text",
  "text": "The message content"
}
```

### Image Content 

```json
{
  "type": "image",
  "data": "base64-encoded-image-data",
  "mimeType": "image/jpeg"
}
```

## Model Selection

Model selection uses a preference system combining:

### Capability Priorities (0-1 scale)

- `costPriority`: Importance of minimizing costs
- `speedPriority`: Importance of low latency
- `intelligencePriority`: Importance of advanced capabilities

### Model Hints

Optional suggestions for specific models/families:

```json
{
  "hints": [
    {"name": "claude-3-sonnet"},  // Prefer Sonnet-class models
    {"name": "claude"}            // Fall back to any Claude model
  ],
  "costPriority": 0.3,           // Cost is less important
  "speedPriority": 0.8,          // Speed is very important
  "intelligencePriority": 0.5    // Moderate capability needs
}
```

- Hints are treated as flexible substrings
- Multiple hints evaluated in preference order
- Clients may map hints to equivalent models
- Final model selection is client's choice

## Security Considerations

1. Implement user approval controls
2. Validate message content
3. Respect model preference hints
4. Implement rate limiting
5. Handle sensitive data appropriately

## Error Handling

Clients should return errors for common failures:

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -1,
    "message": "User rejected sampling request"
  }
}
```