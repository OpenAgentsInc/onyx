import { StyleSheet } from "react-native"

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
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF4444",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  recordingButton: {
    backgroundColor: "#FF0000",
    transform: [{ scale: 1.1 }],
  },
  recordButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  transcribingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  transcribingText: {
    color: "#FFFFFF",
    marginLeft: 10,
    fontSize: 16,
  },
  listeningText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 10,
  },
  transcriptionText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    width: "100%",
  },
  placeholderText: {
    color: "#999999",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
})