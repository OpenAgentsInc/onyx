import { StyleSheet } from "react-native"
import { typography } from "@/theme/typography"

export const styles = StyleSheet.create({
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