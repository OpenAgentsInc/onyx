import { observer } from "mobx-react-lite"
import React from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable } from "react-native"
import { useStores } from "../models/_helpers/useStores"
import { colors } from "../theme"
import { typography } from "../theme"
import { styles as baseStyles } from "./styles"

interface ConfigureModalProps {
  visible: boolean
  onClose: () => void
}

export const ConfigureModal = observer(({ visible, onClose }: ConfigureModalProps) => {
  const { chatStore } = useStores()

  const handleModelChange = (model: "groq" | "gemini") => {
    chatStore.setActiveModel(model)
    onClose()
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
            <Text style={[baseStyles.buttonText, baseStyles.cancelText, styles.text]}>Close</Text>
          </Pressable>
        </View>

        <Text style={[styles.title, styles.text]}>Configure</Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.text]}>Active Model</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                chatStore.activeModel === "groq" && styles.buttonActive
              ]}
              onPress={() => handleModelChange("groq")}
            >
              <Text style={[styles.buttonText, styles.text]}>Groq</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                chatStore.activeModel === "gemini" && styles.buttonActive
              ]}
              onPress={() => handleModelChange("gemini")}
            >
              <Text style={[styles.buttonText, styles.text]}>Gemini</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  text: {
    fontFamily: typography.primary.normal,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
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
    opacity: 0.7,
  },
  buttonActive: {
    opacity: 1,
  },
  buttonText: {
    color: colors.palette.neutral100,
    fontWeight: "bold",
  },
})