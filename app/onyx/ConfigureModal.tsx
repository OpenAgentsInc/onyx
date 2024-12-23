import React from "react"
import { Modal, Text, TouchableOpacity, View } from "react-native"
import { styles } from "./styles"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"
import { IModelInfo } from "@/models/llm/LLMStore"

interface ConfigureModalProps {
  visible: boolean
  onClose: () => void
}

export const ConfigureModal = observer(({ visible, onClose }: ConfigureModalProps) => {
  const { llmStore } = useStores()

  const handleDownload = async (modelKey: string) => {
    const model = llmStore.models.find((m: IModelInfo) => m.key === modelKey)
    if (!model) return

    if (model.status === "idle") {
      await llmStore.startModelDownload(modelKey)
    }
  }

  const handleCancel = async (modelKey: string) => {
    const model = llmStore.models.find((m: IModelInfo) => m.key === modelKey)
    if (!model) return

    if (model.status === "downloading") {
      await llmStore.cancelModelDownload(modelKey)
    }
  }

  const handleDelete = async (modelKey: string) => {
    const model = llmStore.models.find((m: IModelInfo) => m.key === modelKey)
    if (!model) return

    if (model.status === "ready" || model.status === "error") {
      await llmStore.deleteModel(modelKey)
    }
  }

  const handleSelect = async (modelKey: string) => {
    const model = llmStore.models.find((m: IModelInfo) => m.key === modelKey)
    if (!model) return

    if (model.status === "ready") {
      await llmStore.selectModel(modelKey)
      onClose()
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Configure Models</Text>

          {llmStore.models.map((model) => (
            <View key={model.key} style={styles.modelItem}>
              <Text style={styles.modelName}>{model.displayName}</Text>
              <Text style={styles.modelStatus}>{model.status}</Text>
              {model.progress > 0 && model.progress < 100 && (
                <Text style={styles.modelProgress}>{model.progress}%</Text>
              )}
              {model.error && (
                <Text style={styles.modelError}>{model.error}</Text>
              )}

              <View style={styles.modelActions}>
                {model.status === "idle" && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDownload(model.key)}
                  >
                    <Text style={styles.actionButtonText}>Download</Text>
                  </TouchableOpacity>
                )}

                {model.status === "downloading" && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCancel(model.key)}
                  >
                    <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                )}

                {(model.status === "ready" || model.status === "error") && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(model.key)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}

                {model.status === "ready" && (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      model.key === llmStore.selectedModelKey && styles.selectedButton
                    ]}
                    onPress={() => handleSelect(model.key)}
                  >
                    <Text style={styles.actionButtonText}>
                      {model.key === llmStore.selectedModelKey ? "Selected" : "Select"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
})