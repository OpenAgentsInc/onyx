import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useStores } from "../models/_helpers/useStores"
import { colors, typography } from "../theme"
import { styles as baseStyles } from "./styles"

interface ConfigureModalProps {
  visible: boolean
  onClose: () => void
}

export const ConfigureModal = observer(({ visible, onClose }: ConfigureModalProps) => {
  const { chatStore, coderStore } = useStores()
  const [githubToken, setGithubToken] = useState(coderStore.githubToken)

  const handleModelChange = (model: "groq" | "gemini") => {
    chatStore.setActiveModel(model)
  }

  const handleSave = () => {
    coderStore.setGithubToken(githubToken)
    onClose()
  }

  const handleToolsToggle = () => {
    chatStore.setToolsEnabled(!chatStore.toolsEnabled)
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={[baseStyles.modalContainer, styles.container]}>
        <View style={baseStyles.modalHeader}>
          <Pressable onPress={onClose}>
            <Text style={[baseStyles.buttonText, baseStyles.cancelText, styles.text]}>Cancel</Text>
          </Pressable>
          <Pressable onPress={handleSave}>
            <Text style={[baseStyles.buttonText, styles.text, { color: "white" }]}>Save</Text>
          </Pressable>
        </View>

        <Text style={[styles.title, styles.text]}>Configure</Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.text]}>Active Model</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, chatStore.activeModel === "groq" && styles.buttonActive]}
              onPress={() => handleModelChange("groq")}
            >
              <Text style={[styles.buttonText, styles.text]}>Groq</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, chatStore.activeModel === "gemini" && styles.buttonActive]}
              onPress={() => handleModelChange("gemini")}
            >
              <Text style={[styles.buttonText, styles.text]}>Gemini</Text>
            </TouchableOpacity>
          </View>
        </View>

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
          <Text style={[styles.sectionTitle, styles.text]}>Tools</Text>
          <TouchableOpacity
            style={[styles.button, chatStore.toolsEnabled && styles.buttonActive]}
            onPress={handleToolsToggle}
          >
            <Text style={[styles.buttonText, styles.text]}>
              {chatStore.toolsEnabled ? "Enabled" : "Disabled"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "black",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.text,
  },
  text: {
    fontFamily: typography.primary.normal,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
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
    opacity: 0.5,
  },
  buttonActive: {
    opacity: 1,
  },
  buttonText: {
    color: colors.palette.neutral100,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: colors.palette.neutral50,
    color: colors.text,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.palette.neutral700,
  },
})