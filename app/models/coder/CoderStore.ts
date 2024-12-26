import { Instance, SnapshotIn, SnapshotOut, cast, types } from "mobx-state-tree"
import { withSetPropAction } from "../_helpers/withSetPropAction"
import { Repo } from "../types/repo"

// Repo Model
export const RepoModel = types.model("Repo", {
  owner: types.string,
  name: types.string,
  branch: types.string,
})

export const CoderStoreModel = types
  .model("CoderStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    githubToken: types.optional(types.string, ""),
    repos: types.array(RepoModel),
    activeRepo: types.maybeNull(RepoModel),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    setError(error: string | null) {
      self.error = error
    },

    setGithubToken(token: string) {
      self.githubToken = token
    },

    // Repo actions
    addRepo(repo: Repo) {
      const newRepo = RepoModel.create(repo)
      self.repos.push(newRepo)
      if (!self.activeRepo) {
        // Create a new instance for activeRepo
        self.activeRepo = RepoModel.create(repo)
      }
    },

    removeRepo(repoToRemove: Repo) {
      self.repos = cast(self.repos.filter(repo =>
        !(repo.owner === repoToRemove.owner &&
          repo.name === repoToRemove.name &&
          repo.branch === repoToRemove.branch)
      ))
      if (self.activeRepo &&
        self.activeRepo.owner === repoToRemove.owner &&
        self.activeRepo.name === repoToRemove.name &&
        self.activeRepo.branch === repoToRemove.branch) {
        self.activeRepo = null
      }
    },

    updateRepo(oldRepo: Repo, newRepo: Repo) {
      self.repos = cast(self.repos.map(repo =>
        repo.owner === oldRepo.owner &&
        repo.name === oldRepo.name &&
        repo.branch === oldRepo.branch
          ? RepoModel.create(newRepo)
          : repo
      ))
      if (self.activeRepo &&
        self.activeRepo.owner === oldRepo.owner &&
        self.activeRepo.name === oldRepo.name &&
        self.activeRepo.branch === oldRepo.branch) {
        self.activeRepo = RepoModel.create(newRepo)
      }
    },

    setActiveRepo(repo: Repo | null) {
      self.activeRepo = repo ? RepoModel.create(repo) : null
    }
  }))
  .views((self) => ({
    get hasGithubToken() {
      return !!self.githubToken
    }
  }))

export interface CoderStore extends Instance<typeof CoderStoreModel> { }
export interface CoderStoreSnapshotOut extends SnapshotOut<typeof CoderStoreModel> { }
export interface CoderStoreSnapshotIn extends SnapshotIn<typeof CoderStoreModel> { }

export const createCoderStoreDefaultModel = () =>
  CoderStoreModel.create({
    isInitialized: false,
    error: null,
    githubToken: "",
    repos: [],
    activeRepo: null,
  })