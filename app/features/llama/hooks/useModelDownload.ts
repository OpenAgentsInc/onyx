import { ModelDownloader } from "../ModelDownloader"
import { ModelManager } from "../ModelManager"

import type { LlamaContext } from 'llama.rn'

export type DownloadProgress = {
  percentage: number
  received: number
  total: number
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
      // Download model
      const modelFile = await downloader.downloadModel(
        repoId,
        filename,
        (progress, received, total) => {
          console.log('Download progress:', progress, received, total)
          onDownloadProgress?.({ percentage: progress, received, total })
        }
      )

      // Initialize model
      const { context } = await manager.initializeModel(
        modelFile,
        null,
        (progress) => {
          onInitProgress?.(progress)
        }
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
