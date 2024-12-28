const dummyMessages = [
  {
    id: "1",
    content: "Hello, world!",
    role: "user" as const,
  },
  {
    id: "2",
    content: "How are you?",
    role: "assistant" as const,
  },
  {
    id: "3",
    content: "I'm doing well, thank you!",
    role: "user" as const,
  },
]

export function useChat() {
  return {
    isLoading: false,
    messages: dummyMessages,
  }
}
