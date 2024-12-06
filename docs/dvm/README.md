# Nostr Data Vending Machines (DVMs)

> This documentation is maintained in our repository for easy reference. For the full specification, visit [data-vending-machines.org](https://www.data-vending-machines.org/).

## Overview

Data Vending Machines (DVMs) are Nostr-based services that process data on demand. They operate as a decentralized marketplace where users can request data processing jobs without specifying a particular service provider.

## How DVMs Work

1. **Customers** submit job requests with:
   - Desired output specification
   - Payment terms
   - Job requirements

2. **Service Providers** compete to fulfill these jobs by offering the best possible service

## DVM Categories

- **Text Manipulation (50xx)**: Text processing tasks
- **Image Manipulation (51xx)**: Image processing tasks
- **Video/Audio (52xx)**: Multimedia processing
- **Discovery (53xx)**: Data discovery services
- **Nostr Analytics (54xx)**: Nostr event analysis
- **Software Analysis (55xx)**: Code/file analysis
- **Others (59xx)**: Miscellaneous services

## Key Points

- Based on NIP-90 specification
- Not a 1:1 marketplace but a competitive service environment
- Providers compete based on quality and efficiency
- Integrated with NIP-89 for service discovery

## Resources

- [NIP-90 Specification](https://github.com/nostr-protocol/nips/blob/vending-machine/90.md)
- [Vendata.io](https://vendata.io) - General-purpose DVM client