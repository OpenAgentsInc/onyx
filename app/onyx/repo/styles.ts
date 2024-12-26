import { StyleSheet } from "react-native"
import { colors, typography } from "../../theme"

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.palette.neutral50, // Darkest background
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
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
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.palette.neutral800, // Light text
  },
  input: {
    backgroundColor: colors.palette.neutral200, // Dark input background
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
    backgroundColor: colors.palette.neutral200, // Dark button background
    padding: 10,
    borderRadius: 5,
    opacity: 0.5,
    alignItems: "center",
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
    fontWeight: "bold",
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
  cancelEditButton: {
    backgroundColor: colors.palette.neutral300,
    marginTop: 5,
  },
  toolButton: {
    backgroundColor: colors.palette.neutral200, // Dark tool button background
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
    fontWeight: "bold",
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
    fontWeight: "bold",
  },
})