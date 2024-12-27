# Chat Persistence System

This document describes the chat persistence implementation in Onyx, which uses SQLite for storing chat messages and managing conversations.

## Overview

The chat persistence system consists of three main components:
1. SQLite Database Layer (`ChatStorage.ts`)
2. State Management (`ChatStore.ts`)
3. UI Components (`ChatDrawerContent.tsx`)

## Database Schema

The SQLite database has a single table:

```sql
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY NOT NULL, 
  messages TEXT
);
```

Where:
- `id`: Unique identifier for each chat conversation
- `messages`: JSON string containing an array of message objects

## Implementation Details

### 1. Database Layer (ChatStorage.ts)

```typescript
import * as SQLite from "expo-sqlite"

let db: SQLite.SQLiteDatabase;

const initDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('onyx.db');
    await db.execAsync('PRAGMA journal_mode = WAL;'); // Enable WAL mode for better performance
  }
  return db;
};

export const initializeDatabase = async () => {
  const database = await initDB();
  await database.execAsync(
    'CREATE TABLE IF NOT EXISTS chats (id TEXT PRIMARY KEY NOT NULL, messages TEXT);'
  );
};

export const loadChat = async (chatId: string) => {
  const database = await initDB();
  const result = await database.getFirstAsync<{ messages: string }>(
    'SELECT messages FROM chats WHERE id = ?;',
    [chatId]
  );
  return result?.messages || '[]'; // Return empty array if no chat found
};

export const saveChat = async (chatId: string, messages: string) => {
  const database = await initDB();
  await database.runAsync(
    'INSERT OR REPLACE INTO chats (id, messages) values (?, ?);',
    [chatId, messages]
  );
};
```

Key features:
- Singleton database connection
- WAL mode for better performance
- Async/await API
- Proper error handling
- Type safety with TypeScript

### 2. State Management (ChatStore.ts)

The chat store manages the state of conversations and handles persistence through MobX-State-Tree:

```typescript
export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    currentConversationId: types.optional(types.string, "default"),
    messages: types.array(MessageModel),
    // ... other props
  })
  .actions((self) => ({
    // Add a new message
    addMessage(message: {
      role: "system" | "user" | "assistant" | "function"
      content: string
      metadata?: any
    }) {
      const msg = MessageModel.create({
        id: Math.random().toString(36).substring(2, 9),
        createdAt: Date.now(),
        ...message,
        metadata: {
          ...message.metadata,
          conversationId: self.currentConversationId,
        }
      })
      self.messages.push(msg)
      return msg
    },

    // Switch to a different conversation
    setCurrentConversationId(id: string) {
      self.currentConversationId = id
      // Load messages for this conversation
      loadChat(id).then(savedMessages => {
        try {
          const parsedMessages = JSON.parse(savedMessages)
          self.messages.clear()
          applySnapshot(self.messages, parsedMessages)
        } catch (e) {
          log.error("Error parsing saved messages:", e)
          self.messages.clear()
        }
      }).catch(e => {
        log.error("Error loading chat:", e)
        self.messages.clear()
      })
    },

    // Start a new chat
    clearMessages() {
      self.messages.clear()
    }
  }))
  .actions(self => ({
    afterCreate() {
      // Initialize the database
      initializeDatabase().catch(e => {
        log.error("Error initializing database:", e)
      })

      // Load initial conversation
      self.setCurrentConversationId(self.currentConversationId)

      // Set up persistence listener
      onSnapshot(self.messages, (snapshot) => {
        saveChat(self.currentConversationId, JSON.stringify(snapshot))
          .catch(e => log.error("Error saving chat:", e))
      })
    }
  }))
```

Key features:
- Automatic persistence using MobX-State-Tree snapshots
- Conversation management
- Error handling and logging
- Type-safe message model

### 3. UI Integration (ChatDrawerContent.tsx)

The UI components integrate with the store to manage conversations:

```typescript
export const ChatDrawerContent = ({ drawerInsets }: Props) => {
  const { chatStore } = useStores()

  const handleNewChat = () => {
    // Generate a new conversation ID
    const newId = `chat_${Date.now()}`
    chatStore.setCurrentConversationId(newId)
    chatStore.clearMessages()
  }

  return (
    <View>
      <TouchableOpacity onPress={handleNewChat}>
        <MaterialCommunityIcons name="chat-plus-outline" size={24} color="white" />
        <Text>New chat</Text>
      </TouchableOpacity>
    </View>
  )
}
```

## Message Flow

1. **App Initialization**:
   - Database is initialized
   - Default conversation is loaded
   - Persistence listener is set up

2. **New Message**:
   ```
   User types message
   → addMessage() is called
   → Message is added to store
   → onSnapshot triggers
   → Message is saved to SQLite
   ```

3. **New Chat**:
   ```
   User clicks "New Chat"
   → handleNewChat() generates new ID
   → setCurrentConversationId() switches context
   → clearMessages() empties the current view
   → New messages will be saved with new ID
   ```

4. **Loading Previous Chat**:
   ```
   setCurrentConversationId() called
   → loadChat() retrieves messages from SQLite
   → Messages are parsed from JSON
   → Store is updated with loaded messages
   ```

## Error Handling

The system includes comprehensive error handling:

1. **Database Errors**:
   - Connection errors are caught and logged
   - Table creation errors are handled
   - Query errors are caught and logged

2. **Message Parsing**:
   - JSON parse errors are caught
   - Invalid message formats are handled
   - Missing data is handled with defaults

3. **Storage Errors**:
   - Save failures are caught and logged
   - Load failures result in empty message list
   - Database initialization failures are logged

## Performance Considerations

1. **SQLite Optimizations**:
   - WAL (Write-Ahead Logging) mode enabled
   - Single database connection (singleton)
   - Prepared statements for queries

2. **State Management**:
   - Efficient updates using MobX-State-Tree
   - Messages filtered by conversation ID
   - Lazy loading of conversations

3. **UI Performance**:
   - Messages rendered only when needed
   - Efficient updates through React's virtual DOM
   - Minimal re-renders with MobX

## Future Improvements

Potential enhancements to consider:

1. **Data Management**:
   - Message cleanup for old conversations
   - Export/import functionality
   - Message search capabilities

2. **Performance**:
   - Message pagination
   - Lazy loading of message history
   - Message compression

3. **Features**:
   - Conversation metadata (title, date, etc.)
   - Message categories or tags
   - Multi-device sync

## Testing

To test the chat persistence:

1. **Database Operations**:
   ```typescript
   // Initialize database
   await initializeDatabase()
   
   // Save a chat
   await saveChat("test_chat", JSON.stringify([
     { id: "1", content: "Hello", role: "user" }
   ]))
   
   // Load a chat
   const messages = await loadChat("test_chat")
   expect(JSON.parse(messages)).toHaveLength(1)
   ```

2. **Store Operations**:
   ```typescript
   const store = ChatStoreModel.create()
   
   // Add message
   store.addMessage({
     role: "user",
     content: "Test message"
   })
   
   // Verify persistence
   const saved = await loadChat(store.currentConversationId)
   expect(JSON.parse(saved)).toHaveLength(1)
   ```