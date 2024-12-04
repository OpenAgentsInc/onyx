import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { transcribeAudio } from "../services/transcriptionService"

export const RecordingStoreModel = types
  .model("RecordingStore")
  .props({
    isRecording: false,
    recordingUri: types.maybeNull(types.string),
    transcription: types.maybeNull(types.string),
    isTranscribing: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    setIsRecording(value: boolean) {
      store.setProp("isRecording", value)
    },
    setRecordingUri(uri: string | null) {
      store.setProp("recordingUri", uri)
    },
    clearRecording() {
      store.setProp("recordingUri", null)
      store.setProp("transcription", null)
    },
    async transcribeRecording() {
      if (!store.recordingUri) return

      try {
        store.setProp("isTranscribing", true)
        const text = await transcribeAudio(store.recordingUri)
        store.setProp("transcription", text)
        return text
      } catch (error) {
        console.error("Failed to transcribe:", error)
        store.setProp("transcription", null)
        return null
      } finally {
        store.setProp("isTranscribing", false)
      }
    },
  }))
  .views((store) => ({
    get hasRecording() {
      return !!store.recordingUri
    },
  }))

export interface RecordingStore extends Instance<typeof RecordingStoreModel> {}
export interface RecordingStoreSnapshot extends SnapshotOut<typeof RecordingStoreModel> {}