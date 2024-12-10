import React, { useContext, useState } from "react"
import { TouchableOpacity, View, ViewStyle, Text } from "react-native"
import { RelayContext } from "./RelayProvider"
import { Event } from "nostr-tools"
import { DVMManager } from "@/services/nostr/dvm"

export const DVMButton = () => {
  const { pool } = useContext(RelayContext)
  const [responses, setResponses] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendJobRequest = async () => {
    if (!pool) return
    setIsLoading(true)

    const dvmManager = new DVMManager(pool)
    
    // Create a simple text generation job request
    const jobRequest = {
      kind: 5001, // Text generation
      content: "Hello DVM!",
      tags: [
        ["i", "Generate a haiku about artificial intelligence", "text", "", ""],
        ["bid", "100"], // 100 sats
        ["output", "text"]
      ],
      created_at: Math.floor(Date.now() / 1000)
    }

    try {
      // Subscribe to responses first
      const sub = dvmManager.subscribeToJobs((event) => {
        // Only show responses to our request
        if (event.tags.some(t => t[0] === "e" && t[1] === jobRequest.id)) {
          setResponses(prev => [...prev, event])
        }
      })

      // Publish the request
      await pool.publish(jobRequest)

      // Clean up subscription after 30 seconds
      setTimeout(() => {
        sub.unsub()
        setIsLoading(false)
      }, 30000)
    } catch (e) {
      console.error("Error sending job request:", e)
      setIsLoading(false)
    }
  }

  return (
    <View style={$container}>
      <TouchableOpacity 
        style={$button}
        onPress={sendJobRequest}
        disabled={isLoading}
      >
        <Text style={$buttonText}>
          {isLoading ? "Waiting for DVMs..." : "Send DVM Request"}
        </Text>
      </TouchableOpacity>

      {responses.map((response, i) => (
        <View key={response.id} style={$response}>
          <Text style={$responseText}>
            {response.content}
          </Text>
        </View>
      ))}
    </View>
  )
}

const $container: ViewStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: [{ translateX: -100 }, { translateY: -25 }],
  width: 200,
  alignItems: "center",
}

const $button: ViewStyle = {
  backgroundColor: "#333",
  padding: 16,
  borderRadius: 8,
  width: "100%",
  alignItems: "center",
}

const $buttonText = {
  color: "#fff",
  fontSize: 16,
}

const $response: ViewStyle = {
  backgroundColor: "rgba(255,255,255,0.1)",
  padding: 12,
  borderRadius: 6,
  marginTop: 12,
  width: "100%",
}

const $responseText = {
  color: "#fff",
  fontSize: 14,
}