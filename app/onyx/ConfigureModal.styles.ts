import { StyleSheet } from "react-native"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"

export const styles = StyleSheet.create({
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
})