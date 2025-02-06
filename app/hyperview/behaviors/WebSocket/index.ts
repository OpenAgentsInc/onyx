import { WebSocketWrapper } from './wrapper'
import { parseHxmlFragment } from './parser'
import { BehaviorOptions } from 'hyperview'

type WebSocketBehaviorOptions = BehaviorOptions & {
  wsUrl?: string
  wsProtocols?: string
  wsMessage?: string
  wsTarget?: string
  wsSwap?: 'replace' | 'append' | 'prepend'
}

// Store active WebSocket connections
const connections = new Map<string, WebSocketWrapper>()

export default {
  'ws:connect': async (options: WebSocketBehaviorOptions) => {
    const { wsUrl, wsProtocols, element } = options
    if (!wsUrl) return

    // Create unique connection ID for the element
    const connId = element.getAttribute('id') || Math.random().toString(36)
    
    // Create new WebSocket wrapper if doesn't exist
    if (!connections.has(connId)) {
      const ws = new WebSocketWrapper(wsUrl, wsProtocols?.split(','))
      connections.set(connId, ws)
      
      // Set up event handlers
      ws.on('open', () => {
        const event = new CustomEvent('ws:open')
        element.dispatchEvent(event)
      })
      
      ws.on('close', () => {
        const event = new CustomEvent('ws:close')
        element.dispatchEvent(event)
      })
      
      ws.on('message', (data) => {
        // Parse HXML fragment and update target element
        const target = options.wsTarget ? 
          document.getElementById(options.wsTarget) :
          element
          
        if (target) {
          const swap = options.wsSwap || 'replace'
          parseHxmlFragment(data, target, swap)
        }
      })
    }
  },

  'ws:send': async (options: WebSocketBehaviorOptions) => {
    const { element, wsMessage } = options
    if (!wsMessage) return
    
    // Get connection ID from element
    const connId = element.getAttribute('id') || ''
    const ws = connections.get(connId)
    
    if (ws) {
      ws.send(wsMessage)
    }
  },

  'ws:disconnect': async (options: WebSocketBehaviorOptions) => {
    const { element } = options
    const connId = element.getAttribute('id') || ''
    const ws = connections.get(connId)
    
    if (ws) {
      ws.close()
      connections.delete(connId)
    }
  }
}