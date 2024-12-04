export interface MinimalCanvas {
  width: number
  height: number
  clientHeight: number
  style: Record<string, unknown>
  addEventListener: () => void
  removeEventListener: () => void
  getContext(contextId: string): ExpoWebGLRenderingContext | null
  toDataURL(type?: string): string
  toBlob(callback: BlobCallback): void
  captureStream(frameRate?: number): MediaStream
}