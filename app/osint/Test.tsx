// Test.tsx
import "@/global.css"
import React from "react"
import { ScrollView } from "react-native"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Text } from "~/components/ui/text"
import { labelEvents, primaryChatMessage, relatedOSINTEvents, replyMessages } from "./data"
import { OSINTCard } from "./OSINTCard"

export function Test() {
  return (
    <ScrollView className="p-4 space-y-4">
      {/* Example Header */}
      <Text className="text-xl font-bold mb-2">OSINT Dashboard</Text>

      {/* Primary Chat Message */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Chat Message (kind: {primaryChatMessage.kind})</CardTitle>
          <CardDescription>Excerpt from a podcast transcript.</CardDescription>
        </CardHeader>
        <CardContent>
          <Text className="font-semibold mb-2">Tags:</Text>
          <Text>{JSON.stringify(primaryChatMessage.tags)}</Text>

          <Text className="mt-4 font-semibold mb-2">Transcript Excerpt</Text>
          <Text>{primaryChatMessage.content}</Text>
        </CardContent>
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
          {relatedOSINTEvents.map((osintEvent) => (
            <OSINTCard key={osintEvent.id} event={osintEvent} />
          ))}
        </CardContent>
      </Card>

      {/* Label Events (NIP-32) */}
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

      {/* Example: Another optional Dialog at the bottom (e.g. "Global Actions") */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="my-4">
            <Text>Global Actions</Text>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Global Actions</DialogTitle>
            <DialogDescription>Cross-event operations, mass tagging, etc.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>
                <Text>Close</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollView>
  )
}
