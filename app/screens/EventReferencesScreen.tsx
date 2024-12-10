import React, { FC, useContext, useEffect, useState } from "react"
import { View, ViewStyle, FlatList, TouchableOpacity } from "react-native"
import { Text } from "../components/Text"
import { Card } from "../components/Card"
import { FeedEvent } from "../components/FeedCard"
import { RelayContext } from "../components/RelayProvider"
import { NostrEvent } from "../services/nostr/ident"
import { useNavigation } from "@react-navigation/native"
import { Icon } from "../components/Icon"

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
  const navigation = useNavigation()

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
            <Text preset="subheading" text="Responses" style={$subheading} />
          </View>
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