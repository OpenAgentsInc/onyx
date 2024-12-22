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

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 60, // Changed from marginTop to paddingTop
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
    fontFamily: typography.primary.semiBold,
    color: "#fff",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: typography.primary.medium,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    marginBottom: 16,
    color: "rgba(255,255,255,0.5)",
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
    fontFamily: typography.primary.normal,
    color: "#fff",
  },
  modelSize: {
    fontSize: 14,
    fontFamily: typography.primary.normal,
    color: "rgba(255,255,255,0.5)",
    marginTop: 4,
  },
  activeIndicator: {
    color: colors.tint,
    fontFamily: typography.primary.medium,
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
  errorContainer: {
    backgroundColor: colors.errorBackground,
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: typography.primary.normal,
  },
  modelError: {
    color: colors.error,
    fontSize: 12,
    fontFamily: typography.primary.normal,
    marginTop: 2,
  },
  downloadContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    fontFamily: typography.primary.normal,
  },

  // Text Input Modal styles
  buttonText: {
    fontSize: 17,
    fontFamily: typography.primary.normal,
  },
  cancelText: {
    color: "#fff",
  },
  sendText: {
    color: "#fff",
  },
  disabledText: {
    color: "rgba(255,255,255,0.5)",
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
