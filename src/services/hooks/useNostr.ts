import { useEffect, useState } from "react"
import { useInitStore } from "@/store/useInitStore"
import { NostrKeys } from "../nostr/nostr.types"
import { nostrService } from "../nostr/nostrService"

export function useNostr() {
  const [keys, setKeys] = useState<NostrKeys | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isInitialized = useInitStore(state => state.isInitialized)

  useEffect(() => {
    let mounted = true
    console.log('useNostr: Effect running, isInitialized:', isInitialized)

    const loadKeys = async () => {
      // Don't try to load keys until services are initialized
      if (!isInitialized) {
        console.log('useNostr: Services not initialized yet')
        if (mounted) {
          setIsLoading(true)
          setError(null)
        }
        return
      }

      console.log('useNostr: Attempting to load Nostr keys...')
      try {
        const nostrKeys = await nostrService.getKeys()
        console.log('useNostr: Successfully loaded keys')
        if (mounted) {
          setKeys(nostrKeys)
          setError(null)
        }
      } catch (err) {
        console.log('useNostr: Error loading keys:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load Nostr keys')
          setKeys(null)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadKeys()

    return () => {
      mounted = false
    }
  }, [isInitialized]) // Re-run when initialization state changes

  return {
    npub: keys?.npub || null,
    publicKey: keys?.publicKey || null,
    privateKey: keys?.privateKey || null,
    nsec: keys?.nsec || null,
    isLoading: isLoading || !isInitialized, // Consider loading while not initialized
    error
  }
}
