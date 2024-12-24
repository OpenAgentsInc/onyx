import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  bottomButtons: {
    position: "absolute",
    bottom: 70,
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
  trashButton: {
    width: 24,
    height: 24,
    position: "absolute",
    right: 35,
    bottom: 86,
    zIndex: 10,
  },
  toolsButton: {
    width: 24,
    height: 24,
    position: "absolute",
    left: 35,
    bottom: 86,
    zIndex: 10,
  },
})