import { ModelDownloader } from "../ModelDownloader"
import { ModelManager } from "../ModelManager"
import { useCallback } from "react"
import type { LlamaContext } from 'llama.rn'

export type DownloadProgress = {
  percentage: number
  received: number
  total: number
}

// Simple throttle function
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean
  let lastResult: any
  return (...args: any[]) => {
    if (!inThrottle) {
      inThrottle = true
      lastResult = func(...args)
      setTimeout(() => (inThrottle = false), limit)
    }
    return lastResult
  }
}

export function useModelDownload() {
  const downloader = new ModelDownloader()
  const manager = new ModelManager()

  const downloadAndInitModel = async (
    repoId: string,
    filename: string,
    onDownloadProgress?: (progress: DownloadProgress) => void,
    onInitProgress?: (progress: number) => void
  ): Promise<LlamaContext> => {
    try {
      // Create throttled progress handler
      const throttledProgress = useCallback(
        throttle((progress: number, received: number, total: number) => {
          console.log('Download progress:', progress, received, total)
          onDownloadProgress?.({ percentage: progress, received, total })
        }, 250), // Update at most every 250ms
        []
      )

      // Download model
      const modelFile = await downloader.downloadModel(
        repoId,
        filename,
        throttledProgress
      )

      // Initialize model with throttled progress
      const throttledInitProgress = useCallback(
        throttle((progress: number) => {
          onInitProgress?.(progress)
        }, 250),
        []
      )

      // Initialize model
      const { context } = await manager.initializeModel(
        modelFile,
        null,
        throttledInitProgress
      )

      return context
    } catch (err: any) {
      throw err
    }
  }

  return {
    downloadAndInitModel,
  }
}