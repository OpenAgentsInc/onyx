import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 500,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  modelItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modelInfo: {
    flex: 1,
    marginRight: 10,
  },
  modelNameContainer: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: "500",
  },
  modelSize: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  activeIndicator: {
    color: "#4CAF50",
  },
  downloadButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  errorContainer: {
    backgroundColor: "#FFE5E5",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  errorText: {
    color: "#D00",
    fontSize: 14,
  },
  modelError: {
    color: "#D00",
    fontSize: 12,
    marginTop: 2,
  },
  downloadContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cancelButton: {
    backgroundColor: "#EEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
  },
})