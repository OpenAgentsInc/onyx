# NIP-89 and Data Vending Machines

NIP-89 plays a crucial role in the DVM ecosystem by defining how DVMs advertise and describe their services.

## Core Concepts

NIP-89 defines two key event types:
- Application recommendation events
- Application handler events (kind:31990)

## How It Works

DVMs use NIP-89's capabilities to:
1. Announce their services using application handler events
2. Specify which job types they handle using the `k` tag
3. Provide detailed service characteristics in the `content` profile data
4. Enable client-side DVM discovery and selection

## Implementation Details

A DVM must publish a `kind:31990` event that includes:
- Service description in the `content` field
- Job type tags (`k` tags) indicating supported operations
- Optional metadata like encryption support

## Examples

### Image Generation DVM (kind:5100)

```json
{
  "created_at": 1693484377,
  "content": "{
        \"name\": \"Dali Vending Machine\",
        \"image\": \"https://cdn.nostr.build/i/fb207be87d748ad927f52a063c221d1d97ef6d75e660003cb6e85baf2cd2d64e.jpg\",
        \"about\": \"I'm Dali re-incarnated, faster and cheaper\",
        \"encryptionSupported\": true
    }",
  "tags": [
    [ "d", "td51xbgxwbt5116r" ],
    [ "k", "5100" ]
  ],
  "kind": 31990,
  "pubkey": "6b37d5dc88c1cbd32d75b713f6d4c2f7766276f51c9337af9d32c8d715cc1b93"
}
```

### Discovery Service DVM (kind:5300)

```json
{
  "created_at": 1693484377,
  "content": "{
        \"name\": \"You might have missed\",
        \"image\": \"https://cdn.nostr.build/i/fb207be87d748ad927f52a063c221d1d97ef6d75e660003cb6e85baf2cd2d64e.jpg\",
        \"about\": \"My goal is to help you keep up – or catch up – with your world, no matter how much time you spend on nostr.\",
        \"encryptionSupported\": false
    }",
  "tags": [
    [ "d", "td51xbgxwbt5116r" ],
    [ "k", "5300" ]
  ],
  "kind": 31990,
  "pubkey": "6b37d5dc88c1cbd32d75b713f6d4c2f7766276f51c9337af9d32c8d715cc1b93"
}
```

## Client Implementation

Clients SHOULD:
- Display NIP-89 information to users
- Enable DVM selection based on capabilities
- Use the provided metadata for service discovery

## Resources

- [NIP-89 Specification](https://github.com/nostr-protocol/nips/blob/master/89.md)
- [NIP-90 Specification](https://github.com/nostr-protocol/nips/blob/vending-machine/90.md)