import { observer } from "mobx-react-lite"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useStores } from "@/models"
import { Repo } from "@/models/types/repo"
import { styles } from "./styles"

interface RepoListSectionProps {
  editingRepo: Repo | null
  onEditRepo: (repo: Repo) => void
  onRemoveRepo: (repo: Repo) => void
  onAddRepoClick: () => void
}

export const RepoListSection = observer(({
  editingRepo,
  onEditRepo,
  onRemoveRepo,
  onAddRepoClick,
}: RepoListSectionProps) => {
  const { coderStore } = useStores()

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, styles.text]}>Connected Repositories</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addButton}
          onPress={onAddRepoClick}
        >
          <Text style={[styles.addButtonText, styles.text]}>Add Repo</Text>
        </TouchableOpacity>
      </View>

      {coderStore.repos.map((repo) => (
        <View key={`${repo.owner}/${repo.name}/${repo.branch}`} style={styles.repoItem}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.button,
              styles.repoButton,
              coderStore.activeRepo === repo && styles.buttonActive,
              editingRepo &&
                editingRepo.owner === repo.owner &&
                editingRepo.name === repo.name &&
                editingRepo.branch === repo.branch &&
                styles.buttonEditing,
            ]}
            onPress={() => onEditRepo(repo)}
          >
            <Text style={[styles.buttonText, styles.text]}>
              {repo.owner}/{repo.name}
            </Text>
            <Text style={[styles.branchText, styles.text]}>Branch: {repo.branch}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.deleteButton, styles.button]}
            onPress={() => onRemoveRepo(repo)}
          >
            <Text style={[styles.buttonText, styles.text]}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
})