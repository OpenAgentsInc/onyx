'use dom'

import { useEffect } from 'react'
import { useInitStore } from '../store/useInitStore'

interface InitializationGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function InitializationGuard({ 
  children,
  fallback = <div>Initializing Onyx...</div>
}: InitializationGuardProps) {
  const { initialize, isInitialized, isInitializing, errorMessage } = useInitStore()

  useEffect(() => {
    initialize().catch(console.error)
  }, [initialize])

  if (errorMessage) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        color: '#fff',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <h2>Initialization Error</h2>
          <p>{errorMessage}</p>
          <button 
            onClick={() => initialize()}
            style={{
              padding: '10px 20px',
              marginTop: '20px',
              backgroundColor: '#333',
              border: '1px solid #666',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (isInitializing || !isInitialized) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000'
      }}>
        {fallback}
      </div>
    )
  }

  return children
}