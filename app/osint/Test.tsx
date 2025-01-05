import "@/global.css"
import React from "react"
import { ScrollView } from "react-native"
import { Text } from "~/components/ui/text"
import { relatedOSINTEvents } from "./data"
import { OSINTCard } from "./OSINTCard"

export function Test() {
  return (
    <ScrollView className="p-4 space-y-4">
      <Text className="text-xl mb-2">OSINT Overview</Text>

      {/* Example: Map over OSINT events and render each in OSINTCard */}
      {relatedOSINTEvents.map((osintEvent) => (
        <OSINTCard key={osintEvent.id} event={osintEvent} />
      ))}

      {/* Additional sections for primaryChatMessage, replyMessages, labelEvents, etc. */}
    </ScrollView>
  )
}
