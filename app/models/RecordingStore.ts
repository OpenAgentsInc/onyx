import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const RecordingStoreModel = types
  .model("RecordingStore")
  .props({
    isRecording: false,
    recordingUri: types.maybeNull(types.string),
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
    },
  }))
  .views((store) => ({
    get hasRecording() {
      return !!store.recordingUri
    },
  }))

export interface RecordingStore extends Instance<typeof RecordingStoreModel> {}
export interface RecordingStoreSnapshot extends SnapshotOut<typeof RecordingStoreModel> {}