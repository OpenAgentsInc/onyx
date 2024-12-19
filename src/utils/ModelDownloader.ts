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
    if (await ReactNativeBlobUtil.fs.exists(this.cacheDir)) {
      await ReactNativeBlobUtil.fs.unlink(this.cacheDir)
    }
    await ReactNativeBlobUtil.fs.mkdir(this.cacheDir)
  }

  async downloadModel(
    repoId: string,
    filename: string,
    onProgress?: ProgressCallback
  ): Promise<DocumentPickerResponse> {
    const filepath = `${this.cacheDir}/${filename}`

    await this.ensureDirectory()

    // If the file already exists, just return it
    if (await ReactNativeBlobUtil.fs.exists(filepath)) {
      return { uri: filepath } as DocumentPickerResponse
    }

    // Clean directory first to ensure no leftovers
    await this.cleanDirectory()

    // Download the model file from Hugging Face
    const response = await ReactNativeBlobUtil.config({
      fileCache: true,
      path: filepath
    }).fetch(
      'GET',
      `https://huggingface.co/${repoId}/resolve/main/${filename}`
    ).progress((received, total) => {
      const progress = Math.round((received / total) * 100)
      onProgress?.(progress, received, total)
    })

    return { uri: response.path() } as DocumentPickerResponse
  }
}
