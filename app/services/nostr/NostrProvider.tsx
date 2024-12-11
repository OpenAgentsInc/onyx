import React, { createContext, useContext, useEffect, useState } from 'react'
import { NostrPool } from './pool'
import { NostrEvent } from './ident'

interface NostrContextType {
  pool: NostrPool | null
  events: NostrEvent[]
  addEvent: (event: NostrEvent) => void
}

const NostrContext = createContext<NostrContextType>({
  pool: null,
  events: [],
  addEvent: () => {},
})

export const useNostr = () => useContext(NostrContext)

interface NostrProviderProps {
  children: React.ReactNode
  pool: NostrPool
}

export const NostrProvider: React.FC<NostrProviderProps> = ({ children, pool }) => {
  const [events, setEvents] = useState<NostrEvent[]>([])

  const addEvent = (event: NostrEvent) => {
    setEvents((prev) => {
      // Check if event already exists
      if (prev.some((e) => e.id === event.id)) {
        return prev
      }
      return [...prev, event]
    })
  }

  useEffect(() => {
    // Add event callback to pool
    pool.addEventCallback(addEvent)

    return () => {
      // Cleanup
      pool.stop()
    }
  }, [pool])

  return (
    <NostrContext.Provider value={{ pool, events, addEvent }}>
      {children}
    </NostrContext.Provider>
  )
}