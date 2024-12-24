import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable } from "react-native"
import { useStores } from "../models/_helpers/useStores"
import { colors } from "../theme"
import { styles as baseStyles } from "./styles"

import type { ToolResult } from "../services/gemini/tools/types"

interface ToolTestModalProps {
  visible: boolean
  onClose: () => void
}

export const ToolTestModal = observer(({ visible, onClose }: ToolTestModalProps) => {
  const { toolStore } = useStores()
  const [owner, setOwner] = useState("OpenAgentsInc")
  const [repo, setRepo] = useState("onyx")
  const [branch, setBranch] = useState("tools")
  const [path, setPath] = useState("README.md")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!toolStore.isInitialized) {
      toolStore.initializeDefaultTools()
    }
  }, [toolStore])

  const handleViewFile = async () => {
    setLoading(true)
    setError("")
    try {
      const tool = toolStore.getToolById("github_view_file")
      if (!tool) {
        throw new Error("Tool not found")
      }

      const response = (await tool.metadata.implementation({
        owner,
        repo,
        branch,
        path,
      })) as ToolResult<unknown>

      if (!response.success) {
        throw new Error(response.error)
      }

      setResult(JSON.stringify(response.data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const handleViewHierarchy = async () => {
    setLoading(true)
    setError("")
    try {
      const tool = toolStore.getToolById("github_view_hierarchy")
      if (!tool) {
        throw new Error("Tool not found")
      }

      const response = (await tool.metadata.implementation({
        owner,
        repo,
        branch,
        path,
      })) as ToolResult<unknown>

      if (!response.success) {
        throw new Error(response.error)
      }

      setResult(JSON.stringify(response.data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
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
            <Text style={[baseStyles.buttonText, baseStyles.cancelText]}>Close</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Tool Testing</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Owner"
            value={owner}
            onChangeText={setOwner}
            placeholderTextColor={colors.textDim}
          />
          <TextInput
            style={styles.input}
            placeholder="Repo"
            value={repo}
            onChangeText={setRepo}
            placeholderTextColor={colors.textDim}
          />
          <TextInput
            style={styles.input}
            placeholder="Branch"
            value={branch}
            onChangeText={setBranch}
            placeholderTextColor={colors.textDim}
          />
          <TextInput
            style={styles.input}
            placeholder="Path"
            value={path}
            onChangeText={setPath}
            placeholderTextColor={colors.textDim}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleViewFile}
            disabled={loading}
          >
            <Text style={styles.buttonText}>View File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleViewHierarchy}
            disabled={loading}
          >
            <Text style={styles.buttonText}>View Hierarchy</Text>
          </TouchableOpacity>
        </View>

        {loading && <Text style={styles.loading}>Loading...</Text>}
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <ScrollView style={styles.resultContainer}>
            <Text style={styles.result}>{result}</Text>
          </ScrollView>
        )}
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.palette.accent500,
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.palette.neutral100,
    fontWeight: "bold",
  },
  resultContainer: {
    flex: 1,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  result: {
    color: colors.text,
    fontFamily: "monospace",
  },
  error: {
    color: colors.error,
    marginBottom: 10,
  },
  loading: {
    color: colors.text,
    alignSelf: "center",
    marginBottom: 10,
  },
})