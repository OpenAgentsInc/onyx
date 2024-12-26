import React, { useState } from "react"
import { Modal, Text, TextInput, TouchableOpacity, View, Pressable, ScrollView } from "react-native"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models/_helpers/useStores"
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
                activeOpacity={0.8}
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

          <View style={[styles.section, styles.lastSection]}>
            <Text style={[styles.sectionTitle, styles.text]}>Connected Repositories</Text>
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