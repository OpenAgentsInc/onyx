import { FC } from "react"
import { Modal, Pressable, StyleSheet, View } from "react-native"
import { Text } from "./Text"

interface MessageMenuProps {
  visible: boolean
  onClose: () => void
  onDelete: () => void
}

export const MessageMenu: FC<MessageMenuProps> = ({ visible, onClose, onDelete }) => {
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
            onPress={() => {
              onDelete()
              onClose()
            }}
          >
            <Text style={styles.menuText}>Delete Message</Text>
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
  menuText: {
    color: "#fff",
    textAlign: "center",
  },
})