# Text Generation DVM (Kind 5050)

This DVM kind handles text generation requests using AI models. It's part of the Text Manipulation (50xx) category of Data Vending Machines.

## Overview

Text Generation DVMs accept prompts or seed sentences and return AI-generated text responses. They support various AI models and configuration parameters to control the generation process.

## Input

Clients provide input through the `"i"` tag field, which contains the prompt or seed sentence for text generation.

## Parameters

| Parameter | Description | Usage |
|-----------|-------------|--------|
| `model` | AI model identifier | Specify which model to use (e.g., "LLaMA-2") |
| `max_tokens` | Maximum output length | Set lower for short responses, higher for longer ones |
| `temperature` | Output randomness (0.1-2.0) | <1.0 for focused, >1.0 for creative responses |
| `top_k` | Token consideration limit | Typically 20-50; affects output coherence |
| `top_p` | Nucleus sampling threshold | 0.7-0.95; higher values = more randomness |
| `frequency_penalty` | Word repetition control | >1.0 discourages repetition, <1.0 encourages it |

All parameters are optional and can be extended with additional application-specific parameters.

## Output Formats

- `text/plain`
- `text/markdown`

## Example Request

```json
{
    "content": "",
    "kind": 5050,
    "tags": [
        [ "i", "what is the capital of France? ", "prompt" ],
        [ "param", "model", "LLaMA-2"],
        [ "param", "max_tokens", "512"],
        [ "param", "temperature", "0.5"],
        [ "param", "top-k", "50"],
        [ "param", "top-p", "0.7"],
        [ "param", "frequency_penalty", "1"]
    ]
}
```

## Implementation Notes

- Always validate model availability before processing requests
- Consider implementing rate limiting for resource-intensive models
- Cache common responses when possible
- Monitor token usage and implement appropriate limits
- Handle model-specific errors gracefully

## Related Resources

- [NIP-90 Specification](https://github.com/nostr-protocol/nips/blob/vending-machine/90.md)
- [Data Vending Machines](https://www.data-vending-machines.org/)