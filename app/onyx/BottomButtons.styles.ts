import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    gap: 20,
  },
  iconButton: {
    width: 50,
    height: 50,
  },
  toolsButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  reposButton: {
    position: "absolute",
    top: 20,
    right: 60,
    zIndex: 1,
  },
  configureButton: {
    position: "absolute",
    top: 20,
    right: 100,
    zIndex: 1,
  },
  copyButton: {
    position: "absolute",
    top: 20,
    right: 140,
    zIndex: 1,
  },
  trashButton: {
    position: "absolute",
    top: 20,
    right: 180,
    zIndex: 1,
  },
})