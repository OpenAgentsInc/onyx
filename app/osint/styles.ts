import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
    margin: 20, // Add margin around the chat window
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    padding: 20,
    paddingTop: 0, // Remove top padding since CardFooter has its own
  },
  scrollView: {
    flex: 1,
  },
})