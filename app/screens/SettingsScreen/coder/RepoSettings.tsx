import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native"
import { useStores } from "@/models"
import { Repo } from "@/models/types/repo"
import { styles as baseStyles } from "@/theme/onyx"
import { GithubTokenSection } from "./GithubTokenSection"
import { RepoFormSection } from "./RepoFormSection"
import { RepoListSection } from "./RepoListSection"
import { styles } from "./styles"
import { ToolsSection } from "./ToolsSection"

export const RepoSettings = observer(() => {
  const { coderStore } = useStores()
  const [editingRepo, setEditingRepo] = useState<null | Repo>(null)
  const [repoInput, setRepoInput] = useState({
    owner: "",
    name: "",
    branch: "",
  })
  const [showRepoForm, setShowRepoForm] = useState(false)

  const handleRepoInputChange = (field: keyof Repo, value: string) => {
    setRepoInput((prev) => ({ ...prev, [field]: value }))
  }

  const handleRepoSubmit = () => {
    if (!repoInput.owner || !repoInput.name || !repoInput.branch) {
      return // Don't submit if fields are empty
    }

    if (editingRepo) {
      coderStore.updateRepo(editingRepo, repoInput)
      setEditingRepo(null)
    } else {
      coderStore.addRepo(repoInput)
    }
    setRepoInput({ owner: "", name: "", branch: "" })
    setShowRepoForm(false)
  }

  const handleAddRepoClick = () => {
    setEditingRepo(null)
    setRepoInput({ owner: "", name: "", branch: "" })
    setShowRepoForm(true)
  }

  const handleEditRepo = (repo: Repo) => {
    const repoData = {
      owner: repo.owner,
      name: repo.name,
      branch: repo.branch,
    }
    setEditingRepo(repoData)
    setRepoInput(repoData)
    setShowRepoForm(true)
    coderStore.setActiveRepo(repo)
  }

  const handleRemoveRepo = (repo: Repo) => {
    if (
      editingRepo &&
      editingRepo.owner === repo.owner &&
      editingRepo.name === repo.name &&
      editingRepo.branch === repo.branch
    ) {
      setEditingRepo(null)
      setRepoInput({ owner: "", name: "", branch: "" })
      setShowRepoForm(false)
    }
    coderStore.removeRepo(repo)
  }

  const handleCancelEdit = () => {
    setEditingRepo(null)
    setRepoInput({ owner: "", name: "", branch: "" })
    setShowRepoForm(false)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[baseStyles.modalContainer]}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, styles.text]}>AutoCoder</Text>
        <Text style={[styles.subtitle, styles.text]}>
          Onyx can analyze or edit codebases. Add a GitHub token and connect repos.
        </Text>

        <GithubTokenSection />

        <ToolsSection />

        {showRepoForm && (
          <RepoFormSection
            editingRepo={editingRepo}
            repoInput={repoInput}
            onRepoInputChange={handleRepoInputChange}
            onRepoSubmit={handleRepoSubmit}
            onCancel={handleCancelEdit}
          />
        )}

        <RepoListSection
          editingRepo={editingRepo}
          onEditRepo={handleEditRepo}
          onRemoveRepo={handleRemoveRepo}
          onAddRepoClick={handleAddRepoClick}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
})
