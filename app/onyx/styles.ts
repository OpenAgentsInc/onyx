import { StyleSheet } from "react-native"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"

export const styles = StyleSheet.create({
  // Layout styles
  bottomButtons: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    zIndex: 8,
  },
  iconButton: {
    width: 56,
    height: 56,
  },
  configureButton: {
    width: 40,
    height: 40,
    position: "absolute",
    right: 20,
    top: 70,
    zIndex: 10,
  },

  // Chat Overlay styles
  chatOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 150,
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

  // Modal styles
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

  // Input styles
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

  // Configure Modal styles
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 12,
  },
  modelItem: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modelInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modelName: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    color: "#fff",
  },
  modelStatus: {
    fontSize: 14,
    fontFamily: typography.primary.normal,
    color: "rgba(255,255,255,0.5)",
  },
  modelProgress: {
    fontSize: 14,
    fontFamily: typography.primary.normal,
    color: colors.tint,
    marginTop: 4,
  },
  modelError: {
    fontSize: 14,
    fontFamily: typography.primary.normal,
    color: colors.error,
    marginTop: 4,
  },
  modelActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
    color: "#fff",
  },
  selectedButton: {
    backgroundColor: colors.tint,
  },
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

  // Additional styles for ConfigureModal
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: typography.primary.medium,
  },
  modelNameContainer: {
    flex: 1,
  },
  activeIndicator: {
    color: colors.tint,
    fontFamily: typography.primary.medium,
  },
  modelSize: {
    fontSize: 14,
    fontFamily: typography.primary.normal,
    color: "rgba(255,255,255,0.5)",
    marginTop: 4,
  },
  downloadButton: {
    backgroundColor: colors.tint,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#000",
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
  deleteButton: {
    backgroundColor: colors.errorBackground,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },

  // Voice Modal styles
  voiceContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  transcriptionContainer: {
    flex: 1,
    alignItems: "center",
  },
  listeningText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    fontFamily: typography.primary.normal,
    marginBottom: 20,
  },
  transcriptionText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: typography.primary.normal,
    textAlign: "center",
    lineHeight: 36,
  },
  placeholderText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 24,
    fontFamily: typography.primary.normal,
    textAlign: "center",
  },
})