import { registerRootComponent } from "expo"
import * as Linking from "expo-linking"
import * as React from "react"
import { Button, ScrollView, StyleSheet, Text, View } from "react-native"
import Config from "./config"
import { useAutoUpdate } from "./hooks/useAutoUpdate"
import { githubAuth } from "./lib/auth/githubAuth"
import { wsManager } from "./lib/ws/manager"

export default function App() {
  useAutoUpdate();
  const [messages, setMessages] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    checkAuthState();
    setupDeepLinks();
    return () => {
      wsManager.cleanup();
    };
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      initializeWebSocket();
    }
  }, [isAuthenticated]);

  const checkAuthState = async () => {
    const token = await githubAuth.getToken();
    setIsAuthenticated(!!token);
  };

  const setupDeepLinks = () => {
    // Handle initial URL
    Linking.getInitialURL().then(handleDeepLink);

    // Handle deep links while app is running
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  };

  const handleDeepLink = async (url: string | null) => {
    if (!url) return;
    console.log("[App] Handling deep link:", url);
    const { queryParams } = Linking.parse(url);

    // Handle direct token
    if (queryParams?.token) {
      try {
        await githubAuth.setToken(queryParams.token as string);
        setIsAuthenticated(true);
        setError(null);
      } catch (error) {
        console.error("[App] Auth error:", error);
        setError("Authentication failed. Please try again.");
      }
    }
  };

  const handleLogin = async () => {
    try {
      setError(null);
      await githubAuth.login();
    } catch (error) {
      console.error("[App] Login error:", error);
      setError("Failed to start login flow. Please try again.");
    }
  };

  const initializeWebSocket = () => {
    if (Config.WS_URL) {
      wsManager.initialize(Config.WS_URL);

      // Set up message handler with chunk aggregation
      const unsubscribeMessage = wsManager.onMessage((data: string) => {
        console.log("Received message:", data);
        const chunkRegex = /^CHUNK\s*#\d+:\s*/i;
        setMessages((prev) => {
          if (chunkRegex.test(data)) {
            // Remove the "CHUNK #x:" prefix
            const chunkText = data.replace(chunkRegex, "");
            if (prev.length > 0) {
              // Append the chunk text to the last message
              const lastMessage = prev[prev.length - 1];
              return [...prev.slice(0, -1), lastMessage + chunkText];
            } else {
              return [chunkText];
            }
          } else {
            // Regular message: add new entry
            return [...prev, data];
          }
        });
        // Scroll to the bottom after updating messages
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
        setError(null);
      });

      const unsubscribeError = wsManager.onError((error: string) => {
        console.error("WebSocket error:", error);
        setError(error);
        if (error.includes("Authentication failed")) {
          setIsAuthenticated(false);
        }
      });

      // Return cleanup function if needed later
      return () => {
        unsubscribeMessage();
        unsubscribeError();
        wsManager.cleanup();
      };
    }
  };

  const handleSolveDemo = () => {
    const message = {
      type: "solve_demo_repo",
      timestamp: new Date().toISOString(),
    };
    console.log("[App] Sending solve demo message:", message);
    wsManager.sendMessage(message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>WebSocket App</Text>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageContainer}
          contentContainerStyle={styles.messageContent}
        >
          {messages.map((msg, index) => (
            <Text key={index} style={styles.message}>
              {msg}
            </Text>
          ))}
        </ScrollView>
      )}

      {!isAuthenticated ? (
        <Button title="Login with GitHub" onPress={handleLogin} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Solve Demo" onPress={handleSolveDemo} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 50,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  messageContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  messageContent: {
    paddingVertical: 10,
  },
  message: {
    fontSize: 16,
    color: "white",
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 8,
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    padding: 20,
  },
});

registerRootComponent(App);
