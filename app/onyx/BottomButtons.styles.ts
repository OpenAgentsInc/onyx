import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  bottomButtons: {
    position: "absolute",
    bottom: 40,
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
    width: 24,
    height: 24,
    position: "absolute",
    left: 75,
    bottom: 56,
    zIndex: 10,
  },
  trashButton: {
    width: 24,
    height: 24,
    position: "absolute",
    right: 20,
    bottom: 56,
    zIndex: 10,
  },
  toolsButton: {
    width: 24,
    height: 24,
    position: "absolute",
    left: 50,
    bottom: 56,
    zIndex: 10,
  },
  reposButton: {
    width: 24,
    height: 24,
    position: "absolute",
    left: 130,
    bottom: 56,
    zIndex: 10,
  },
  copyButton: {
    width: 24,
    height: 24,
    position: "absolute",
    right: 70,
    bottom: 56,
    zIndex: 10,
  },
})
