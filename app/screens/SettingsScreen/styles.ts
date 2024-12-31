import { StyleSheet } from "react-native"
import { colorsDark as colors, typography } from "@/theme"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.palette.neutral50,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  button: {
    backgroundColor: colors.backgroundSecondary,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: colors.palette.neutral800,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: typography.primary.normal,
  },
  menuItem: {
    backgroundColor: colors.backgroundSecondary,
    padding: 16,
    borderRadius: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.palette.neutral300,
  },
  menuItemText: {
    color: colors.palette.neutral800,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: typography.primary.normal,
  },
  text: {
    fontFamily: typography.primary.normal,
    color: colors.palette.neutral800,
  },
})