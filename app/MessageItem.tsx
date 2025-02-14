import "@/utils/ignore-warnings"
import { registerRootComponent } from "expo"
import * as Clipboard from "expo-clipboard"
import * as Linking from "expo-linking"
import * as React from "react"
import { Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native"
import Config from "./config"
import { useAutoUpdate } from "./hooks/useAutoUpdate"
import { githubAuth } from "./lib/auth/githubAuth"
import { wsManager } from "./lib/ws/manager"
import MessageList from "./MessageList"

export default function App() {
  useAutoUpdate();
  const [messages, setMessages] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  // Use a ref to accumulate chunked messages
  const pendingMessageRef = React.useRef<string>("");

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

        // Only treat messages as chunks if they match the chunk regex.
        const chunkRegex = /^CHUNK\s*#\d+:\s*/i;
        const isChunk = chunkRegex.test(data);

        if (isChunk) {
          // Remove the chunk prefix and trim whitespace.
          const cleaned = data.replace(chunkRegex, "").trim();
          // Append with a space separator to any pending message.
          if (pendingMessageRef.current) {
            pendingMessageRef.current += " " + cleaned;
          } else {
            pendingMessageRef.current = cleaned;
          }
          // Update the last message in the messages array
          setMessages((prev) => {
            if (prev.length === 0) {
              return [pendingMessageRef.current];
            } else {
              const newArr = [...prev];
              newArr[newArr.length - 1] = pendingMessageRef.current;
              return newArr;
            }
          });
        } else {
          // Flush any pending chunks and add the new message as a fresh entry.
          pendingMessageRef.current = "";
          setMessages((prev) => [...prev, data]);
        }
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

  const copyAllMessages = () => {
    const allMessages = messages.join("\n\n");
    Clipboard.setString(allMessages);
    Alert.alert("Copied", "All messages have been copied to the clipboard.");
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <MessageList messages={messages} ref={scrollViewRef} />
      )}
      <View style={styles.copyButtonContainer}>
        <Button title="Copy All Messages" onPress={copyAllMessages} />
      </View>
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
  copyButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

registerRootComponent(App);
