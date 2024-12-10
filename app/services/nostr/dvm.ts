import { NostrPool } from "./pool"
import { Event, Filter } from "nostr-tools"

export class DVMManager {
  constructor(private pool: NostrPool) {}

  // Subscribe to NIP-89 service announcements
  subscribeToServices(callback: (event: Event) => void) {
    const filter: Filter = {
      kinds: [31989],
      since: Math.floor(Date.now() / 1000) - 24 * 60 * 60 // Last 24 hours
    }

    return this.pool.sub(
      [filter],
      (event: Event) => {
        console.log("New service announcement:", event)
        callback(event)
      }
    )
  }

  // Subscribe to NIP-90 job requests
  subscribeToJobs(callback: (event: Event) => void) {
    const filter: Filter = {
      kinds: [5000, 5001, 5002, 5003, 5004, 5005], // Common DVM job kinds
      since: Math.floor(Date.now() / 1000) - 24 * 60 * 60 // Last 24 hours
    }

    return this.pool.sub(
      [filter],
      (event: Event) => {
        console.log("New job request:", event)
        callback(event)
      }
    )
  }

  // Subscribe to job results
  subscribeToResults(callback: (event: Event) => void) {
    const filter: Filter = {
      kinds: [6000, 6001, 6002, 6003, 6004, 6005], // Result kinds matching job kinds
      since: Math.floor(Date.now() / 1000) - 24 * 60 * 60
    }

    return this.pool.sub(
      [filter],
      (event: Event) => {
        console.log("New job result:", event)
        callback(event)
      }
    )
  }

  // Subscribe to job feedback
  subscribeToFeedback(callback: (event: Event) => void) {
    const filter: Filter = {
      kinds: [7000], // Job feedback kind
      since: Math.floor(Date.now() / 1000) - 24 * 60 * 60
    }

    return this.pool.sub(
      [filter],
      (event: Event) => {
        console.log("New job feedback:", event)
        callback(event)
      }
    )
  }

  // Parse NIP-89 service announcement
  parseServiceAnnouncement(event: Event) {
    const supportedKind = event.tags.find(t => t[0] === "d")?.[1]
    const appInfo = event.tags.find(t => t[0] === "a")
    
    return {
      id: event.id,
      kind: event.kind,
      pubkey: event.pubkey,
      content: event.content,
      supportedKind,
      appInfo: appInfo ? {
        identifier: appInfo[1],
        relay: appInfo[2],
        platform: appInfo[3]
      } : null,
      created_at: event.created_at,
      title: JSON.parse(event.content)?.name || "Unnamed Service",
      description: JSON.parse(event.content)?.about || "No description provided"
    }
  }

  // Parse NIP-90 job request
  parseJobRequest(event: Event) {
    const input = event.tags.find(t => t[0] === "i")
    const bid = event.tags.find(t => t[0] === "bid")?.[1]
    const output = event.tags.find(t => t[0] === "output")?.[1]

    return {
      id: event.id,
      kind: event.kind,
      pubkey: event.pubkey,
      content: event.content,
      input: input ? {
        data: input[1],
        type: input[2],
        relay: input[3],
        marker: input[4]
      } : null,
      bid: bid ? parseInt(bid) : null,
      output,
      created_at: event.created_at,
      title: `Job Request: ${this.getJobKindName(event.kind)}`,
      description: input?.[1] || "No input provided",
      price: bid ? parseInt(bid) : null
    }
  }

  // Get human readable name for job kind
  private getJobKindName(kind: number): string {
    const kinds: Record<number, string> = {
      5000: "Generic Job",
      5001: "Text Generation",
      5002: "Image Analysis",
      5003: "Audio Processing",
      5004: "Video Processing",
      5005: "Translation"
    }
    return kinds[kind] || "Unknown Job Type"
  }
}