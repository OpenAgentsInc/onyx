import { StyleSheet } from "react-native"
import { colorsDark as colors, typography } from "@/theme"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  walletButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: typography.primary.medium,
    color: "white",
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "transparent",
  },
  selectedChat: {
    backgroundColor: colors.palette.neutral200,
  },
  chatPreviewText: {
    color: "white",
    fontFamily: typography.primary.medium,
    marginBottom: 4,
  },
  dateText: {
    color: colors.palette.neutral400,
    fontSize: 12,
  },
})
