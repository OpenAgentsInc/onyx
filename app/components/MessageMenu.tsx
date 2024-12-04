import * as Clipboard from "expo-clipboard"
import { FC } from "react"
import { Modal, Pressable, StyleSheet, View, ScrollView, Dimensions } from "react-native"
import { Text } from "./Text"

interface MessageMenuProps {
  visible: boolean
  onClose: () => void
  messageContent: string
}

export const MessageMenu: FC<MessageMenuProps> = ({ visible, onClose, messageContent }) => {
  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(messageContent)
      onClose()
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const windowHeight = Dimensions.get('window').height

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.menu, { maxHeight: windowHeight * 0.7 }]}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.previewText} numberOfLines={10}>
              {messageContent}
            </Text>
          </ScrollView>
          <View style={styles.divider} />
          <Pressable
            style={styles.menuItem}
            onPress={handleCopy}
          >
            <Text style={styles.menuText}>Copy Message</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  menu: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    width: "100%",
    overflow: "hidden",
  },
  scrollView: {
    maxHeight: 200,
    padding: 16,
  },
  previewText: {
    color: "#999",
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    width: "100%",
  },
  menuItem: {
    padding: 16,
  },
  menuText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
})