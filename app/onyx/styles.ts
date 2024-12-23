import { StyleSheet } from "react-native"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"

export const styles = StyleSheet.create({
  // Shared Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#000",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 200,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: typography.primary.semiBold,
    color: "#fff",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: typography.primary.medium,
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  sendButton: {
    backgroundColor: colors.tint,
  },
  cancelText: {
    color: "#fff",
  },
  sendText: {
    color: "#000",
  },
  disabledText: {
    color: "rgba(255,255,255,0.5)",
  },

  // Shared Input styles
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 17,
    fontFamily: typography.primary.normal,
    minHeight: 100,
    textAlignVertical: "top",
  },

  // Shared error styles
  errorContainer: {
    backgroundColor: colors.errorBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontFamily: typography.primary.normal,
  },

  // Chat Overlay styles
  chatOverlay: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    bottom: 120,
    padding: 20,
    zIndex: 5,
  },
  messageList: {
    flex: 1,
  },
  message: {
    marginBottom: 12,
  },
  messageText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: typography.primary.normal,
  },
})