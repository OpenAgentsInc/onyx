import { WebSocketWrapper } from './wrapper'
import { parseHxmlFragment } from './parser'
import { Element } from 'hyperview'

// Store active WebSocket connections
const connections = new Map<string, WebSocketWrapper>()

const wsConnect = {
  action: 'ws:connect',
  callback: (element: Element) => {
    const NAMESPACE_URI = 'https://openagents.com/hyperview-websocket'
    const wsUrl = element.getAttributeNS(NAMESPACE_URI, 'url')
    const wsProtocols = element.getAttributeNS(NAMESPACE_URI, 'protocols')
    
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
        const target = element.getAttributeNS(NAMESPACE_URI, 'target') ? 
          document.getElementById(element.getAttributeNS(NAMESPACE_URI, 'target')!) :
          element
          
        if (target) {
          const swap = element.getAttributeNS(NAMESPACE_URI, 'swap') || 'replace'
          parseHxmlFragment(data, target, swap as 'replace' | 'append' | 'prepend')
        }
      })
    }
  }
}

const wsSend = {
  action: 'ws:send',
  callback: (element: Element) => {
    const NAMESPACE_URI = 'https://openagents.com/hyperview-websocket'
    const wsMessage = element.getAttributeNS(NAMESPACE_URI, 'message')
    if (!wsMessage) return
    
    // Get connection ID from element
    const connId = element.getAttribute('id') || ''
    const ws = connections.get(connId)
    
    if (ws) {
      ws.send(wsMessage)
    }
  }
}

const wsDisconnect = {
  action: 'ws:disconnect',
  callback: (element: Element) => {
    const connId = element.getAttribute('id') || ''
    const ws = connections.get(connId)
    
    if (ws) {
      ws.close()
      connections.delete(connId)
    }
  }
}

export default [wsConnect, wsSend, wsDisconnect]