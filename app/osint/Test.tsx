import "@/global.css"
import React from "react"
import { ScrollView } from "react-native"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
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

export function Test() {
  return (
    <ScrollView className="p-4 space-y-4">
      {/* ---- Primary Chat & Replies Omitted for Brevity ---- */}

      {/* OSINT Events (Example with Summaries + Dialog) */}
      <Card>
        <CardHeader>
          <CardTitle>Associated OSINT Events (kind=20001)</CardTitle>
          <CardDescription>{relatedOSINTEvents.length} item(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {relatedOSINTEvents.map((event, index) => {
            // We can parse JSON if needed to display just the "title"
            let parsed = {}
            try {
              parsed = JSON.parse(event.content)
            } catch (err) {
              // fallback if parsing fails
              parsed = {}
            }

            const title = parsed.title || `OSINT Event #${index + 1}`

            return (
              <Card key={event.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>ID: {event.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Text className="font-semibold">Kind:</Text>
                  <Text>{event.kind}</Text>
                </CardContent>
                <CardFooter>
                  {/* Use a Dialog to reveal the full content/tags on demand */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Text>View Details</Text>
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                          <Text className="text-sm">
                            More comprehensive info about this OSINT item.
                          </Text>
                        </DialogDescription>
                      </DialogHeader>
                      <Card className="p-4 mb-2">
                        <Text className="font-semibold mb-2">Raw Content:</Text>
                        <Text>{event.content}</Text>
                      </Card>
                      <Card className="p-4">
                        <Text className="font-semibold mb-2">Tags:</Text>
                        <Text>{JSON.stringify(event.tags)}</Text>
                      </Card>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button>
                            <Text>Close</Text>
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            )
          })}
        </CardContent>
      </Card>

      {/* ---- Label Events and other sections can follow a similar pattern ---- */}
    </ScrollView>
  )
}
