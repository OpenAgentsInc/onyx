import { API_URLS } from "../config/api"

export async function transcribeAudio(uri: string): Promise<string> {
  try {
    const formData = new FormData()

    // Create file object from uri
    const fileInfo = {
      uri,
      type: "audio/m4a",
      name: "recording.m4a"
    }

    // Add file to form data
    formData.append("file", fileInfo as any)
    formData.append('secret', 'foiujefi2ujf2389j2f39j2f9')

    const response = await fetch(API_URLS.transcribe, {
      method: "POST",
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Server response:", errorText)
      throw new Error(`Transcription failed: ${errorText}`)
    }

    const data = await response.json()
    return data.text
  } catch (error) {
    console.error("Transcription error:", error)
    throw error
  }
}
