# Onyx Data Marketplace: Expanding Capabilities with Bounties, DVM, MCP, and Bitcoin Payments

## Overview

The Onyx Data Marketplace, as introduced in the Marketplace screen and further elaborated across the Analysis, Community, and Feedback screens, is not just a static board for data requests. It is evolving into a dynamic, decentralized ecosystem where users can **post bounties**, collaborate on crowdfunded requests, and leverage advanced protocols (MCP and DVM) to discover, fulfill, and pay for specialized datasets. Integrated Bitcoin payments turn this marketplace into a monetizable environment for data hunters and contributors.

This document explores how we can integrate these concepts into the existing Onyx Marketplace UI and architecture, and how it aligns with the Data Vending Machine (DVM) protocol and the Model Context Protocol (MCP).

## Key Concepts

### Bounties & Crowdfunded Data Requests

A "bounty" is essentially a posted request for data—structured or unstructured—that a user (or group of users) is willing to pay for. Instead of static "requests" seen in the initial design, we imagine:

- **Bounty Post**: A user posts a bounty specifying what they need (e.g., "Photos of pages from a particular out-of-print book," "Surveillance drone sightings in rural areas," "Archived documents from old newspapers").
- **Crowdfunding Mechanism**: Multiple users can add Bitcoin sats to increase the total bounty amount. This incentivizes more contributors to fulfill the request.
- **Partial Fulfillments**: Contributors can submit partial data (a few pages of the requested book, a partial dataset of drone sightings) and earn partial payouts from the bounty pool.

### DVM (Data Vending Machine) Integration

The Data Vending Machine protocol (NIP-90) provides a framework for requesting and fulfilling data computations or retrieval tasks on the Nostr network. By integrating DVM:

1. **Request Publication**: When a user posts a bounty, Onyx can publish a `kind:5000-5999` NIP-90 job request to the Nostr network.
2. **Offers & Competition**: DVM service providers compete to fulfill the job. A single job could have multiple partial fulfillers.
3. **No Single Provider**: Instead of trusting one provider, DVM allows a marketplace of providers to offer solutions. The best, highest-quality data wins approval from requesters.
4. **Incentivized Quality**: With crowdsourced verification and MCP-based quality checks, only credible data submissions get rewarded. This aligns with community verification from the Community screen.

### MCP (Model Context Protocol) for Data Integration & Analysis

MCP standardizes how Onyx interacts with AI models, tools, and data sources. In the context of the marketplace:

1. **Auto-Classification**: Once data submissions come in (e.g., photos of pages, CSV files of drone sightings), Onyx uses MCP tools to semantically parse, classify, and link these new pieces into the knowledge graph.
2. **AI-Assisted Quality Checks**: Using MCP’s tool execution and prompt capabilities, Onyx can run quality checks on submitted data—detecting if the pages are from the correct book, verifying timestamps of drone sightings, or ensuring metadata accuracy.
3. **Enhanced Queries**: Users can ask Onyx complex questions about the posted data. MCP’s sampling and resource integration allows Onyx to reason over integrated datasets, summarize them, or highlight anomalies.

### Bitcoin Payments & Rewards

Users pledge Bitcoin sats when posting a bounty. Potential workflows:

1. **Posting Bounty**:
   - A user sets a bounty amount (e.g., 3000 sats) for retrieving certain data.
   - Bounty is held in the user’s Onyx wallet or a dedicated escrow.
2. **Crowdfunding**:
   - Other users who also want the data add their own sats to the bounty pool.
   - The total bounty grows, making the request more appealing to contributors.
3. **Fulfilling Bounty**:
   - A contributor (or multiple contributors) submit data. The Onyx app verifies contributions via MCP tools.
   - Once verified, Onyx pays out all or part of the bounty from the aggregated Bitcoin pool directly to the contributor’s Lightning address using the integrated Breez SDK.
4. **Partial Payouts**:
   - If data is delivered incrementally (e.g., pages of a book delivered in batches), the bounty can be released proportionally.
   - Once the entire bounty is satisfied or time expires, leftover funds return to contributors or remain available for a new request cycle.

## User Flow Example

1. **User Posts a Bounty**:

   - On the Marketplace screen, user selects "Post Bounty."
   - Describes the requested data: "I want photos of pages 50-100 of 'Advanced Drone Tech (2010 edition)'."
   - Sets initial bounty of 1000 sats.
   - Publishes the request via DVM (NIP-90) to the Nostr network.

2. **Crowdfunding & Discovery**:

   - Other interested users, who also want these pages, add another 2000 sats collectively.
   - The bounty now stands at 3000 sats.
   - The post is visible to community members (via Community screen) and to DVM providers.

3. **Providers Respond (DVM)**:

   - A provider who has access to that book in a private library offers some pages.
   - Another provider with a world-class OCR scanning tool offers an annotated PDF version.

4. **Quality Checks (MCP Tools)**:

   - Onyx uses MCP-based tools to verify if provided pages match the requested range.
   - If correct, Onyx automatically triggers a partial payout (e.g., 1500 sats for the first 25 pages).

5. **Finalization & Payment**:
   - Once all pages are received and verified, Onyx releases the final payment.
   - The contributor receives sats directly via their Lightning address.
   - The completed dataset is now integrated into Onyx’s knowledge graph for advanced queries (Analysis screen).

## Interface Enhancements

- **Marketplace Screen**:

  - Add a "Post Bounty" Card:
    - TextArea for describing the data needed.
    - Numeric input for bounty in sats.
    - "Post Bounty" button triggers publishing to DVM and sets up a bounty entry locally.
  - Display active bounties with current total sats.
  - Add a "Contribute" button to add more sats to a bounty.

- **Community Screen**:

  - Show ongoing bounties and who contributed.
  - Allow endorsement of certain requests to raise credibility.
  - Potentially integrate a rating system to highlight high-quality contributors.

- **Analysis Screen**:

  - Once data is retrieved, display processed metrics, summary tables, and graphs.
  - Tools for verifying authenticity or cross-checking multiple submitted data sets.
  - Options to run MCP-based semantic queries ("Show me a summary of pages discussing drones in Colorado").

- **Feedback Screen**:
  - Users can provide feedback on the quality of data, interface experience, and suggestions for new bounty features.

## Technical Notes & Challenges

- **DVM Integration**:

  - Publish job requests as `kind:5000-5999` events.
  - Listen for results (`kind:6000-6999`) and feedback (`kind:7000`).
  - Implement a bidding system for multiple partial fulfillments.
  - Consider using Nip-89 for discovering recommended handlers/servers.

- **MCP Tools & Data Validation**:

  - Configure MCP client to use tools that validate images, OCR text, metadata.
  - Automated checks before releasing funds.

- **Bitcoin/Lightning Payment Handling**:

  - Use Breez SDK for seamless Lightning transactions.
  - Implement escrow logic or a shared pool of sats.
  - Partial payouts require careful bookkeeping.

- **UI & UX**:
  - Clear indicators of bounty status: "Funded", "Partially Fulfilled", "Completed".
  - Simple flows for adding sats, viewing contributor lists, and data verification steps.

## Future Directions

- **Permissionless Marketplace**:

  - Anyone can post bounties or claim them.
  - No centralized authority, just trustless protocols and cryptographic proofs.

- **Federated Knowledge Graph**:

  - As data flows in, Onyx builds a distributed knowledge graph indexed by DVM nodes and discoverable via MCP-based semantic search.

- **Automated Agents**:

  - Autonomous agents can scan available bounties, gather data, and earn sats.
  - Could integrate stable image models (e.g., scanning certain documents or generating queries).

- **Enhanced Security & Reputation Systems**:
  - Integrate community reputation signals.
  - Weighted endorsements from known contributors or domain experts.

## Conclusion

The Onyx Marketplace, initially conceived as a platform for requesting and browsing drone-related datasets, can evolve into a highly interactive, incentivized ecosystem. By combining **bounty posting**, **DVM’s decentralized job marketplace**, **MCP’s AI-driven data verification and analysis tools**, and **Bitcoin micropayments**, Onyx empowers users to collaboratively build, refine, and monetize unique datasets.

This approach aligns with the open-ended, crowdsourced nature of next-generation knowledge ecosystems, driving innovation in data retrieval, credibility assessment, and AI-assisted sensemaking around topics like drones, UAP sightings, and beyond.
