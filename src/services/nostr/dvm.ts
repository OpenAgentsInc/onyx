import { Event, Filter } from "nostr-tools"
import { NostrPool } from "./pool"

export class DVMManager {
  constructor(private pool: NostrPool) {
    // console.log("DVMManager initialized with pool state:", {
    //   hasPool: !!pool,
    //   hasRelays: pool?.relays?.length > 0,
    //   relayCount: pool?.relays?.length
    // })
  }

  // Subscribe to NIP-89 service announcements
  subscribeToServices(callback: (event: Event) => void) {
    // console.log("Subscribing to services with pool state:", {
    //   hasPool: !!this.pool,
    //   hasRelays: this.pool?.relays?.length > 0,
    //   relayCount: this.pool?.relays?.length
    // })

    if (!this.pool) {
      console.error("No pool available for service subscription")
      return { unsub: () => { } }
    }

    const filter: Filter = {
      kinds: [31989],
      since: Math.floor(Date.now() / 1000) - 24 * 60 * 60 // Last 24 hours
    }

    try {
      return this.pool.sub(
        [filter],
        (event: Event) => {
          // console.log("Received service announcement:", event)
          callback(event)
        }
      )
    } catch (e) {
      console.error("Error subscribing to services:", e)
      return { unsub: () => { } }
    }
  }

  // Subscribe to NIP-90 job requests
  subscribeToJobs(callback: (event: Event) => void) {
    // console.log("Subscribing to jobs with pool state:", {
    //   hasPool: !!this.pool,
    //   hasRelays: this.pool?.relays?.length > 0,
    //   relayCount: this.pool?.relays?.length
    // })

    if (!this.pool) {
      console.error("No pool available for job subscription")
      return { unsub: () => { } }
    }

    const filter: Filter = {
      kinds: [5050], // Added 5050
      // kinds: [5000, 5001, 5002, 5003, 5004, 5005, 5050], // Added 5050
      since: Math.floor(Date.now() / 1000) - 72 * 60 * 60 // Last 72 hours
    }

    try {
      return this.pool.sub(
        [filter],
        (event: Event) => {
          // console.log("Received job request:", event)
          callback(event)
        }
      )
    } catch (e) {
      console.error("Error subscribing to jobs:", e)
      return { unsub: () => { } }
    }
  }

  // Parse NIP-89 service announcement
  parseServiceAnnouncement(event: Event) {
    console.log("Parsing service announcement:", event)
    try {
      const supportedKind = event.tags.find(t => t[0] === "d")?.[1]
      const appInfo = event.tags.find(t => t[0] === "a")
      let metadata = {}

      try {
        metadata = JSON.parse(event.content)
      } catch (e) {
        console.warn("Failed to parse event content as JSON:", e)
      }

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
        title: metadata?.name || "Unnamed Service",
        description: metadata?.about || "No description provided"
      }
    } catch (e) {
      console.error("Error parsing service announcement:", e)
      throw e
    }
  }

  // Parse NIP-90 job request
  parseJobRequest(event: Event) {
    // console.log("Parsing job request:", event)
    try {
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
    } catch (e) {
      console.error("Error parsing job request:", e)
      throw e
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
      5005: "Translation",
      5050: "AI Assistant" // Added 5050
    }
    return kinds[kind] || "Unknown Job Type"
  }
}
