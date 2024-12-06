# Onyx DVM Integration Guide

This document outlines the implementation plan for integrating NIP-90 Data Vending Machine functionality into the Onyx mobile app, specifically for text generation capabilities.

## Overview

We will implement a handshake between:
1. Onyx mobile app (Client)
2. Nostr relay (Message broker)
3. Local DVM service (Service Provider)

## Implementation Steps

### 1. Create NIP90Overlay Component

Replace NexusOverlay with NIP90Overlay in OnyxScreen.tsx:

```typescript
// app/components/NIP90Overlay.tsx
import { observer } from "mobx-react-lite"
import { FC, useEffect, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Text } from "@/components"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

export const NIP90Overlay: FC = observer(function NIP90Overlay() {
  const $topInset = useSafeAreaInsetsStyle(["top"])
  const [status, setStatus] = useState("idle")
  
  return (
    <View style={[$overlay, $topInset]}>
      <View style={$statusContainer}>
        <Text style={$statusText}>DVM Status: {status}</Text>
      </View>
    </View>
  )
})

// ... styles from NexusOverlay.tsx
```

### 2. Event Structure

#### Job Request (Client -> Relay)
```json
{
  "kind": 5050,
  "content": "",
  "tags": [
    ["i", "What would you like me to help you with?", "text"],
    ["param", "model", "local-model"],
    ["param", "max_tokens", "512"],
    ["param", "temperature", "0.7"],
    ["output", "text/plain"],
    ["relays", "wss://your-relay.com"]
  ],
  "pubkey": "<client-pubkey>",
  "created_at": 1234567890
}
```

#### Job Result (Service Provider -> Relay)
```json
{
  "kind": 6050,
  "content": "I'm here to help! Feel free to ask me any questions...",
  "tags": [
    ["request", "<stringified-original-request>"],
    ["e", "<job-request-id>", "<relay-url>"],
    ["p", "<client-pubkey>"]
  ],
  "pubkey": "<service-provider-pubkey>",
  "created_at": 1234567890
}
```

### 3. Local DVM Service Setup

1. Create a local service that:
   - Connects to the specified Nostr relay
   - Subscribes to kind:5050 events
   - Runs the local inference model
   - Publishes responses as kind:6050 events

### 4. Integration Flow

1. **Initial Connection**
   - App connects to relay
   - Local service connects to relay
   
2. **Request Flow**
   - User inputs query in app
   - App creates kind:5050 event
   - App publishes event to relay
   
3. **Processing Flow**
   - Local service receives kind:5050 event
   - Validates request parameters
   - Runs inference
   - Creates kind:6050 response
   - Publishes response to relay

4. **Response Flow**
   - App receives kind:6050 event
   - Validates response
   - Displays result to user

### 5. Error Handling

The service provider should send appropriate feedback using kind:7000 events:

```json
{
  "kind": 7000,
  "content": "",
  "tags": [
    ["status", "processing", "Running inference..."],
    ["e", "<job-request-id>", "<relay-url>"],
    ["p", "<client-pubkey>"]
  ]
}
```

Status types to handle:
- `processing`: Model is running
- `error`: Something went wrong
- `success`: Processing complete

## Implementation Notes

1. Start with a basic text-only implementation
2. Add proper error handling and status feedback
3. Implement retry logic for failed requests
4. Add timeout handling
5. Consider adding request queuing if needed

## Security Considerations

1. Validate all incoming events
2. Implement rate limiting
3. Consider adding authentication
4. Sanitize all inputs before processing
5. Validate model outputs before sending

## Next Steps

1. Create NIP90Overlay component
2. Set up local DVM service
3. Implement event handling in app
4. Add error handling
5. Test end-to-end flow
6. Add monitoring and logging