import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { useStores } from "@/models"
import { colorsDark as colors } from "@/theme"
import { styles } from "./styles"

export const GithubTokenSection = observer(() => {
  const { coderStore } = useStores()
  const [showTokenForm, setShowTokenForm] = useState(false)
  const [editingTokenId, setEditingTokenId] = useState<string | null>(null)
  const [tokenInput, setTokenInput] = useState({
    name: "",
    token: "",
  })

  const handleAddTokenClick = () => {
    setEditingTokenId(null)
    setTokenInput({ name: "", token: "" })
    setShowTokenForm(true)
  }

  const handleEditToken = (id: string) => {
    const token = coderStore.githubTokens.find((t) => t.id === id)
    if (token) {
      setEditingTokenId(id)
      setTokenInput({ name: token.name, token: token.token })
      setShowTokenForm(true)
    }
  }

  const handleTokenSubmit = () => {
    if (!tokenInput.name || !tokenInput.token) return

    if (editingTokenId) {
      coderStore.updateGithubToken(editingTokenId, tokenInput.name, tokenInput.token)
    } else {
      coderStore.addGithubToken(tokenInput.name, tokenInput.token)
    }
    setTokenInput({ name: "", token: "" })
    setShowTokenForm(false)
    setEditingTokenId(null)
  }

  const handleCancelEdit = () => {
    setTokenInput({ name: "", token: "" })
    setShowTokenForm(false)
    setEditingTokenId(null)
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, styles.text]}>GitHub Tokens</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addButton}
          onPress={handleAddTokenClick}
        >
          <Text style={[styles.addButtonText, styles.text]}>Add Token</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, styles.text]}>
        You can add one or more GitHub tokens, but only one can be active at once. Onyx will act as
        the user associated with the token.
      </Text>

      {showTokenForm && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.text]}>
            {editingTokenId ? "Edit Token" : "Add Token"}
          </Text>
          <TextInput
            style={[styles.input, styles.text]}
            value={tokenInput.name}
            onChangeText={(value) => setTokenInput((prev) => ({ ...prev, name: value }))}
            placeholder="Token name"
            placeholderTextColor={colors.palette.neutral400}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
          <TextInput
            style={[styles.input, styles.text]}
            value={tokenInput.token}
            onChangeText={(value) => setTokenInput((prev) => ({ ...prev, token: value }))}
            placeholder="GitHub token"
            placeholderTextColor={colors.palette.neutral400}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, styles.submitButton]}
              onPress={handleTokenSubmit}
            >
              <Text style={[styles.buttonText, styles.text]}>
                {editingTokenId ? "Update Token" : "Add Token"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, styles.cancelEditButton]}
              onPress={handleCancelEdit}
            >
              <Text style={[styles.buttonText, styles.text]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {coderStore.githubTokens.map((token) => (
        <View key={token.id} style={styles.repoItem}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.button,
              styles.repoButton,
              coderStore.activeTokenId === token.id && styles.buttonActive,
              editingTokenId === token.id && styles.buttonEditing,
            ]}
            onPress={() => coderStore.setActiveTokenId(token.id)}
          >
            <Text style={[styles.buttonText, styles.text]}>{token.name}</Text>
            <Text style={[styles.branchText, styles.text]}>
              {token.token.slice(0, 4)}...{token.token.slice(-4)}
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, styles.editButton]}
              onPress={() => handleEditToken(token.id)}
            >
              <Text style={[styles.buttonText, styles.text]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.deleteButton, styles.button]}
              onPress={() => coderStore.removeGithubToken(token.id)}
            >
              <Text style={[styles.buttonText, styles.text]}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  )
})
