import type { LlamaContext } from "llama.rn"

export const handleCommand = async (
  text: string,
  context: LlamaContext,
  inferencing: boolean,
  addSystemMessage: (text: string) => void,
  resetConversation: () => void,
): Promise<boolean> => {
  const command = text.slice(1).toLowerCase()

  switch (command) {
    case 'info':
      addSystemMessage(`Model info:\n${JSON.stringify(context.model, null, 2)}`)
      return true

    case 'bench':
      if (inferencing) {
        addSystemMessage('Cannot benchmark while inferencing')
        return true
      }
      try {
        const result = await context.bench()
        addSystemMessage(
          `Benchmark results:\n${result.timings.predicted_per_token_ms.toFixed()}ms per token, ${result.timings.predicted_per_second.toFixed(2)} tokens per second`,
        )
      } catch (err: any) {
        addSystemMessage(`Benchmark failed: ${err.message}`)
      }
      return true

    case 'reset':
      resetConversation()
      addSystemMessage('Conversation reset')
      return true

    default:
      return false
  }
}