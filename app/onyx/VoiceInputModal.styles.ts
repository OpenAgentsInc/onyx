import { StyleSheet } from "react-native"
import { typography } from "@/theme/typography"

export const styles = StyleSheet.create({
  voiceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  transcriptionContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  listeningContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: -120,
    height: 110
  },
  listeningText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: typography.primary.normal,
    marginRight: 10,
  },
  placeholderText: {
    color: "#999999",
    fontSize: 16,
    fontFamily: typography.primary.normal,
    textAlign: "center",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 16,
    fontFamily: typography.primary.normal,
    textAlign: "center",
  },
})
