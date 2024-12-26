import React, { useState } from "react"
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useStores } from "@/models/_helpers/useStores"
import { colors } from "@/theme"

interface ConfigureModalProps {
  visible: boolean
  onClose: () => void
}

export function ConfigureModal({ visible, onClose }: ConfigureModalProps) {
  const { coderStore, chatStore } = useStores()
  const [githubToken, setGithubToken] = useState(coderStore.githubToken)
  const [toolsEnabled, setToolsEnabled] = useState(chatStore.toolsEnabled)

  const handleSave = () => {
    coderStore.setGithubToken(githubToken)
    chatStore.setToolsEnabled(toolsEnabled)
    onClose()
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Configure Settings</Text>

          <Text style={styles.label}>GitHub Token:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setGithubToken}
            value={githubToken}
            placeholder="Enter GitHub token"
            placeholderTextColor={colors.text}
          />

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, toolsEnabled && styles.checkboxChecked]}
              onPress={() => setToolsEnabled(!toolsEnabled)}
            />
            <Text style={styles.checkboxLabel}>Enable Tools</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    maxWidth: 500,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    color: colors.text,
  },
  input: {
    height: 40,
    width: "100%",
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: colors.border,
    color: colors.text,
  },
  label: {
    alignSelf: "flex-start",
    marginTop: 10,
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: colors.primary,
    minWidth: 100,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
    borderRadius: 3,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxLabel: {
    color: colors.text,
  },
})