import { StyleSheet } from "react-native"
import { colorsDark as colors } from "@/theme"

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: "600",
  },
  menuItem: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    color: colors.text,
  },
})