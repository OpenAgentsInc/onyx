import React, { FC, useContext, useEffect, useState } from "react"
import { View, ViewStyle, FlatList } from "react-native"
import { Screen } from "../components/Screen"
import { Text } from "../components/Text"
import { Card } from "../components/Card"
import { FeedEvent } from "../components/FeedCard"
import { RelayContext } from "../components/RelayProvider"
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
  const { pool } = useContext(RelayContext)

  useEffect(() => {
    if (!pool) return

    const sub = pool.sub(
      [
        {
          kinds: [1, 5000, 5001, 5002], // Add other relevant kinds as needed
          "#e": [event.id],
        },
      ],
      (referenceEvent) => {
        setReferences((prev) => {
          // Check if event already exists
          if (prev.some((e) => e.id === referenceEvent.id)) {
            return prev
          }
          return [...prev, referenceEvent]
        })
      }
    )

    return () => {
      pool.unsub((ev) => console.log("Unsubscribed from event references"))
    }
  }, [event.id, pool])

  const renderReference = ({ item }: { item: NostrEvent }) => (
    <Card
      preset="reversed"
      content={item.content}
      footer={new Date(item.created_at * 1000).toLocaleString()}
      style={$referenceCard}
      contentContainerStyle={$cardContent}
      contentStyle={$description}
      footerStyle={$footer}
    />
  )

  return (
    <Screen preset="scroll" contentContainerStyle={$container}>
      <Text preset="heading" text="Event References" style={$heading} />
      <Card
        preset="reversed"
        heading={event.title}
        content={event.description}
        style={$originalCard}
        contentContainerStyle={$cardContent}
        headingStyle={$heading}
        contentStyle={$description}
      />
      <Text preset="subheading" text="Responses" style={$subheading} />
      <FlatList
        data={references}
        renderItem={renderReference}
        keyExtractor={(item) => item.id}
        contentContainerStyle={$listContent}
      />
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 16,
}

const $listContent: ViewStyle = {
  paddingBottom: 16,
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