import React, { createContext, useContext } from 'react'
import { useLlamaVercelChat } from '@/hooks/useLlamaVercelChat'

type LlamaContextType = ReturnType<typeof useLlamaVercelChat>

const LlamaContext = createContext<LlamaContextType | null>(null)

export function LlamaProvider({ children }: { children: React.ReactNode }) {
  const llamaChat = useLlamaVercelChat()
  
  return (
    <LlamaContext.Provider value={llamaChat}>
      {children}
    </LlamaContext.Provider>
  )
}

export function useLlamaContext() {
  const context = useContext(LlamaContext)
  if (!context) {
    throw new Error('useLlamaContext must be used within a LlamaProvider')
  }
  return context
}