// App.tsx
import "@/utils/ignore-warnings"
import { registerRootComponent } from "expo"
import * as Clipboard from "expo-clipboard"
import * as Linking from "expo-linking"
import React from "react"
import {
  Alert, Pressable, ScrollView, StyleSheet, Text, View
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { AddRepoModal } from "./components/AddRepoModal"
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
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingDetails, setProcessingDetails] = React.useState<string>('');
  const scrollViewRef = React.useRef<ScrollView>(null);
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
      const cleanupWS = initializeWebSocket();
      return () => {
        cleanupWS && cleanupWS();
      };
    }
  }, [isAuthenticated]);

  const checkAuthState = async () => {
    try {
      const token = await githubAuth.getToken();
      setIsAuthenticated(!!token);
    } catch (err) {
      console.error("[App] Error checking auth state:", err);
      setIsAuthenticated(false);
    }
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
    console.log(JSON.stringify({ level: "info", source: "App", msg: "Handling deep link", url }));
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
        console.log(JSON.stringify({ level: "info", source: "App", msg: "Raw received message", data }));
        setIsProcessing(false);
        const chunkRegex = /^CHUNK\s*#\d+:\s*/i;
        const isChunk = chunkRegex.test(data);

        if (isChunk) {
          const cleaned = data.replace(chunkRegex, "").trim();
          pendingMessageRef.current = pendingMessageRef.current
            ? `${pendingMessageRef.current} ${cleaned}`
            : cleaned;
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
          pendingMessageRef.current = "";
          setMessages((prev) => [...prev, data]);
        }
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
        setError(null);
      });

      const unsubscribeError = wsManager.onError((error: string) => {
        console.error(JSON.stringify({ level: "error", source: "App", msg: "WebSocket error", error }));
        setError(error);
        setIsProcessing(false);
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
      type: "solve_repo",
      repository: "bitcoin/bitcoin",
      issue_number: 31873,
      timestamp: new Date().toISOString(),
    };
    console.log("LETS GO SOLVE ", message)
    console.log(JSON.stringify({ level: "info", source: "App", msg: "Sending solve repo message", message }));
    wsManager.sendMessage(message);
  };

  const copyAllMessages = () => {
    const allMessages = messages.join("\n\n");
    Clipboard.setString(allMessages);
    Alert.alert("Copied", "All messages have been copied to the clipboard.");
  };

  const handleAddRepo = (orgName: string, repoName: string, issueNumber: number) => {
    const message = {
      type: "solve_repo",
      repository: `${orgName}/${repoName}`,
      issue_number: issueNumber,
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify({ level: "info", source: "App", msg: "Sending solve repo message", message }));
    setIsProcessing(true);
    setProcessingDetails(`Processing issue #${issueNumber} from ${orgName}/${repoName}`);
    wsManager.sendMessage(message);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <MessageList
          messages={messages}
          ref={scrollViewRef}
          onCopyAll={copyAllMessages}
          isProcessing={isProcessing}
          processingDetails={processingDetails}
        />
      )}
      <View style={styles.bottomBar}>
        <View style={styles.inputBox}>
          <Pressable style={styles.addRepoButton} onPress={() => setIsModalVisible(true)}>
            <MaterialIcons name="add" size={24} color="white" />
            <Text style={styles.buttonText}>Add Repository</Text>
          </Pressable>
          {!isAuthenticated ? (
            <Pressable style={styles.authButton} onPress={handleLogin}>
              <MaterialIcons name="login" size={24} color="white" />
            </Pressable>
          ) : (
            <Pressable style={styles.authButton} onPress={handleSolveDemo}>
              <MaterialIcons name="play-arrow" size={24} color="white" />
            </Pressable>
          )}
        </View>
      </View>
      <AddRepoModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddRepo}
      />
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
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  bottomBar: {
    height: 80,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#202020",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 18,
    height: 48,
    paddingLeft: 16,
    paddingRight: 8,
  },
  addRepoButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  authButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginLeft: 8,
  },
});

registerRootComponent(App);
