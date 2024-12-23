import { StyleSheet } from "react-native"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"

export const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: "#000",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
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
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    color: "#666",
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
  modelNameContainer: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    color: "#fff",
  },
  activeIndicator: {
    color: colors.tint,
    fontFamily: typography.primary.medium,
  },
  modelSize: {
    fontSize: 14,
    fontFamily: typography.primary.normal,
    color: "#666",
  },
  modelError: {
    fontSize: 14,
    fontFamily: typography.primary.normal,
    color: colors.error,
    marginTop: 4,
  },
  downloadContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#fff",
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
})