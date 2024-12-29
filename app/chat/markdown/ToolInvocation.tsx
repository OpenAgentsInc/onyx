import React, { useState } from "react"
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { colorsDark as colors, typography } from "@/theme"

interface JSONValue {
  [key: string]: any
}

interface ModalContentProps {
  title: string
  description: string
  content: any
  visible: boolean
  onClose: () => void
}

export interface ToolInvocation {
  id?: string
  toolCallId?: string
  tool_name?: string
  toolName?: string
  input?: JSONValue
  args?: JSONValue
  output?: JSONValue
  result?: JSONValue
  status?: "pending" | "completed" | "failed"
  state?: "call" | "result" | "partial-call"
}

const ensureObject = (value: JSONValue): Record<string, any> => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, any>
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value)
    } catch (error) {
      console.error("Failed to parse as JSON:", error)
    }
  }
  return {}
}

const ModalContent = ({ title, description, content, visible, onClose }: ModalContentProps) => (
  <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalDescription}>{description}</Text>
        <ScrollView style={styles.modalScrollView}>
          <Text style={styles.preText}>{JSON.stringify(content, null, 2)}</Text>
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)

export function ToolInvocation({ toolInvocation }: { toolInvocation: ToolInvocation }) {
  const [isFileContentModalVisible, setIsFileContentModalVisible] = useState(false)
  const [isInputParamsModalVisible, setIsInputParamsModalVisible] = useState(false)

  if (!toolInvocation || typeof toolInvocation !== "object") {
    console.error("Invalid toolInvocation prop:", toolInvocation)
    return <Text style={styles.errorText}>Error: Invalid tool invocation data</Text>
  }

  const { id, toolCallId, tool_name, toolName, input, args, output, result, status, state } =
    toolInvocation

  const displayId = id || toolCallId
  const displayName = tool_name || toolName
  const displayInput = input || (args as JSONValue)
  const displayOutput = output || result
  const displayStatus = status || (state === "result" ? "completed" : "pending")

  const inputObject = ensureObject(displayInput)
  const outputObject = displayOutput ? ensureObject(displayOutput) : null

  const { owner, repo, branch } = inputObject

  const repoInfo = owner && repo && branch ? `${owner}/${repo} (${branch})` : null

  const renderStateIcon = () => {
    if (displayStatus === "pending") {
      return <Text style={styles.pendingText}>⟳</Text>
    } else if (displayStatus === "completed") {
      return <Text style={styles.completedText}>✓</Text>
    } else if (displayStatus === "failed") {
      return <Text style={styles.failedText}>✗</Text>
    }
    return null
  }

  const summary =
    outputObject?.summary ||
    outputObject?.value?.result?.summary ||
    outputObject?.value?.result?.details ||
    "---"

  const fileContent = outputObject?.content

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{displayName}</Text>
          {repoInfo && <Text style={styles.repoInfo}>{repoInfo}</Text>}
        </View>
        <View style={styles.statusContainer}>{renderStateIcon()}</View>
      </View>

      <View style={styles.content}>
        {summary && <Text style={styles.summary}>{summary}</Text>}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsInputParamsModalVisible(true)}
          >
            <Text style={styles.buttonText}>View Input Params</Text>
          </TouchableOpacity>

          {fileContent && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsFileContentModalVisible(true)}
            >
              <Text style={styles.buttonText}>View File Content</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ModalContent
        title="Input Parameters"
        description="View the input parameters for this tool invocation"
        content={inputObject}
        visible={isInputParamsModalVisible}
        onClose={() => setIsInputParamsModalVisible(false)}
      />

      <ModalContent
        title="File Content"
        description="View the content of the file returned by this tool"
        content={fileContent}
        visible={isFileContentModalVisible}
        onClose={() => setIsFileContentModalVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: typography.primary.bold,
    color: colors.text,
    marginRight: 8,
  },
  repoInfo: {
    fontSize: 12,
    fontFamily: typography.primary.normal,
    color: colors.textDim,
  },
  statusContainer: {
    marginLeft: 8,
  },
  content: {
    padding: 12,
  },
  summary: {
    fontSize: 12,
    fontFamily: typography.primary.normal,
    color: colors.text,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    backgroundColor: colors.background,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: typography.primary.normal,
    color: colors.text,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: typography.primary.normal,
    color: colors.text,
    marginBottom: 4,
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: typography.primary.normal,
    color: colors.textDim,
    marginBottom: 12,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  preText: {
    fontFamily: typography.primary.normal,
    fontSize: 12,
    color: colors.text,
  },
  closeButton: {
    marginTop: 16,
    alignItems: "center",
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  closeButtonText: {
    color: colors.text,
    fontFamily: typography.primary.normal,
    fontSize: 14,
  },
  errorText: {
    color: colors.error,
    fontFamily: typography.primary.normal,
    fontSize: 12,
  },
  pendingText: {
    color: colors.textDim,
    fontFamily: typography.primary.normal,
    fontSize: 18,
  },
  completedText: {
    color: colors.text,
    fontFamily: typography.primary.normal,
    fontSize: 18,
  },
  failedText: {
    color: colors.error,
    fontFamily: typography.primary.normal,
    fontSize: 18,
  },
})
