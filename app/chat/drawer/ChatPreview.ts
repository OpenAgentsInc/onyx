export const getChatPreview = (messages: any[]) => {
  if (!messages || messages.length === 0) {
    return "New Chat"
  }
  const lastUserMessage = messages.filter((msg) => msg.role === "user").pop()
  if (!lastUserMessage) {
    return "New Chat"
  }
  const preview = lastUserMessage.content.trim()
  if (preview.length <= 30) {
    return preview
  }
  return preview.slice(0, 30) + "..."
}

export const sortChats = (chats: any[]) => {
  return [...chats].sort((a, b) => {
    const aTime = a.messages[0]?.createdAt || parseInt(a.id.split("_")[1]) || 0
    const bTime = b.messages[0]?.createdAt || parseInt(b.id.split("_")[1]) || 0
    return bTime - aTime // Reverse chronological order
  })
}