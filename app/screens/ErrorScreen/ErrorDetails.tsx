import { ErrorInfo } from "react"
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo | null
  onReset(): void
}

/**
 * Renders the error details screen.
 * @param {ErrorDetailsProps} props - The props for the `ErrorDetails` component.
 * @returns {JSX.Element} The rendered `ErrorDetails` component.
 */
export function ErrorDetails(props: ErrorDetailsProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.topSection}>
          <Text style={styles.emoji}>🐞</Text>
          <Text style={styles.heading}>Error</Text>
          <Text style={styles.subtitle}>Something went wrong. Please try again later.</Text>
        </View>

        <ScrollView style={styles.errorSection} contentContainerStyle={styles.errorSectionContent}>
          <Text style={styles.errorContent}>{`${props.error}`.trim()}</Text>
          <Text selectable style={styles.errorBacktrace}>
            {`${props.errorInfo?.componentStack ?? ""}`.trim()}
          </Text>
        </ScrollView>

        <TouchableOpacity style={styles.resetButton} onPress={props.onReset}>
          <Text style={styles.resetButtonText}>Reset App</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  topSection: {
    flex: 1,
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    color: "#dc3545",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorSection: {
    flex: 2,
    backgroundColor: "#f8f9fa",
    marginVertical: 16,
    borderRadius: 6,
    width: "100%",
  },
  errorSectionContent: {
    padding: 16,
  },
  errorContent: {
    color: "#dc3545",
  },
  errorBacktrace: {
    marginTop: 16,
    color: "#6c757d",
  },
  resetButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
  },
})
