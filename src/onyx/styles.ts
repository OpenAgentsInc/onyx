import { StyleSheet } from "react-native"
import { typography } from "@/theme"

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: typography.primary.normal,
  },
  cancelText: {
    color: "#666",
  },
  sendText: {
    color: "#fff",
  },
  disabledText: {
    color: "#666",
  },
  input: {
    color: "#fff",
    fontSize: 17,
    paddingHorizontal: 20,
    paddingTop: 0,
    fontFamily: typography.primary.normal,
  },
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
  // Voice recording styles
  voiceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  transcriptionText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: typography.primary.normal,
    textAlign: "center",
    lineHeight: 36,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    fontFamily: typography.primary.normal,
    textAlign: "center",
    paddingHorizontal: 20,
  },
})