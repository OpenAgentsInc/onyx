import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  test: types.optional(types.string, "test"),
  // authenticationStore: types.optional(AuthenticationStoreModel, {}),
  // recordingStore: types.optional(RecordingStoreModel, {}),
  // chatStore: types.optional(ChatStoreModel, { messages: [], showFullChat: false }),
  // walletStore: types.optional(WalletStoreModel, {
  //   balanceSat: 0,
  //   pendingSendSat: 0,
  //   pendingReceiveSat: 0,
  //   transactions: [],
  // }),
  // userStore: types.optional(UserStoreModel, {}),
  // modelStore: types.optional(ModelStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> { }

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> { }
