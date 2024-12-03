import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { EpisodeStoreModel } from "./EpisodeStore"
import { RecordingStoreModel } from "./RecordingStore"

const MessageModel = types.model("Message", {
  id: types.string,
  role: types.enumeration(["user", "assistant"]),
  content: types.string,
  createdAt: types.maybe(types.Date),
})

const ChatStoreModel = types
  .model("ChatStore")
  .props({
    messages: types.array(MessageModel),
  })
  .actions((store) => ({
    setMessages(messages: any[]) {
      store.messages.replace(
        messages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt ? new Date(m.createdAt) : undefined
        }))
      )
    },
    addMessage(message: any) {
      store.messages.push({
        id: message.id,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt ? new Date(message.createdAt) : undefined
      })
    },
    clearMessages() {
      store.messages.clear()
    },
  }))

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  episodeStore: types.optional(EpisodeStoreModel, {}),
  recordingStore: types.optional(RecordingStoreModel, {}),
  chatStore: types.optional(ChatStoreModel, { messages: [] }),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}