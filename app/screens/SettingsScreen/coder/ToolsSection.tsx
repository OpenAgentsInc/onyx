import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useStores } from "@/models"
import { styles } from "./styles"
import { AVAILABLE_TOOLS } from "./types"

export const ToolsSection = () => {
  const { chatStore } = useStores()

  const handleToolToggle = (toolId: string) => {
    chatStore.toggleTool(toolId)
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, styles.text]}>Available Tools</Text>
      {AVAILABLE_TOOLS.map((tool) => (
        <TouchableOpacity
          activeOpacity={0.8}
          key={tool.id}
          style={[styles.toolButton, chatStore.isToolEnabled(tool.id) && styles.buttonActive]}
          onPress={() => handleToolToggle(tool.id)}
        >
          <View style={styles.toolButtonContent}>
            <View style={styles.toolTextContainer}>
              <Text style={[styles.toolName, styles.text]}>{tool.name}</Text>
              <Text style={[styles.toolDescription, styles.text]}>{tool.description}</Text>
            </View>
            <View
              style={[
                styles.checkbox,
                chatStore.isToolEnabled(tool.id) && styles.checkboxActive,
              ]}
            >
              {chatStore.isToolEnabled(tool.id) && (
                <Text style={[styles.checkmark, styles.text]}>✓</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}