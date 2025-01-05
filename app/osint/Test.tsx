import "@/global.css"
import React from "react"
import { ScrollView } from "react-native"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { labelEvents, primaryChatMessage, relatedOSINTEvents, replyMessages } from "./data"

/**
 * Demonstrates a NIP-28 channel message, replies, custom OSINT events (kind=20001),
 * and label events (kind=1985) with your Card/Button/Text components.
 */
export function Test() {
  return (
    <ScrollView className="p-4 space-y-4">
      {/* Primary Chat Message */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Chat Message (kind: {primaryChatMessage.kind})</CardTitle>
          <CardDescription>High-level excerpt from a podcast transcript.</CardDescription>
        </CardHeader>
        <CardContent>
          <Text className="font-semibold mb-2">Tags:</Text>
          <Text>{JSON.stringify(primaryChatMessage.tags)}</Text>

          <Text className="mt-4 font-semibold mb-2">Transcript Excerpt</Text>
          <Text>{primaryChatMessage.content}</Text>
        </CardContent>
        <CardFooter>
          <Button variant="secondary">
            <Text>View Full Transcript</Text>
          </Button>
        </CardFooter>
      </Card>

      {/* Reply Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Replies</CardTitle>
          <CardDescription>
            {replyMessages.length} message(s) replying to the primary chat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {replyMessages.map((reply, index) => (
            <Card key={`reply_${index}`} className="mb-4">
              <CardHeader>
                <CardTitle>
                  Reply #{index + 1} (kind: {reply.kind})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="font-semibold mb-2">Tags:</Text>
                <Text>{JSON.stringify(reply.tags)}</Text>

                <Text className="mt-4">{reply.content}</Text>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* OSINT Events */}
      <Card>
        <CardHeader>
          <CardTitle>Associated OSINT Events (kind=20001)</CardTitle>
          <CardDescription>{relatedOSINTEvents.length} item(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {relatedOSINTEvents.map((event, index) => (
            <Card key={event.id} className="mb-4">
              <CardHeader>
                <CardTitle>OSINT Event #{index + 1}</CardTitle>
                <CardDescription>ID: {event.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <Text className="font-semibold mb-2">Kind:</Text>
                <Text>{event.kind}</Text>

                <Text className="font-semibold mt-4 mb-2">Tags:</Text>
                <Text>{JSON.stringify(event.tags)}</Text>

                <Text className="font-semibold mt-4 mb-2">Content:</Text>
                <Text>{event.content}</Text>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Label Events */}
      <Card>
        <CardHeader>
          <CardTitle>Label Events (NIP-32)</CardTitle>
          <CardDescription>{labelEvents.length} item(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {labelEvents.map((lblEvent, index) => (
            <Card key={`label_${index}`} className="mb-4">
              <CardHeader>
                <CardTitle>
                  Label #{index + 1} (kind: {lblEvent.kind})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="font-semibold mb-2">Tags:</Text>
                <Text>{JSON.stringify(lblEvent.tags)}</Text>

                <Text className="font-semibold mt-4 mb-2">Content:</Text>
                <Text>{lblEvent.content}</Text>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  )
}
