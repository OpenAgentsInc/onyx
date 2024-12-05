import { useState, useEffect, useCallback } from 'react'
import { WebSocketService } from './WebSocketService'
import { WebSocketConfig, WebSocketMessage, ConnectionState, ResponseMessage } from './types'

export const useWebSocket = (config: WebSocketConfig) => {
  const [state, setState] = useState<ConnectionState>({
    connected: false,
    connecting: false,
  })

  const [messages, setMessages] = useState<ResponseMessage[]>([])
  const [ws] = useState(() => new WebSocketService(config))

  useEffect(() => {
    const handleStateChange = () => {
      setState({
        connected: ws.state.connected,
        connecting: ws.state.connecting,
        error: ws.state.error,
      })
    }

    // Set up response handler
    const unsubscribeResponse = ws.onResponse((message: ResponseMessage) => {
      setMessages(prev => [...prev, message])
    })

    // Connect to WebSocket
    ws.connect()

    return () => {
      unsubscribeResponse()
      ws.disconnect()
    }
  }, [ws])

  const sendMessage = useCallback((query: string, teamId?: string) => {
    if (!state.connected) {
      throw new Error('WebSocket is not connected')
    }
    return ws.sendQuery(query, teamId)
  }, [state.connected, ws])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    state,
    messages,
    sendMessage,
    clearMessages,
  }
}

export default useWebSocket