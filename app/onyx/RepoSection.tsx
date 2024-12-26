import React, { useState } from "react"
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable } from "react-native"
import { observer } from "mobx-react-lite"
import { useStores } from "../models/_helpers/useStores"
import { colors } from "../theme"
import { typography } from "../theme"
import { styles as baseStyles } from "./styles"
import { Repo } from "../models/types/repo"

interface RepoSectionProps {
  visible: boolean
  onClose: () => void
}

const AVAILABLE_TOOLS = [
  { id: "view_file", name: "View File", description: "View file contents at path" },
  { id: "view_folder", name: "View Folder", description: "View file/folder hierarchy at path" },
  { id: "create_file", name: "Create File", description: "Create a new file at path with content" },
  { id: "rewrite_file", name: "Rewrite File", description: "Rewrite file at path with new content" },
]

export const RepoSection = observer(({ visible, onClose }: RepoSectionProps) => {
  const { coderStore, chatStore } = useStores()
  const [editingRepo, setEditingRepo] = useState<null | Repo>(null)
  const [githubToken, setGithubToken] = useState(coderStore.githubToken)
  const [repoInput, setRepoInput] = useState({
    owner: "",
    name: "",
    branch: ""
  })

  const handleRepoInputChange = (field: keyof Repo, value: string) => {
    setRepoInput(prev => ({ ...prev, [field]: value }))
  }

  const handleRepoSubmit = () => {
    if (editingRepo) {
      coderStore.updateRepo(editingRepo, repoInput)
      setEditingRepo(null)
    } else {
      coderStore.addRepo(repoInput)
    }
    coderStore.setGithubToken(githubToken)
    setRepoInput({ owner: "", name: "", branch: "" })
    onClose()
  }

  const handleAddRepoClick = () => {
    setEditingRepo(null)
    setRepoInput({ owner: "", name: "", branch: "" })
  }

  const handleEditRepo = (repo: Repo) => {
    setEditingRepo(repo)
    setRepoInput({
      owner: repo.owner,
      name: repo.name,
      branch: repo.branch
    })
  }

  const handleRemoveRepo = (repo: Repo) => {
    if (editingRepo && 
      editingRepo.owner === repo.owner && 
      editingRepo.name === repo.name && 
      editingRepo.branch === repo.branch
    ) {
      setEditingRepo(null)
      setRepoInput({ owner: "", name: "", branch: "" })
    }
    coderStore.removeRepo(repo)
  }

  const handleToolToggle = (toolId: string) => {
    chatStore.toggleTool(toolId)
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[baseStyles.modalContainer, styles.container]}>
        <View style={baseStyles.modalHeader}>
          <Pressable onPress={onClose}>
            <Text style={[baseStyles.buttonText, baseStyles.cancelText, styles.text]}>Cancel</Text>
          </Pressable>
          <Pressable onPress={handleRepoSubmit}>
            <Text style={[baseStyles.buttonText, styles.text, { color: "white" }]}>Save</Text>
          </Pressable>
        </View>

        <Text style={[styles.title, styles.text]}>Manage Repositories</Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.text]}>GitHub Token</Text>
          <TextInput
            style={[styles.input, styles.text]}
            value={githubToken}
            onChangeText={setGithubToken}
            placeholder="Enter GitHub token"
            placeholderTextColor={colors.palette.neutral400}
            secureTextEntry={true}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.text]}>Available Tools</Text>
          {AVAILABLE_TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[
                styles.toolButton,
                chatStore.isToolEnabled(tool.id) && styles.buttonActive
              ]}
              onPress={() => handleToolToggle(tool.id)}
            >
              <View style={styles.toolButtonContent}>
                <View>
                  <Text style={[styles.toolName, styles.text]}>{tool.name}</Text>
                  <Text style={[styles.toolDescription, styles.text]}>{tool.description}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  chatStore.isToolEnabled(tool.id) && styles.checkboxActive
                ]}>
                  {chatStore.isToolEnabled(tool.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.text]}>
            {editingRepo ? "Edit Repository" : "Add Repository"}
          </Text>
          <TextInput
            style={[styles.input, styles.text]}
            value={repoInput.owner}
            onChangeText={(value) => handleRepoInputChange("owner", value)}
            placeholder="Owner"
            placeholderTextColor={colors.palette.neutral400}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
          <TextInput
            style={[styles.input, styles.text]}
            value={repoInput.name}
            onChangeText={(value) => handleRepoInputChange("name", value)}
            placeholder="Repository name"
            placeholderTextColor={colors.palette.neutral400}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
          <TextInput
            style={[styles.input, styles.text]}
            value={repoInput.branch}
            onChangeText={(value) => handleRepoInputChange("branch", value)}
            placeholder="Branch"
            placeholderTextColor={colors.palette.neutral400}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
          {editingRepo && (
            <TouchableOpacity
              style={[styles.button, styles.cancelEditButton]}
              onPress={() => {
                setEditingRepo(null)
                setRepoInput({ owner: "", name: "", branch: "" })
              }}
            >
              <Text style={[styles.buttonText, styles.text]}>Cancel Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.text]}>Connected Repositories</Text>
          {coderStore.repos.map((repo) => (
            <View key={`${repo.owner}/${repo.name}/${repo.branch}`} style={styles.repoItem}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.repoButton,
                  coderStore.activeRepo === repo && styles.buttonActive,
                  editingRepo && 
                  editingRepo.owner === repo.owner && 
                  editingRepo.name === repo.name && 
                  editingRepo.branch === repo.branch && 
                  styles.buttonEditing
                ]}
                onPress={() => {
                  handleEditRepo(repo)
                  coderStore.setActiveRepo(repo)
                }}
              >
                <Text style={[styles.buttonText, styles.text]}>
                  {repo.owner}/{repo.name}
                </Text>
                <Text style={[styles.branchText, styles.text]}>
                  Branch: {repo.branch}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButton, styles.button]}
                onPress={() => handleRemoveRepo(repo)}
              >
                <Text style={[styles.buttonText, styles.text]}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "black",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.text,
  },
  text: {
    fontFamily: typography.primary.normal,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.palette.neutral50,
    color: colors.text,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.palette.neutral700,
    marginBottom: 10,
  },
  repoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  button: {
    backgroundColor: colors.palette.accent500,
    padding: 10,
    borderRadius: 5,
    opacity: 0.5,
    alignItems: "center",
  },
  repoButton: {
    flex: 1,
  },
  buttonActive: {
    opacity: 1,
  },
  buttonEditing: {
    borderColor: colors.palette.accent500,
    borderWidth: 2,
    opacity: 1,
  },
  buttonText: {
    color: colors.palette.neutral100,
    fontWeight: "bold",
  },
  branchText: {
    color: colors.palette.neutral100,
    fontSize: 12,
    opacity: 0.8,
  },
  deleteButton: {
    backgroundColor: colors.palette.angry500,
    minWidth: 80,
  },
  cancelEditButton: {
    backgroundColor: colors.palette.neutral700,
    marginTop: 5,
  },
  toolButton: {
    backgroundColor: colors.palette.neutral800,
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
  },
  toolButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toolName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  toolDescription: {
    color: colors.palette.neutral400,
    fontSize: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.palette.neutral400,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: colors.palette.accent500,
    borderColor: colors.palette.accent500,
  },
  checkmark: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
})