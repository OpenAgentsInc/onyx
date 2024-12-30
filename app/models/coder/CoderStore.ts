import { cast, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { log } from "@/utils/log"
import { withSetPropAction } from "../_helpers/withSetPropAction"
import { Repo } from "../types/repo"

// Repo Model
export const RepoModel = types.model("Repo", {
  owner: types.string,
  name: types.string,
  branch: types.string,
})

// GitHub Token Model
export const GithubTokenModel = types.model("GithubToken", {
  id: types.identifier,
  name: types.string,
  token: types.string,
})

export const CoderStoreModel = types
  .model("CoderStore")
  .props({
    error: types.maybeNull(types.string),
    // Keep the old token field for backward compatibility
    githubToken: types.optional(types.string, ""),
    githubTokens: types.array(GithubTokenModel),
    activeTokenId: types.maybeNull(types.string),
    repos: types.array(RepoModel),
    activeRepoIndex: types.maybeNull(types.number),
  })
  .actions(withSetPropAction)
  .actions((self) => ({

    async setup() {
      log({
        name: "CoderStore.setup",
        preview: "Handling GitHub tokens",
        important: true
      })

      // First check if there is an old token
      // If there is, add it to the new array

      if (self.githubToken) {
        const legacyTokenExists = self.githubTokens.some(t =>
          t.name === "Legacy Token" && t.token === self.githubToken
        )

        if (!legacyTokenExists) {
          const id = `token_${Date.now()}`
          const newToken = GithubTokenModel.create({
            id,
            name: "Legacy Token",
            token: self.githubToken,
          })
          self.githubTokens.push(newToken)
          self.activeTokenId = id
        }
      }


    },

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
      if (self.activeRepoIndex === null) {
        self.activeRepoIndex = self.repos.length - 1
      }
    },

    removeRepo(repoToRemove: Repo) {
      const index = self.repos.findIndex(repo =>
        repo.owner === repoToRemove.owner &&
        repo.name === repoToRemove.name &&
        repo.branch === repoToRemove.branch
      )

      if (index !== -1) {
        self.repos = cast(self.repos.filter((_, i) => i !== index))
        if (self.activeRepoIndex === index) {
          self.activeRepoIndex = self.repos.length > 0 ? 0 : null
        } else if (self.activeRepoIndex !== null && self.activeRepoIndex > index) {
          self.activeRepoIndex--
        }
      }
    },

    updateRepo(oldRepo: Repo, newRepo: Repo) {
      const index = self.repos.findIndex(repo =>
        repo.owner === oldRepo.owner &&
        repo.name === oldRepo.name &&
        repo.branch === oldRepo.branch
      )

      if (index !== -1) {
        self.repos = cast(self.repos.map((repo, i) =>
          i === index ? RepoModel.create(newRepo) : repo
        ))
      }
    },

    setActiveRepoByIndex(index: number | null) {
      if (index !== null && (index < 0 || index >= self.repos.length)) {
        return
      }
      self.activeRepoIndex = index
    },

    setActiveRepo(repo: Repo | null) {
      if (!repo) {
        self.activeRepoIndex = null
        return
      }

      const index = self.repos.findIndex(r =>
        r.owner === repo.owner &&
        r.name === repo.name &&
        r.branch === repo.branch
      )

      if (index !== -1) {
        self.activeRepoIndex = index
      }
    }
  }))
  .views((self) => ({
    get hasGithubToken() {
      return !!self.githubToken
    },

    get activeRepo() {
      return self.activeRepoIndex !== null ? self.repos[self.activeRepoIndex] : null
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
    activeRepoIndex: null,
  })
