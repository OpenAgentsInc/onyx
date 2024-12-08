# Integrating MCP and DVM in Onyx: A Detailed Analysis

Onyx is envisioned as a versatile AI agent that leverages open protocols (Nostr, Bitcoin/Lightning, MCP) to provide voice-driven AI experiences, payment flows, and extensible capabilities. Two key elements stand out as ideal complements to Onyx’s architecture:

1. **Model Context Protocol (MCP)**: Standardizes how AI tools, resources, and prompts are integrated into Onyx’s LLM-based workflows.
2. **Data Vending Machines (DVM, NIP-90)**: Provide a decentralized marketplace model for on-demand computation and specialized AI services, discoverable via NIP-89 recommendations.

By integrating MCP and DVM, Onyx can seamlessly orchestrate complex AI tasks, pay for services via Lightning, and dynamically expand its capabilities over time.

## Core Concepts

- **Onyx’s Voice-First UI**: Users issue voice commands, which are transcribed and processed by Onyx.
- **MCP as a Tool/Context Interface**: MCP provides a standardized interface for Onyx to discover and interact with AI resources (e.g., code analysis tools, data retrieval endpoints, LLM models).
- **DVM as a Marketplace for Computation**: NIP-90 defines how Onyx can request jobs (like complex reasoning or specialized LLM inference) from decentralized service providers. Multiple DVM providers can compete to fulfill the request, returning results back over Nostr.

## Why MCP and DVM Together?

- **Modular AI Services**:
  MCP lets Onyx define, discover, and invoke various AI-related services and resources as if they were “plugins.” Meanwhile, DVM turns these services into dynamic, on-demand computations that can be performed by third-party providers discovered via Nostr.

- **Standardized Discovery & Negotiation**:
  Using NIP-89, Onyx can find recommended MCP-compatible servers that support certain event kinds (e.g., `kind:5050` for requesting a text-generation job). MCP’s capability negotiation ensures Onyx knows exactly what each server supports.
  With this synergy, Onyx can start from a voice command (“Summarize today’s Bitcoin market developments”), discover a suitable DVM-based summarization service via NIP-89, then interface with it through MCP’s structured requests.

- **Dynamic Scaling of Capabilities**:
  Onyx’s built-in abilities might be limited at first, but MCP + DVM allows scaling. If a user requests a feature Onyx doesn’t natively support, Onyx can:
  1. Use MCP to identify that a certain “tool” (like an advanced summarizer) is needed.
  2. Leverage DVM (NIP-90) to find and pay a specialized service provider to run that summarization.
  3. Integrate the result back into Onyx’s chat and voice workflow, all orchestrated within MCP’s structured context framework.

## Detailed Use Cases

1. **Voice Query → MCP Tool Selection → DVM Job Execution**:
   - User speaks a request: “Onyx, give me a detailed transcription and summary of this latest Nostr event kind:31337.”
   - Onyx transcribes the voice input using its local audio-to-text system.
   - Onyx, integrated with MCP, looks for a tool that can handle “31337-kind events.” Via NIP-89, Onyx discovers a recommended handler that can decode these event types.
   - Realizing this handler requires a more advanced summarization step Onyx doesn’t do locally, Onyx issues a NIP-90 job request (e.g., `kind:5050`) for summarization.
   - A DVM service responds with a `kind:6050` job result: a coherent summary of the event.
   - Onyx, using MCP’s resource management, integrates the result into the conversation and reads it out to the user.

2. **Agent-Level Marketplace**:
   - Onyx’s “OpenAgents” vision: multiple Onyx agents share intelligence and capabilities. MCP standardizes tool access across agents.
   - If Onyx needs a specialized LLM model (like a large code model), it can post a DVM job request. Another Onyx user’s agent—acting as a DVM provider—can process it using their GPU (like concepts from GPUtopia), and return the result.
   - MCP ensures Onyx’s LLM interactions remain consistent, while DVM handles the market aspect of who provides the computation and at what cost.

3. **Payment Integration via Breez SDK**:
   - Lightning payments can be automatically handled. Suppose a DVM provider requests payment for a job result (via a `bolt11` invoice in the job result event).
   - Onyx can integrate the Breez SDK to pay that invoice instantly. This makes it trivial to incorporate commerce around AI services.
   - With MCP, Onyx knows the price and can present it to the user. The user approves, Onyx pays, and the result from DVM is integrated back into Onyx’s context.

## Technical Integration Details

- **MCP in Onyx**:
  - Onyx maintains an `OnyxMCPClient` that connects to MCP servers (either local or remote) via a WebSocket transport.
  - Resources (e.g., code snippets, documents, transcripts) retrieved through MCP’s `resources/list` and `resources/read` methods can be fed directly into Onyx’s LLM context.

- **DVM in Onyx**:
  - Onyx publishes `kind:5050` job requests to a Nostr relay. These requests specify input data (like a URL, text, or even a previously computed job result), parameters (model type, temperature, output format), and a bid.
  - Service providers (DVM nodes) listen for these requests, process them, and return `kind:6050` job results.
  - Onyx listens for these results and displays them to the user. If payment is required (`amount` tag), Onyx prompts the user to pay via Lightning (Breez SDK).

- **NIP-89 Integration**:
  - Onyx queries `kind:31989` events to find recommended handlers for unknown kinds.
  - Once a suitable `kind:31990` handler event is found, Onyx can interpret the handler as an MCP or DVM endpoint.
  - If it’s an MCP endpoint, Onyx sets up a standard MCP connection. If it’s a DVM endpoint, Onyx prepares to submit NIP-90 requests.

- **Unified User Experience**:
  - The user just gives a voice command. Onyx handles discovery (NIP-89), negotiation (MCP), marketplace job execution (DVM), and final payment if needed.
  - Transcription system (already integrated) pipes voice → text into MCP or DVM requests.
  - Onyx’s chat overlay displays status messages, e.g., “Requesting service…”, “Payment required. Approve payment of 1000 sats?”

## Key Benefits

- **Extensibility**: Onyx can integrate new tools without updating local code. Just discover a new MCP server or DVM provider, and start using it.
- **Decentralization & Flexibility**: DVM turns AI tasks into open marketplace transactions. Onyx can pick the best provider based on cost, latency, or trust.
- **User Empowerment & Earnings**: Users can earn bitcoin by running their own DVM nodes. Onyx can route requests to these nodes, paying them for compute.
- **Seamless Payments**: Breez SDK integration ensures that all commerce aspects are automatic and user-friendly.

## Challenges & Considerations

- **Security & Trust**:
  Ensuring that discovered MCP tools or DVM providers are trustworthy. NIP-89 recommendations combined with user’s follow graph and NIP-42 authentication can help.

- **Performance & Latency**:
  DVM requests involve network round trips. Onyx can cache certain results using MCP’s caching layer, or pick providers with faster response times.

- **User Consent**:
  Before paying or using external tools, Onyx should clearly inform the user. MCP capabilities can indicate if payment is needed, and Onyx’s UI can present an approval dialog.

- **Standardization Over Time**:
  MCP and DVM standards are evolving. Onyx should remain flexible, updating transport layers (WebSocket for MCP) and event structures as protocols mature.

## Future Directions

- **Advanced Orchestration**:
  Onyx could chain multiple MCP tools and DVM queries. For example:
  - Step 1 (MCP): Fetch relevant code snippet from a repository.
  - Step 2 (DVM): Request a code analysis and optimization from a specialized LLM.
  - Step 3 (MCP): Reformat results and present them in a nice format to the user.

- **Automated Agent Collaboration**:
  Onyx could integrate multiple DVM results, combining their outputs. One DVM might provide raw transcription, another might provide summarization, and a third might handle translation—MCP ensures all these steps are well-structured.

- **Enhanced Marketplace Features**:
  Onyx could factor in user ratings, success metrics, or latency data from NIP-89 recommended handlers to choose the best DVM provider. Over time, a reputation system emerges.

## Conclusion

Integrating MCP and DVM into Onyx transforms it into a powerful, extensible AI agent capable of dynamically acquiring new capabilities and services on demand. MCP standardizes how Onyx interfaces with tools and resources, while DVM provides a decentralized marketplace to find, run, and pay for advanced AI computations. Together, these technologies allow Onyx to offer a frictionless, voice-first, and monetized AI experience that continuously evolves and improves, all while operating on open, interoperable protocols.
