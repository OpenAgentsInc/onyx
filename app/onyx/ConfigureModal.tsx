import React from "react"
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { styles as baseStyles } from "./styles"
import { styles as configureStyles } from "./ConfigureModal.styles"
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
      <View style={baseStyles.modalContainer}>
        <View style={baseStyles.modalContent}>
          <View style={baseStyles.modalHeader}>
            <Text style={baseStyles.headerTitle}>Configure Models</Text>
            <TouchableOpacity onPress={onClose} style={configureStyles.closeButton}>
              <Text style={baseStyles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {llmStore.error && (
              <View style={baseStyles.errorContainer}>
                <Text style={baseStyles.errorText}>{llmStore.error}</Text>
              </View>
            )}

            <View style={configureStyles.section}>
              <Text style={configureStyles.sectionTitle}>Model Selection</Text>
              {llmStore.models.map((model) => (
                <View key={model.key} style={configureStyles.modelItem}>
                  <TouchableOpacity
                    style={configureStyles.modelInfo}
                    onPress={() => model.status === "ready" && handleSelect(model.key)}
                    disabled={model.status !== "ready"}
                  >
                    <View style={configureStyles.modelNameContainer}>
                      <Text style={configureStyles.modelName}>
                        {model.displayName}
                        {model.key === llmStore.selectedModelKey && (
                          <Text style={configureStyles.activeIndicator}> ✓</Text>
                        )}
                      </Text>
                      {model.error && (
                        <Text style={configureStyles.modelError}>{model.error}</Text>
                      )}
                    </View>
                    <Text style={configureStyles.modelSize}>
                      {model.status === "downloading" 
                        ? `${model.progress.toFixed(1)}%` 
                        : ""}
                    </Text>
                  </TouchableOpacity>

                  <View style={configureStyles.modelActions}>
                    {model.status === "idle" && (
                      <TouchableOpacity
                        style={configureStyles.actionButton}
                        onPress={() => handleDownload(model.key)}
                      >
                        <Text style={configureStyles.actionButtonText}>Download</Text>
                      </TouchableOpacity>
                    )}

                    {model.status === "downloading" && (
                      <TouchableOpacity
                        style={configureStyles.actionButton}
                        onPress={() => handleCancel(model.key)}
                      >
                        <Text style={configureStyles.actionButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    )}

                    {(model.status === "ready" || model.status === "error") && (
                      <TouchableOpacity
                        style={configureStyles.actionButton}
                        onPress={() => handleDelete(model.key)}
                      >
                        <Text style={configureStyles.actionButtonText}>Delete</Text>
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