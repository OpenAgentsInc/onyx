import { StyleSheet } from "react-native"
import { colors } from "@/theme/colors"

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

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: 60, // Add safe area padding for status bar
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: colors.tint,
    fontSize: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: colors.textDim,
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
  modelNameContainer: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    color: colors.text,
  },
  modelSize: {
    fontSize: 14,
    color: colors.textDim,
    marginTop: 4,
  },
  activeIndicator: {
    color: colors.tint,
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
    color: colors.background,
    fontSize: 14,
    fontWeight: "500",
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
    fontWeight: "500",
  },
  errorContainer: {
    backgroundColor: colors.errorBackground,
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  modelError: {
    color: colors.error,
    fontSize: 12,
    marginTop: 2,
  },
  downloadContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cancelButton: {
    backgroundColor: colors.palette.neutral300,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.textDim,
    fontSize: 14,
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
    marginBottom: 20,
  },
  transcriptionText: {
    color: colors.text,
    fontSize: 24,
    textAlign: "center",
    lineHeight: 36,
  },
  placeholderText: {
    color: colors.textDim,
    fontSize: 24,
    textAlign: "center",
  },
})