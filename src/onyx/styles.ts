import { StyleSheet } from "react-native"
import { typography } from "@/theme"
import { colors } from "@/theme/colors"

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "50%",
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: typography.primary.normal,
  },
  cancelText: {
    color: "#666",
  },
  sendText: {
    color: "#fff",
  },
  disabledText: {
    color: "#666",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 17,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    fontFamily: typography.primary.normal,
  },
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
  // Voice recording styles
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
    color: "#888",
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
    color: "#666",
    fontSize: 24,
    fontFamily: typography.primary.normal,
    textAlign: "center",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    fontFamily: typography.primary.normal,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  // Configure modal styles
  configureModalContent: {
    height: "50%",
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  configureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 16,
    fontFamily: typography.primary.medium,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonDisabled: {
    opacity: 0.5,
  },
  closeButtonText: {
    color: colors.tint,
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
  closeButtonTextDisabled: {
    color: colors.textDim,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    color: colors.textDim,
    fontSize: 14,
    fontFamily: typography.primary.medium,
    marginBottom: 12,
  },
  modelItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modelInfo: {
    flex: 1,
    marginRight: 16,
  },
  modelName: {
    color: colors.text,
    fontSize: 14,
    fontFamily: typography.primary.normal,
  },
  activeIndicator: {
    color: colors.tint,
    fontFamily: typography.primary.medium,
  },
  modelSize: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: typography.primary.normal,
    marginTop: 2,
  },
  downloadButton: {
    backgroundColor: colors.tint,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  downloadingButton: {
    backgroundColor: colors.palette.neutral300,
  },
  downloadButtonText: {
    color: colors.background,
    fontFamily: typography.primary.medium,
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: colors.errorBackground,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  deleteButtonText: {
    color: colors.error,
    fontFamily: typography.primary.medium,
    fontSize: 12,
  },
  storageInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  storageText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: typography.primary.normal,
  },
})