# MCP + DVM Integration Guide

This document outlines how Model Context Protocol (MCP) and Data Vending Machines (DVM) can be integrated in Onyx to create a powerful, decentralized AI capabilities platform.

## Overview

### MCP (Model Context Protocol)
- Standardized protocol for LLM tool/data source integration
- Provides TypeScript SDK for React Native
- Handles tool discovery and execution
- Manages context and resource access

### DVM (Data Vending Machines)
- Decentralized AI service marketplace
- Built on Nostr protocol (NIP-90)
- Handles AI processing and payments
- Uses NIP-89 for service discovery

## Architecture

```
Onyx Mobile App
├── MCP Client Layer
│   ├── Tool Discovery (NIP-89)
│   ├── Resource Management
│   └── Context Handling
│
├── DVM Integration Layer
│   ├── Job Request Handler (kind:5050)
│   ├── Response Handler (kind:6050)
│   └── Status Monitor (kind:7000)
│
└── Shared Components
    ├── Payment Processing
    ├── Event Encryption
    └── Error Handling
```

## Implementation Phases

### Phase 1: Foundation
1. Basic MCP Client Setup
```typescript
// app/services/mcp/client.ts
import { MCPClient } from '@modelcontextprotocol/typescript-sdk'

export class OnyxMCPClient {
  private client: MCPClient
  
  constructor() {
    this.client = new MCPClient({
      // Configure with Onyx-specific settings
    })
  }

  async discoverTools() {
    return await this.client.listAvailableTools()
  }

  async executeTool(toolId: string, input: any) {
    return await this.client.executeTool(toolId, input)
  }
}
```

2. DVM Integration
```typescript
// app/services/dvm/client.ts
import { NostrClient } from '@/services/nostr'

export class DVMClient {
  private nostr: NostrClient
  
  async submitJob(jobRequest: any) {
    const event = this.createJobEvent(jobRequest)
    await this.nostr.publish(event)
    return this.waitForResponse(event.id)
  }
}
```

3. Unified Status Management
```typescript
// app/stores/ai-services.ts
import { makeAutoObservable } from 'mobx'

export class AIServicesStore {
  mcpStatus = 'idle'
  dvmStatus = 'idle'
  
  constructor() {
    makeAutoObservable(this)
  }
  
  setMCPStatus(status: string) {
    this.mcpStatus = status
  }
  
  setDVMStatus(status: string) {
    this.dvmStatus = status
  }
}
```

### Phase 2: Enhanced Features

1. Tool-DVM Chaining
```typescript
// app/services/workflow/chain.ts
export class WorkflowChain {
  async execute(steps: WorkflowStep[]) {
    let context = {}
    
    for (const step of steps) {
      if (step.type === 'mcp') {
        context = await this.executeMCPStep(step, context)
      } else if (step.type === 'dvm') {
        context = await this.executeDVMStep(step, context)
      }
    }
    
    return context
  }
}
```

2. Payment Integration
```typescript
// app/services/payments/handler.ts
export class PaymentHandler {
  async handleDVMPayment(amount: number, bolt11?: string) {
    if (bolt11) {
      return await this.payInvoice(bolt11)
    }
    return await this.sendZap(amount)
  }
}
```

3. Encrypted Communications
```typescript
// app/services/encryption/manager.ts
export class EncryptionManager {
  async encryptForDVM(content: any, pubkey: string) {
    // NIP-04 encryption
    return await this.encrypt(content, pubkey)
  }
  
  async encryptForMCP(content: any, toolId: string) {
    // MCP-specific encryption
    return await this.mcpEncrypt(content, toolId)
  }
}
```

### Phase 3: Advanced Features

1. Workflow Orchestration
```typescript
// app/services/workflow/orchestrator.ts
export class WorkflowOrchestrator {
  async executeWorkflow(workflow: Workflow) {
    // Handle complex workflows combining MCP tools and DVM services
    const steps = this.planWorkflow(workflow)
    return await this.executeSteps(steps)
  }
  
  private planWorkflow(workflow: Workflow) {
    // Optimize step execution order
    // Handle parallel execution where possible
    return this.optimizer.plan(workflow)
  }
}
```

2. Caching System
```typescript
// app/services/cache/manager.ts
export class CacheManager {
  async cacheToolResult(toolId: string, input: any, result: any) {
    // Cache MCP tool results
  }
  
  async cacheDVMResult(jobId: string, result: any) {
    // Cache DVM results
  }
}
```

## Example Workflows

### 1. Data Processing Pipeline
```typescript
const workflow = new WorkflowChain([
  {
    type: 'mcp',
    tool: 'data-fetcher',
    input: 'https://api.example.com/data'
  },
  {
    type: 'dvm',
    kind: 5050,
    params: {
      model: 'gpt-4',
      temperature: 0.7
    }
  },
  {
    type: 'mcp',
    tool: 'data-formatter',
    output: 'markdown'
  }
])

const result = await workflow.execute()
```

### 2. AI-Enhanced Tool Usage
```typescript
const enhancedTool = new AIEnhancedTool({
  mcpTool: 'code-analyzer',
  dvmEnhancement: {
    kind: 5050,
    params: {
      model: 'code-llama',
      temperature: 0.1
    }
  }
})

const analysis = await enhancedTool.analyze('code-sample.ts')
```

## Security Considerations

1. **Encryption**
   - Use NIP-04 for DVM communications
   - Implement MCP-specific encryption
   - Secure key management

2. **Authentication**
   - Verify DVM service providers
   - Validate MCP tool authenticity
   - Implement request signing

3. **Data Privacy**
   - Local data processing when possible
   - Encrypted storage
   - User consent management

## Performance Optimization

1. **Caching Strategy**
   - Cache frequently used tool results
   - Cache DVM responses
   - Implement cache invalidation

2. **Request Batching**
   - Batch similar requests
   - Optimize network usage
   - Queue management

3. **Resource Management**
   - Monitor memory usage
   - Implement request throttling
   - Background processing

## Next Steps

1. Implement basic MCP client integration
2. Complete DVM integration
3. Create unified service discovery
4. Implement shared payment handling
5. Add workflow orchestration
6. Develop caching system
7. Add security measures
8. Optimize performance
9. Add monitoring and analytics
10. Create user documentation

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [DVM Specification (NIP-90)](https://github.com/nostr-protocol/nips/blob/vending-machine/90.md)
- [Service Discovery (NIP-89)](https://github.com/nostr-protocol/nips/blob/master/89.md)