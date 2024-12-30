import { Instance, SnapshotOut } from "mobx-state-tree"
import { WalletStoreModel } from "./WalletStore"

export interface WalletStoreType extends Instance<typeof WalletStoreModel> { }
export interface WalletStoreSnapshot extends SnapshotOut<typeof WalletStoreModel> { }