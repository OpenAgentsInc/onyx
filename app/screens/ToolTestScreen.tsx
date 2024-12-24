import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity } from "react-native"
import { Text } from "react-native"
import { useStores } from "../models/_helpers/useStores"
import { colors } from "../theme"
import type { ToolResult } from "../services/gemini/tools/types"

export const ToolTestScreen: FC = observer(function ToolTestScreen() {
  const { toolStore } = useStores()
  const [owner, setOwner] = useState("OpenAgentsInc")
  const [repo, setRepo] = useState("onyx")
  const [branch, setBranch] = useState("main")
  const [path, setPath] = useState("README.md")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleViewFile = async () => {
    setLoading(true)
    setError("")
    try {
      const tool = toolStore.getToolById("github_view_file")
      if (!tool) {
        throw new Error("Tool not found")
      }

      const response = await tool.metadata.implementation({
        owner,
        repo,
        branch,
        path,
      }) as ToolResult<unknown>

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

      const response = await tool.metadata.implementation({
        owner,
        repo,
        branch,
        path,
      }) as ToolResult<unknown>

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
    <View style={styles.container}>
      <Text style={styles.title}>Tool Testing</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Owner"
          value={owner}
          onChangeText={setOwner}
        />
        <TextInput
          style={styles.input}
          placeholder="Repo"
          value={repo}
          onChangeText={setRepo}
        />
        <TextInput
          style={styles.input}
          placeholder="Branch"
          value={branch}
          onChangeText={setBranch}
        />
        <TextInput
          style={styles.input}
          placeholder="Path"
          value={path}
          onChangeText={setPath}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleViewFile}
          disabled={loading}
        >
          <Text style={styles.buttonText}>View File</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
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
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
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