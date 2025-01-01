import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../_helpers/withSetPropAction"
import { isDevEnvironment } from "@/config"

export const UserStoreModel = types
  .model("UserStore")
  .props({
    pushToken: types.optional(types.string, ""),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    afterCreate() {
      // Set example push token in dev environment
      if (isDevEnvironment) {
        self.pushToken = "example-push-token"
      }
    },

    setPushToken(token: string) {
      self.pushToken = token
    },

    clearPushToken() {
      self.pushToken = ""
    }
  }))
  .views((self) => ({
    get hasPushToken() {
      return !!self.pushToken
    }
  }))

export interface UserStore extends Instance<typeof UserStoreModel> { }
export interface UserStoreSnapshotOut extends SnapshotOut<typeof UserStoreModel> { }
export interface UserStoreSnapshotIn extends SnapshotIn<typeof UserStoreModel> { }

export const createUserStoreDefaultModel = () =>
  UserStoreModel.create({
    pushToken: isDevEnvironment ? "example-push-token" : "",
  })