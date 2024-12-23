import React from "react"
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"
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
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>Configure Models</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {llmStore.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{llmStore.error}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Model Selection</Text>
              {llmStore.models.map((model) => (
                <View key={model.key} style={styles.modelItem}>
                  <TouchableOpacity
                    style={styles.modelInfo}
                    onPress={() => model.status === "ready" && handleSelect(model.key)}
                    disabled={model.status !== "ready"}
                  >
                    <View style={styles.modelNameContainer}>
                      <Text style={styles.modelName}>
                        {model.displayName}
                        {model.key === llmStore.selectedModelKey && (
                          <Text style={styles.activeIndicator}> ✓</Text>
                        )}
                      </Text>
                      {model.error && (
                        <Text style={styles.modelError}>{model.error}</Text>
                      )}
                    </View>
                    <Text style={styles.modelSize}>
                      {model.status === "downloading" 
                        ? `${model.progress.toFixed(1)}%` 
                        : ""}
                    </Text>
                  </TouchableOpacity>

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
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
})