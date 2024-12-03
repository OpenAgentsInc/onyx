import { FC } from "react"
import { Modal, Pressable, StyleSheet, View } from "react-native"
import { Text } from "./Text"
import * as Clipboard from 'expo-clipboard'

interface MessageMenuProps {
  visible: boolean
  onClose: () => void
  onDelete: () => void
  messageContent: string
}

export const MessageMenu: FC<MessageMenuProps> = ({ visible, onClose, onDelete, messageContent }) => {
  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(messageContent)
      onClose()
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menu}>
          <Pressable
            style={styles.menuItem}
            onPress={handleCopy}
          >
            <Text style={styles.menuText}>Copy Message</Text>
          </Pressable>
          <Pressable
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={() => {
              onDelete()
              onClose()
            }}
          >
            <Text style={[styles.menuText, styles.deleteText]}>Delete Message</Text>
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
  },
  menu: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    minWidth: 200,
    overflow: "hidden",
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuText: {
    color: "#fff",
    textAlign: "center",
  },
  deleteText: {
    color: "#ff4444",
  },
})