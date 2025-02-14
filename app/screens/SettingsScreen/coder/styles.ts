import { StyleSheet } from "react-native"
import { colorsDark as colors, typography } from "@/theme"

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80, // Added extra padding for status bar
    backgroundColor: colors.palette.neutral50, // Darkest background
  },
  closeButton: {
    position: "absolute",
    top: -20, // Adjusted for status bar
    right: 0,
    zIndex: 1,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    marginTop: 16,
    color: colors.palette.neutral800, // Light text
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: colors.palette.neutral600, // Dimmer text
    lineHeight: 20,
  },
  text: {
    fontFamily: typography.primary.normal,
    color: colors.palette.neutral800, // Light text
  },
  section: {
    marginBottom: 20,
  },
  lastSection: {
    marginBottom: 40, // Extra padding at the bottom for scrolling
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.palette.neutral800, // Light text
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: colors.palette.neutral200,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    opacity: 0.8,
  },
  addButtonText: {
    color: colors.palette.neutral800,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.backgroundSecondary, // Dark input background
    color: colors.palette.neutral800, // Light text
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.palette.neutral300,
    marginBottom: 10,
  },
  repoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  button: {
    backgroundColor: colors.backgroundSecondary, // Dark button background
    padding: 10,
    borderRadius: 5,
    opacity: 0.5,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.palette.neutral200,
    opacity: 1,
  },
  repoButton: {
    flex: 1,
  },
  buttonActive: {
    opacity: 1,
  },
  buttonEditing: {
    borderColor: colors.palette.neutral400,
    borderWidth: 2,
    opacity: 1,
  },
  buttonText: {
    color: colors.palette.neutral800, // Light text
  },
  branchText: {
    color: colors.palette.neutral600, // Dimmer text
    fontSize: 12,
    opacity: 0.8,
  },
  deleteButton: {
    backgroundColor: colors.palette.angry500,
    minWidth: 80,
  },
  editButton: {
    backgroundColor: colors.palette.neutral200,
    minWidth: 80,
  },
  cancelEditButton: {
    backgroundColor: colors.palette.neutral300,
    flex: 1,
  },
  toolButton: {
    backgroundColor: colors.backgroundSecondary, // Dark tool button background
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
  },
  toolButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toolTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  toolName: {
    color: colors.palette.neutral800, // Light text
    fontSize: 16,
    marginBottom: 4,
  },
  toolDescription: {
    color: colors.palette.neutral600, // Dimmer text
    fontSize: 12,
    fontFamily: typography.primary.normal,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.palette.neutral400,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.palette.neutral200, // Dark checkbox background
  },
  checkboxActive: {
    backgroundColor: colors.palette.neutral300,
    borderColor: colors.palette.neutral400,
  },
  checkmark: {
    color: colors.palette.neutral800, // Light text
    fontSize: 16,
  },
})
