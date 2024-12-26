import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useStores } from "@/models/_helpers/useStores"
import { colors } from "@/theme"
import { Repo } from "@/models/types/repo"

export const RepoSection = observer(() => {
  const { coderStore } = useStores()
  const [showAddRepo, setShowAddRepo] = useState(false)
  const [repoInput, setRepoInput] = useState<Repo>({
    owner: "",
    name: "",
    branch: "",
  })
  const [editingRepo, setEditingRepo] = useState<Repo | null>(null)

  const handleSaveRepo = () => {
    if (editingRepo) {
      coderStore.updateRepo(editingRepo, repoInput)
      setEditingRepo(null)
    } else {
      coderStore.addRepo(repoInput)
    }
    setShowAddRepo(false)
    setRepoInput({ owner: "", name: "", branch: "" })
  }

  return (
    <View style={styles.container}>
      {showAddRepo ? (
        <View style={styles.addRepoContainer}>
          <TextInput
            style={styles.input}
            placeholder="Owner"
            placeholderTextColor={colors.text}
            value={repoInput.owner}
            onChangeText={(text) => setRepoInput({ ...repoInput, owner: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={colors.text}
            value={repoInput.name}
            onChangeText={(text) => setRepoInput({ ...repoInput, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Branch"
            placeholderTextColor={colors.text}
            value={repoInput.branch}
            onChangeText={(text) => setRepoInput({ ...repoInput, branch: text })}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveRepo}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setShowAddRepo(false)
                setEditingRepo(null)
                setRepoInput({ owner: "", name: "", branch: "" })
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          {coderStore.repos.map((repo) => (
            <View key={`${repo.owner}/${repo.name}/${repo.branch}`} style={styles.repoRow}>
              <TouchableOpacity
                style={[
                  styles.repoButton,
                  coderStore.activeRepo === repo && styles.buttonActive,
                ]}
                onPress={() => {
                  coderStore.setActiveRepo(repo)
                }}
              >
                <Text style={styles.repoText}>
                  {repo.owner}/{repo.name} ({repo.branch})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => {
                  setEditingRepo(repo)
                  setRepoInput(repo)
                  setShowAddRepo(true)
                }}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => coderStore.removeRepo(repo)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={() => setShowAddRepo(true)}
          >
            <Text style={styles.buttonText}>Add Repository</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.background,
  },
  addRepoContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.palette.neutral800,
    color: colors.text,
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: colors.palette.accent500,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.palette.neutral600,
    flex: 1,
  },
  editButton: {
    backgroundColor: colors.palette.accent500,
  },
  deleteButton: {
    backgroundColor: colors.palette.angry500,
  },
  addButton: {
    backgroundColor: colors.palette.accent500,
    marginTop: 8,
  },
  buttonText: {
    color: colors.palette.neutral100,
  },
  repoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  repoButton: {
    flex: 1,
    padding: 8,
    backgroundColor: colors.palette.neutral800,
    borderRadius: 4,
    marginRight: 8,
  },
  buttonActive: {
    backgroundColor: colors.palette.accent500,
  },
  repoText: {
    color: colors.text,
  },
})