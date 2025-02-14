import "@/utils/ignore-warnings"
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
    Linking.getInitialURL().then(handleDeepLink);
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

      const unsubscribeMessage = wsManager.onMessage((data: string) => {
        console.log("[App] Raw received message:", data);

        // If the message appears unusually empty or with too many CHUNK markers, log a warning.
        if (!data.trim()) {
          console.warn("[App] Received an empty or whitespace-only message.");
        } else if ((data.match(/CHUNK\s*#/gi) || []).length > 2) {
          console.warn("[App] Received message with multiple CHUNK markers:", data);
        }

        // Existing aggregation logic:
        const chunkRegex = /^CHUNK\s*#\d+:\s*/i;
        setMessages((prev) => {
          if (chunkRegex.test(data)) {
            const chunkText = data.replace(chunkRegex, "");
            if (prev.length > 0) {
              const lastMessage = prev[prev.length - 1];
              return [...prev.slice(0, -1), lastMessage + chunkText];
            } else {
              return [chunkText];
            }
          } else {
            return [...prev, data];
          }
        });

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
        setError(null);
      });

      const unsubscribeError = wsManager.onError((error: string) => {
        console.error("[App] WebSocket error:", error);
        setError(error);
        if (error.includes("Authentication failed")) {
          setIsAuthenticated(false);
        }
      });

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
