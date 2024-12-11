import { Event, getEventHash, getPublicKey, getSignature } from "nostr-tools"
import React, { useContext, useState } from "react"
import { Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { NostrIdentity } from "@/services/nostr"
import { DVMManager } from "@/services/nostr/dvm"
import { RelayContext } from "./RelayProvider"

// TODO: This should come from your key management system
const DEMO_PRIVATE_KEY = "d5770d632a5d2c8fd2c0d3db4dd5f30ea4b37480b89da1695b5d3ca25080fa91"

export const DVMButton = () => {
  const { pool } = useContext(RelayContext)
  const [responses, setResponses] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendJobRequest = async () => {
    if (!pool) {
      console.log("No pool available")
      return
    }
    setIsLoading(true)

    // Create identity for signing
    const identity = new NostrIdentity(DEMO_PRIVATE_KEY, "", "")
    pool.ident = identity

    const dvmManager = new DVMManager(pool)
    let subscription: { unsub: () => void } | undefined

    try {
      // Create unsigned event
      const unsignedEvent = {
        kind: 5050,
        content: "",
        tags: [
          ["i", "Write a haiku about cats", "prompt"],
          ["param", "max_tokens", "300"],
          ["output", "text/plain"]
        ],
        created_at: Math.floor(Date.now() / 1000),
        pubkey: getPublicKey(DEMO_PRIVATE_KEY)
      }

      // Add event hash
      const id = getEventHash(unsignedEvent)
      const eventToSign = { ...unsignedEvent, id }

      // Sign the event using the identity
      const sig = getSignature(eventToSign, DEMO_PRIVATE_KEY)
      const signedEvent = { ...eventToSign, sig }

      console.log("Created signed event:", signedEvent)

      // Subscribe to responses first
      subscription = dvmManager.subscribeToJobs((event) => {
        console.log("Received potential response:", event)

        // Check if this is a response to our request
        const isResponse = event.tags.some(t =>
          t[0] === "e" && t[1] === signedEvent.id
        )

        if (isResponse) {
          console.log("Found matching response!")
          setResponses(prev => [...prev, event])
        } else {
          console.log("Not a response to our request")
        }
      })

      // Wait a moment for subscription to be ready
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Publish the request
      console.log("Publishing request...")
      const pub = await pool.publish(signedEvent)
      console.log("Publish result:", pub)

      // Clean up subscription after 30 seconds
      setTimeout(() => {
        console.log("Cleaning up subscription")
        subscription?.unsub()
        setIsLoading(false)
      }, 30000)
    } catch (e) {
      console.error("Error in sendJobRequest:", e)
      subscription?.unsub()
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

      {responses.length > 0 ? (
        responses.map((response, i) => (
          <View key={response.id} style={$response}>
            <Text style={$responseText}>
              {response.content || "Empty response"}
            </Text>
          </View>
        ))
      ) : isLoading ? (
        <View style={$response}>
          <Text style={$responseText}>Waiting for responses...</Text>
        </View>
      ) : null}
    </View>
  )
}

const $container: ViewStyle = {
  position: "absolute",
  top: "50%",
  left: "54%",
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
  fontFamily: 'JetBrainsMono-Regular',
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
