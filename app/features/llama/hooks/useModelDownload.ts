import { useState } from 'react'
import { ModelDownloader } from '../ModelDownloader'
import { ModelManager } from '../ModelManager'
import type { LlamaContext } from 'llama.rn'

export type DownloadProgress = {
  percentage: number
  received: number
  total: number
}

export function useModelDownload() {
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null)
  const [initProgress, setInitProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const downloader = new ModelDownloader()
  const manager = new ModelManager()

  const downloadAndInitModel = async (
    repoId: string,
    filename: string
  ): Promise<LlamaContext> => {
    try {
      setError(null)
      
      // Download model
      const modelFile = await downloader.downloadModel(
        repoId,
        filename,
        (progress, received, total) => {
          setDownloadProgress({ percentage: progress, received, total })
        }
      )

      setDownloadProgress(null)

      // Initialize model
      const { context } = await manager.initializeModel(
        modelFile,
        null,
        (progress) => {
          setInitProgress(progress)
        }
      )

      return context
    } catch (err: any) {
      setError(err.message || 'Failed to download and initialize model')
      throw err
    }
  }

  return {
    downloadAndInitModel,
    downloadProgress,
    initProgress,
    error
  }
}