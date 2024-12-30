import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { useStores } from "@/models"
import { Repo } from "@/models/types/repo"
import { colorsDark as colors } from "@/theme"
import { styles } from "./styles"

interface RepoFormSectionProps {
  editingRepo: Repo | null
  repoInput: {
    owner: string
    name: string
    branch: string
  }
  onRepoInputChange: (field: keyof Repo, value: string) => void
  onRepoSubmit: () => void
  onCancel: () => void
}

export const RepoFormSection = ({
  editingRepo,
  repoInput,
  onRepoInputChange,
  onRepoSubmit,
  onCancel,
}: RepoFormSectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, styles.text]}>
        {editingRepo ? "Edit Repository" : "Add Repository"}
      </Text>
      <TextInput
        style={[styles.input, styles.text]}
        value={repoInput.owner}
        onChangeText={(value) => onRepoInputChange("owner", value)}
        placeholder="Owner"
        placeholderTextColor={colors.palette.neutral400}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
      />
      <TextInput
        style={[styles.input, styles.text]}
        value={repoInput.name}
        onChangeText={(value) => onRepoInputChange("name", value)}
        placeholder="Repository name"
        placeholderTextColor={colors.palette.neutral400}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
      />
      <TextInput
        style={[styles.input, styles.text]}
        value={repoInput.branch}
        onChangeText={(value) => onRepoInputChange("branch", value)}
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
          onPress={onRepoSubmit}
        >
          <Text style={[styles.buttonText, styles.text]}>
            {editingRepo ? "Update Repository" : "Add Repository"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.button, styles.cancelEditButton]}
          onPress={onCancel}
        >
          <Text style={[styles.buttonText, styles.text]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}