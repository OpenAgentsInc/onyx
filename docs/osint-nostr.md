# Agentic OSINT on Nostr

This document outlines how an **Agentic OSINT** project can leverage Nostr to publish, categorize, and reward contributions for open-source intelligence. The emphasis is on **custom event kinds** rather than generic `kind:1` (text notes), since OSINT posts often shouldn’t appear in Twitter-style feeds unless explicitly desired.

---

## Overview of Relevant NIPs

1. **NIP-01: Basic Protocol Flow**

   - Defines how **events**, **subscriptions**, and **messages** are structured and exchanged between clients and relays.
   - Everything else builds on this.

2. **NIP-28: Public Chat**

   - Enables chatrooms/channels (`kind 40–44` events).
   - Useful for **real-time collaboration**, letting OSINT investigators brainstorm and share ephemeral updates within a specific channel.

3. **NIP-32: Labeling**

   - Introduces **kind `1985`** for labeling events or users with tags like “verified,” “disputed,” “sensitive,” etc.
   - Perfect for marking OSINT data with curated statuses (e.g. “Needs Confirmation,” “Official Source,” “Potential Psyop,” etc.).

4. **NIP-56: Reporting**

   - Uses **kind `1984`** to flag or report events.
   - OSINT participants might report suspicious data or malicious attempts at disinformation.

5. **NIP-57: Lightning Zaps**
   - Adds tipping/micropayment capability (Zaps) so that users can send **Bitcoin** to an event or pubkey.
   - Ideal for **rewarding** high-quality OSINT findings.

_(Optional Additional NIPs)_

- **NIP-19: bech32 Encoded Entities**
  - Makes it easier to share event/pubkey references in a user-friendly format (e.g. `nostr:nevent1...`).
- **NIP-50: Search**
  - If you want advanced indexing & searching within OSINT data, some relays/clients implement search events (not always universal).

---

## Strategy for OSINT Events

### 1. Use a **Custom Kind** (e.g., `20001`)

- **Why?**
  - Avoid cluttering standard “short text note” feeds and keep your OSINT data in a **structured** format that specialized clients can parse.
- **Where?**
  - Choose an integer that’s **not** widely used (e.g., `20001`).
  - This is a “regular” event kind, meaning most relays **will store** it indefinitely (like kind `1`) rather than discarding after updates.

### 2. `content` and `tags`

For each OSINT event (kind `20001`):

- **`content`:**

  - You can embed JSON or a structured text format describing the intel:
    ```json
    {
      "title": "Mysterious Drone Sighting near Bridge",
      "description": "Footage captured at 10pm local time...",
      "source": "local news, eyewitness post on platform X",
      "media_link": "https://example.com/drone.mp4",
      "confidence": "medium"
    }
    ```
  - Keep in mind the NIP-01 serialization rules (escaping special characters, etc.).

- **`tags`:**
  - Use NIP-01 single-letter tags (like `["t", "drones"]`) if you want them **indexed** by relays.
  - Or use extended tags (like `["osint-category", "drones"]`) for custom fields.
  - If you want to cross-reference another OSINT event, or a user’s pubkey, you can do:
    - `["p", "<hex_of_pubkey>", "<relay_url_if_any>"]` to reference a user.
    - `["e", "<hex_of_event_id>", "<relay_url_if_any>"]` to reference an event.

### 3. Example OSINT Event

```json
{
  "id": "abcdef123456...", // 32-byte hex, the event's ID after hashing
  "pubkey": "987654fedcba...", // The creator's pubkey
  "created_at": 1700000000, // Unix timestamp
  "kind": 20001, // Our custom OSINT kind
  "tags": [
    ["t", "drone-sighting"],
    ["p", "abcdef1234...", "wss://relay.example.com"],
    ["osint-level", "verified"],
    ["osint-category", "equipment"]
  ],
  "content": "{\"title\":\"Mysterious Drone...\", \"description\":\"...\"}",
  "sig": "f7e12d51..." // Signature in hex
}
```
