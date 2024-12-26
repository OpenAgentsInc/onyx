import React, { useState } from "react"
import { Modal, Text, TextInput, TouchableOpacity, View, Pressable, ScrollView } from "react-native"
import { observer } from "mobx-react-lite"
import { Ionicons } from "@expo/vector-icons"
import { useStores } from "../../models/_helpers/useStores"
import { colors, typography } from "../../theme"
import { styles as baseStyles } from "../styles"
import { Repo } from "../../models/types/repo"
import { RepoSectionProps, AVAILABLE_TOOLS } from "./types"
import { styles } from "./styles"

export const RepoSection = observer(({ visible, onClose }: RepoSectionProps) => {
  const { coderStore, chatStore } = useStores()
  const [editingRepo, setEditingRepo] = useState<null | Repo>(null)
  const [githubToken, setGithubToken] = useState(coderStore.githubToken)
  const [repoInput, setRepoInput] = useState({
    owner: "",
    name: "",
    branch: ""
  })
  const [showRepoForm, setShowRepoForm] = useState(false)

  const handleRepoInputChange = (field: keyof Repo, value: string) => {
    setRepoInput(prev => ({ ...prev, [field]: value }))
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

  const handleGithubTokenSubmit = () => {
    coderStore.setGithubToken(githubToken)
  }

  const handleAddRepoClick = () => {
    setEditingRepo(null)
    setRepoInput({ owner: "", name: "", branch: "" })
    setShowRepoForm(true)
  }

  const handleEditRepo = (repo: Repo) => {
    // Create a plain object copy of the repo data
    const repoData = {
      owner: repo.owner,
      name: repo.name,
      branch: repo.branch
    }
    setEditingRepo(repoData)
    setRepoInput(repoData)
    setShowRepoForm(true)
    coderStore.setActiveRepo(repo)
  }

  const handleRemoveRepo = (repo: Repo) => {
    if (editingRepo && 
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
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClose}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color={colors.palette.neutral800} />
        </TouchableOpacity>

        <ScrollView style={styles.scrollView}>
          <Text style={[styles.title, styles.text]}>Configure AutoCoder</Text>
          <Text style={[styles.subtitle, styles.text]}>
            Onyx can analyze or edit codebases. Add a GitHub token and connect repos.
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.text]}>GitHub Token</Text>
            <TextInput
              style={[styles.input, styles.text]}
              value={githubToken}
              onChangeText={setGithubToken}
              placeholder="Enter GitHub token"
              placeholderTextColor={colors.palette.neutral400}
              secureTextEntry={true}
              onBlur={handleGithubTokenSubmit}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.text]}>Available Tools</Text>
            {AVAILABLE_TOOLS.map((tool) => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={tool.id}
                style={[
                  styles.toolButton,
                  chatStore.isToolEnabled(tool.id) && styles.buttonActive
                ]}
                onPress={() => handleToolToggle(tool.id)}
              >
                <View style={styles.toolButtonContent}>
                  <View style={styles.toolTextContainer}>
                    <Text style={[styles.toolName, styles.text]}>{tool.name}</Text>
                    <Text style={[styles.toolDescription, styles.text]}>{tool.description}</Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    chatStore.isToolEnabled(tool.id) && styles.checkboxActive
                  ]}>
                    {chatStore.isToolEnabled(tool.id) && (
                      <Text style={[styles.checkmark, styles.text]}>✓</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, styles.text]}>Connected Repositories</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.addButton}
                onPress={handleAddRepoClick}
              >
                <Text style={[styles.addButtonText, styles.text]}>Add Repo</Text>
              </TouchableOpacity>
            </View>

            {showRepoForm && (
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
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.button, styles.submitButton]}
                    onPress={handleRepoSubmit}
                  >
                    <Text style={[styles.buttonText, styles.text]}>
                      {editingRepo ? "Update Repository" : "Add Repository"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.button, styles.cancelEditButton]}
                    onPress={() => {
                      setEditingRepo(null)
                      setRepoInput({ owner: "", name: "", branch: "" })
                      setShowRepoForm(false)
                    }}
                  >
                    <Text style={[styles.buttonText, styles.text]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

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
                    styles.buttonEditing
                  ]}
                  onPress={() => handleEditRepo(repo)}
                >
                  <Text style={[styles.buttonText, styles.text]}>
                    {repo.owner}/{repo.name}
                  </Text>
                  <Text style={[styles.branchText, styles.text]}>
                    Branch: {repo.branch}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.deleteButton, styles.button]}
                  onPress={() => handleRemoveRepo(repo)}
                >
                  <Text style={[styles.buttonText, styles.text]}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
})