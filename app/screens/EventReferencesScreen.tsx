import React, {
  FC, useCallback, useContext, useEffect, useRef, useState
} from "react"
import { ActivityIndicator, FlatList, View, ViewStyle } from "react-native"
import { RelayContext } from "@/providers/RelayProvider"
import { useNavigation } from "@react-navigation/native"
import { Card } from "../components/Card"
import { FeedEvent } from "../components/FeedCard"
import { Text } from "../components/Text"
import { NostrEvent } from "../services/nostr/ident"

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
  const { pool, db } = useContext(RelayContext)
  const navigation = useNavigation()
  const subRef = useRef<{ unsub: () => void } | null>(null)

  // Load references from DB
  const loadReferences = useCallback(async () => {
    if (!db) {
      console.log("[References] Database not available")
      return
    }

    try {
      console.log("[References] Loading references for event:", event.id)
      const filter = [{
        kinds: [6050, 7000],
        "#e": [event.id],
      }]

      const events = await db.list(filter)
      console.log(`[References] Found ${events.length} references in database`)

      if (events.length > 0) {
        setReferences(events.sort((a, b) => b.created_at - a.created_at))
      }
    } catch (error) {
      console.error("[References] Failed to load references from DB:", error)
    } finally {
      setIsLoading(false)
    }
  }, [event.id, db])

  // Load references when component mounts
  useEffect(() => {
    loadReferences()
  }, [loadReferences])

  // Subscribe to new references
  useEffect(() => {
    if (!pool || !db) {
      console.log("[References] Not ready for subscription:", {
        hasPool: !!pool,
        hasDb: !!db
      })
      return
    }

    console.log("[References] Setting up subscription for event:", event.id)
    const sub = pool.sub(
      [{
        kinds: [6050, 7000],
        "#e": [event.id],
      }],
      async (referenceEvent) => {
        console.log("[References] Received new reference event:", referenceEvent.id)
        try {
          await db.saveEventSync(referenceEvent)
          console.log("[References] Saved reference event to database:", referenceEvent.id)

          setReferences((prev) => {
            if (prev.some((e) => e.id === referenceEvent.id)) {
              console.log("[References] Event already exists in state:", referenceEvent.id)
              return prev
            }
            console.log("[References] Adding new event to state:", referenceEvent.id)
            return [...prev, referenceEvent].sort((a, b) => b.created_at - a.created_at)
          })
        } catch (error) {
          console.error("[References] Failed to save event to DB:", error)
        }
      }
    )

    subRef.current = sub
    console.log("[References] Subscription set up successfully")

    return () => {
      console.log("[References] Cleaning up subscription")
      if (subRef.current) {
        subRef.current.unsub()
        subRef.current = null
      }
    }
  }, [event.id, pool, db])

  const renderReference = ({ item }: { item: NostrEvent }) => {
    const status = item.kind === 7000
      ? item.tags.find(t => t[0] === 'status')?.[1]
      : null

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
      <FlatList
        ListHeaderComponent={
          <View>
            <Card
              preset="reversed"
              heading={event.title}
              content={event.description}
              style={$originalCard}
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
              <Text
                text="Loading references..."
                style={[$description, $emptyText]}
              />
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
  marginTop: 16,
  marginBottom: 32,
}
