import { ModelDownloader } from "../ModelDownloader"
import { ModelManager } from "../ModelManager"
import type { LlamaContext } from 'llama.rn'

export type DownloadProgress = {
  percentage: number
  received: number
  total: number
}

// Simple throttle function
const throttle = (func: Function, limit: number) => {
  let lastRun = 0
  return function (...args: any[]) {
    const now = Date.now()
    if (lastRun + limit < now) {
      func.apply(this, args)
      lastRun = now
    }
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
      // Create throttled progress handlers
      const throttledDownloadProgress = throttle((progress: number, received: number, total: number) => {
        console.log('Download progress:', progress, received, total)
        onDownloadProgress?.({ percentage: progress, received, total })
      }, 250) // Update at most every 250ms

      const throttledInitProgress = throttle((progress: number) => {
        onInitProgress?.(progress)
      }, 250)

      // Download model
      const modelFile = await downloader.downloadModel(
        repoId,
        filename,
        throttledDownloadProgress
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