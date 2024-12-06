# NIP-89 and Data Vending Machines

NIP-89 plays a crucial role in the DVM ecosystem by providing the service discovery mechanism for Data Vending Machines.

## Role in DVMs

1. **Service Discovery**: NIP-89 allows DVM providers to advertise their services on the Nostr network
2. **Capability Description**: Providers can specify what kinds of jobs they can handle
3. **Service Metadata**: Information about pricing, performance, and other service characteristics

## How It Works

DVM providers publish NIP-89 events that:
- Describe their supported job types
- List their capabilities
- Specify their service parameters
- Include relevant metadata for discovery

## Integration with NIP-90

While NIP-90 defines the DVM protocol itself, NIP-89 handles the service discovery and announcement aspects, making it possible for:
- Clients to find appropriate DVMs
- DVMs to advertise their services
- The ecosystem to maintain a discoverable marketplace

## Resources

- [NIP-89 Specification](https://github.com/nostr-protocol/nips/blob/master/89.md)
- [NIP-90 Specification](https://github.com/nostr-protocol/nips/blob/vending-machine/90.md)