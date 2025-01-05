import React from "react"
import { Platform } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
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
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu"
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

import type { OSINTEvent } from "./data"

interface OSINTCardProps {
  event: OSINTEvent
}

export function OSINTCard({ event }: OSINTCardProps) {
  // Attempt to parse the JSON in event.content to extract a "title"
  let parsed = {}
  try {
    parsed = JSON.parse(event.content)
  } catch (err) {
    // fallback if parsing fails
    parsed = {}
  }
  const title = (parsed as any).title || `OSINT Event: ${event.id}`
  const [checkedItem, setCheckedItem] = React.useState(false)
  const [radioValue, setRadioValue] = React.useState("anonymous")

  return (
    <Card className="mb-4">
      {/* Context Menu Trigger wraps the entire Card for right-click / long press */}
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              Kind: {event.kind} | ID: {event.id}
            </CardDescription>
          </CardHeader>
        </ContextMenuTrigger>

        {/* The full context menu */}
        <ContextMenuContent align="start" className="w-64 native:w-72">
          <ContextMenuLabel inset>Actions</ContextMenuLabel>
          <ContextMenuItem inset onSelect={() => console.log("Mark as Verified")}>
            <Text>Mark as Verified</Text>
          </ContextMenuItem>
          <ContextMenuItem inset onSelect={() => console.log("Report as Suspicious")}>
            <Text>Report</Text>
          </ContextMenuItem>
          <ContextMenuItem inset onSelect={() => navigator.clipboard?.writeText(event.id)}>
            <Text>Copy ID</Text>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuSub>
            <ContextMenuSubTrigger inset>
              <Text>Share...</Text>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="web:w-48 native:mt-1">
              <Animated.View entering={FadeIn.duration(200)}>
                <ContextMenuItem onSelect={() => console.log("Sharing via email")}>
                  <Text>Email</Text>
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => console.log("Sharing via SMS")}>
                  <Text>SMS</Text>
                </ContextMenuItem>
              </Animated.View>
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator />

          <ContextMenuCheckboxItem
            checked={checkedItem}
            onCheckedChange={setCheckedItem}
            closeOnPress={false}
            inset
          >
            <Text>Notify me about changes</Text>
          </ContextMenuCheckboxItem>

          <ContextMenuSeparator />

          <ContextMenuLabel inset>Assignee</ContextMenuLabel>
          <ContextMenuRadioGroup value={radioValue} onValueChange={setRadioValue}>
            <ContextMenuRadioItem value="anonymous" inset closeOnPress={false}>
              <Text>Anonymous</Text>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="agent1" inset closeOnPress={false}>
              <Text>Agent 1</Text>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="agent2" inset closeOnPress={false}>
              <Text>Agent 2</Text>
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>

      <CardContent>
        <Text className="font-medium">Short Info:</Text>
        <Text>Title: {title}</Text>
      </CardContent>

      <CardFooter>
        {/* "View Details" Dialog for showing full content and tags */}
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
                <Text className="text-sm">Full OSINT details (raw JSON & tags).</Text>
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
}
