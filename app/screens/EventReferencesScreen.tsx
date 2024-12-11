import React, { FC, useContext, useEffect, useState, useRef } from "react"
import { View, ViewStyle, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { Text } from "../components/Text"
import { Card } from "../components/Card"
import { FeedEvent } from "../components/FeedCard"
import { RelayContext } from "../components/RelayProvider"
import { NostrEvent } from "../services/nostr/ident"
import { useNavigation } from "@react-navigation/native"
import { Icon } from "../components/Icon"
import { connectDb } from "../services/nostr/db"

interface EventReferencesScreenProps {
  route: {
    params: {
      event: FeedEvent
    }
  }
}

export const EventReferencesScreen: FC<EventReferencesScreenProps> = ({ route }) => {
  const { event } = route.params
  const [references, setReferences] = useState<NostrEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { pool } = useContext(RelayContext)
  const navigation = useNavigation()
  const subRef = useRef<{ unsub: () => void } | null>(null)
  const dbRef = useRef<Awaited<ReturnType<typeof connectDb>> | null>(null)

  // Initialize database connection
  useEffect(() => {
    const initDb = async () => {
      try {
        console.log("Initializing database connection...")
        dbRef.current = await connectDb()
        console.log("Database connection initialized")
      } catch (error) {
        console.error("Failed to initialize database:", error)
      }
    }
    initDb()
  }, [])

  // Load existing references from DB
  useEffect(() => {
    const loadFromDb = async () => {
      if (!dbRef.current) {
        console.log("Waiting for database connection...")
        return
      }

      try {
        console.log("Loading references for event:", event.id)
        // Query both result and feedback events that reference our event
        const filter = [{
          kinds: [6050, 7000],
          "#e": [event.id],
        }]
        
        const events = await dbRef.current.list(filter)
        console.log(`Found ${events.length} references in database`)
        if (events.length > 0) {
          setReferences(events.sort((a, b) => b.created_at - a.created_at))
        }
      } catch (error) {
        console.error("Failed to load references from DB:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFromDb()
  }, [event.id])

  // Subscribe to new references
  useEffect(() => {
    if (!pool || !dbRef.current) {
      console.log("Waiting for pool and database:", {
        hasPool: !!pool,
        hasDb: !!dbRef.current
      })
      return
    }

    console.log("Setting up subscription for event:", event.id)
    // Subscribe to both results (6050) and feedback (7000)
    const sub = pool.sub(
      [
        {
          kinds: [6050, 7000], // Results and feedback for kind 5050 requests
          "#e": [event.id],
        },
      ],
      async (referenceEvent) => {
        console.log("Received new reference event:", referenceEvent.id)
        // Save to DB first
        try {
          await dbRef.current.saveEventSync(referenceEvent)
          console.log("Saved reference event to database:", referenceEvent.id)

          // Update state
          setReferences((prev) => {
            // Check if event already exists
            if (prev.some((e) => e.id === referenceEvent.id)) {
              console.log("Event already exists in state:", referenceEvent.id)
              return prev
            }
            // Sort by created_at with newest first
            console.log("Adding new event to state:", referenceEvent.id)
            return [...prev, referenceEvent].sort((a, b) => b.created_at - a.created_at)
          })
        } catch (error) {
          console.error("Failed to save event to DB:", error)
        }
      }
    )

    // Store subscription in ref
    subRef.current = sub
    console.log("Subscription set up successfully")

    return () => {
      console.log("Cleaning up subscription")
      if (subRef.current) {
        subRef.current.unsub()
        subRef.current = null
      }
    }
  }, [event.id, pool])

  const renderReference = ({ item }: { item: NostrEvent }) => {
    // Get the status if it's a feedback event
    const status = item.kind === 7000 
      ? item.tags.find(t => t[0] === 'status')?.[1] 
      : null

    // Format the content based on event kind
    let content = item.content
    if (item.kind === 7000) {
      content = `Status: ${status || 'unknown'}`
      if (status === 'error' && item.tags.find(t => t[0] === 'status')?.[2]) {
        content += `\nError: ${item.tags.find(t => t[0] === 'status')?.[2]}`
      }
    }

    return (
      <Card
        preset="reversed"
        heading={item.kind === 6050 ? "Result" : "Status Update"}
        content={content}
        footer={new Date(item.created_at * 1000).toLocaleString()}
        style={$referenceCard}
        contentContainerStyle={$cardContent}
        headingStyle={$cardHeading}
        contentStyle={$description}
        footerStyle={$footer}
      />
    )
  }

  return (
    <View style={$container}>
      <View style={$header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
          <Icon icon="back" color="#fafafa" size={24} />
        </TouchableOpacity>
        <Text preset="heading" text="Event References" style={$heading} />
      </View>
      
      <FlatList
        ListHeaderComponent={
          <View>
            <Card
              preset="reversed"
              heading={event.title}
              content={event.description}
              style={$originalCard}
              contentContainerStyle={$cardContent}
              headingStyle={$heading}
              contentStyle={$description}
            />
            <Text preset="subheading" text="Responses & Updates" style={$subheading} />
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={$loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          ) : (
            <Text 
              text="No references found" 
              style={[$description, $emptyText]} 
            />
          )
        }
        data={references}
        renderItem={renderReference}
        keyExtractor={(item) => item.id}
        contentContainerStyle={$listContent}
      />
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: "#000000",
}

const $header: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingTop: 48,
  paddingBottom: 16,
  backgroundColor: "#0a0a0c",
}

const $backButton: ViewStyle = {
  marginRight: 16,
}

const $listContent: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 16,
  minHeight: '100%',
}

const $originalCard: ViewStyle = {
  marginVertical: 16,
  backgroundColor: "#0a0a0c",
  borderColor: "#292930",
  borderWidth: 1,
  borderRadius: 12,
}

const $referenceCard: ViewStyle = {
  marginVertical: 8,
  backgroundColor: "#0a0a0c",
  borderColor: "#292930",
  borderWidth: 1,
  borderRadius: 12,
}

const $cardContent: ViewStyle = {
  padding: 16,
}

const $heading = {
  color: "#fafafa",
  fontSize: 24,
  marginBottom: 16,
}

const $cardHeading = {
  color: "#fafafa",
  fontSize: 18,
  marginBottom: 8,
}

const $subheading = {
  color: "#fafafa",
  fontSize: 20,
  marginBottom: 8,
}

const $description = {
  color: "#a5a5af",
  fontSize: 14,
  lineHeight: 20,
}

const $footer = {
  color: "#fafafa",
  fontSize: 12,
}

const $loadingContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 32,
}

const $emptyText = {
  textAlign: 'center',
  marginTop: 32,
}