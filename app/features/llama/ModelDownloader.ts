import ReactNativeBlobUtil from "react-native-blob-util"
import type { DocumentPickerResponse } from 'react-native-document-picker'

const { dirs } = ReactNativeBlobUtil.fs

export type ProgressCallback = (progress: number, received: number, total: number) => void

export class ModelDownloader {
  private readonly cacheDir: string
  
  constructor() {
    this.cacheDir = `${dirs.CacheDir}/models`
  }

  async ensureDirectory(): Promise<void> {
    if (!(await ReactNativeBlobUtil.fs.isDir(this.cacheDir))) {
      await ReactNativeBlobUtil.fs.mkdir(this.cacheDir)
    }
  }

  async cleanDirectory(): Promise<void> {
    await ReactNativeBlobUtil.fs.unlink(this.cacheDir)
    await ReactNativeBlobUtil.fs.mkdir(this.cacheDir)
  }

  async downloadModel(
    repoId: string,
    filename: string,
    onProgress?: ProgressCallback
  ): Promise<DocumentPickerResponse> {
    const filepath = `${this.cacheDir}/${filename}`

    // Create directory if needed
    await this.ensureDirectory()

    // Check if model already exists
    if (await ReactNativeBlobUtil.fs.exists(filepath)) {
      return { uri: filepath } as DocumentPickerResponse
    }

    // Clean up and recreate directory
    await this.cleanDirectory()

    // Download model
    const response = await ReactNativeBlobUtil.config({
      fileCache: true,
      path: filepath,
      progress: (received, total) => {
        const progress = Math.round((received / total) * 100)
        onProgress?.(progress, received, total)
      },
    }).fetch(
      'GET',
      `https://huggingface.co/${repoId}/resolve/main/${filename}`
    )

    return { uri: response.path() } as DocumentPickerResponse
  }
}