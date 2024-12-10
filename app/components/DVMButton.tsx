import React, { useContext, useState } from "react"
import { TouchableOpacity, View, ViewStyle, Text } from "react-native"
import { RelayContext } from "./RelayProvider"
import { Event, getEventHash, getPublicKey, signEvent } from "nostr-tools"
import { DVMManager } from "@/services/nostr/dvm"

// TODO: This should come from your key management system
const DEMO_PRIVATE_KEY = "d5770d632a5d2c8fd2c0d3db4dd5f30ea4b37480b89da1695b5d3ca25080fa91"

export const DVMButton = () => {
  const { pool } = useContext(RelayContext)
  const [responses, setResponses] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendJobRequest = async () => {
    if (!pool) return
    setIsLoading(true)

    const dvmManager = new DVMManager(pool)
    
    try {
      // Create unsigned event
      const unsignedEvent = {
        kind: 5050,
        content: "",
        tags: [
          ["i", "Write a haiku about artificial intelligence", "prompt"],
          ["param", "model", "LLaMA-2"],
          ["param", "max_tokens", "100"],
          ["param", "temperature", "0.7"],
          ["param", "top-k", "50"],
          ["param", "top-p", "0.9"],
          ["param", "frequency_penalty", "1.2"],
          ["output", "text/plain"]
        ],
        created_at: Math.floor(Date.now() / 1000),
        pubkey: getPublicKey(DEMO_PRIVATE_KEY)
      }

      // Add event hash
      const id = getEventHash(unsignedEvent)
      const eventToSign = { ...unsignedEvent, id }

      // Sign the event
      const sig = signEvent(eventToSign, DEMO_PRIVATE_KEY)
      const signedEvent = { ...eventToSign, sig }

      // Subscribe to responses first
      const sub = dvmManager.subscribeToJobs((event) => {
        console.log("Received potential response:", event)
        // Only show responses to our request
        if (event.tags.some(t => t[0] === "e" && t[1] === signedEvent.id)) {
          console.log("Found matching response:", event)
          setResponses(prev => [...prev, event])
        }
      })

      // Publish the request
      console.log("Publishing request:", signedEvent)
      await pool.publish(signedEvent)

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
          {isLoading ? "Waiting for AI..." : "Generate Haiku"}
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