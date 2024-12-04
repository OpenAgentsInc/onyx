export interface MinimalCanvas extends HTMLCanvasElement {
  width: number
  height: number
  clientHeight: number
  style: Record<string, unknown>
  addEventListener: () => void
  removeEventListener: () => void
  getContext(contextId: string): RenderingContext | null
  toDataURL(type?: string, quality?: any): string
  toBlob(callback: BlobCallback, type?: string, quality?: any): void
  captureStream(frameRate?: number): MediaStream
}