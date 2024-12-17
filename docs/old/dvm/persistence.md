# DVM Event Persistence

The Onyx app uses SQLite for local persistence of Nostr events, particularly for DVM (Data Vending Machine) interactions. This ensures that event references, responses, and status updates remain available even when offline or when navigating between screens.

## Database Structure

Events are stored in a `posts` table with the following schema:

```sql
create table if not exists posts (
  id string not null primary key,
  content string,
  kind integer,
  pubkey string,
  sig string,
  tags string,
  p1 string,
  e1 string,
  created_at integer,
  verified boolean
);
```

- `id`: The event ID (primary key)
- `content`: Event content
- `kind`: Nostr event kind (e.g., 5050 for requests, 6050 for results)
- `pubkey`: Publisher's public key
- `sig`: Event signature
- `tags`: JSON stringified array of tags
- `p1`: First 'p' tag value for quick filtering
- `e1`: First 'e' tag value for quick filtering
- `created_at`: Unix timestamp
- `verified`: Boolean flag for verification status

## Implementation

### Database Connection

The database is initialized using the `connectDb()` function from `app/services/nostr/db`:

```typescript
import { connectDb } from "../services/nostr/db"
const db = useRef(connectDb())
```

### Event Loading

When viewing DVM responses, we load existing events from the database:

```typescript
const loadFromDb = async () => {
  try {
    const filter = [{
      kinds: [6050, 7000], // Results and feedback events
      "#e": [event.id],    // Reference the original request
    }]
    
    const events = await db.current.list(filter)
    if (events.length > 0) {
      setReferences(events.sort((a, b) => b.created_at - a.created_at))
    }
  } catch (error) {
    console.error("Failed to load references from DB:", error)
  }
}
```

### Event Saving

New events are saved to the database as they arrive from relays:

```typescript
async (referenceEvent) => {
  // Save to DB first
  try {
    await db.current.saveEventSync(referenceEvent)
  } catch (error) {
    console.error("Failed to save event to DB:", error)
  }

  // Then update UI state
  setReferences(prev => {
    if (prev.some(e => e.id === referenceEvent.id)) return prev
    return [...prev, referenceEvent].sort((a, b) => b.created_at - a.created_at)
  })
}
```

### Event Querying

The database supports filtering events by:
- Event kinds
- Tag values (e.g., finding all responses to a specific request)
- Time range
- Publisher pubkeys

Example query for DVM responses:

```typescript
const filter = [{
  kinds: [6050, 7000],  // Results and feedback
  "#e": [requestId],    // Reference tag
  since: timestamp      // Optional time filter
}]

const events = await db.list(filter)
```

## Performance Considerations

1. **Batch Processing**: Events are queued and saved in batches to reduce database writes
2. **Index Usage**: The schema includes commonly queried fields like `kind` and `e1` for efficient filtering
3. **Memory Management**: Events are loaded on-demand rather than all at once
4. **Deduplication**: Both database and UI layers check for duplicate events

## Error Handling

The persistence layer includes error handling for:
- Database connection failures
- Save/load operation failures
- JSON parsing errors for tags
- Invalid event data

Example error handling:

```typescript
try {
  await db.current.saveEventSync(event)
} catch (error) {
  console.error("Failed to save event:", error)
  // Optionally show user feedback
}
```

## Usage in Components

Components that need event persistence should:

1. Initialize DB connection using `connectDb()`
2. Load existing events on mount
3. Save new events as they arrive
4. Handle errors appropriately
5. Clean up subscriptions when unmounting

Example component setup:

```typescript
const MyComponent = () => {
  const db = useRef(connectDb())
  const [events, setEvents] = useState([])

  // Load existing events
  useEffect(() => {
    loadFromDb()
  }, [])

  // Subscribe to new events
  useEffect(() => {
    const sub = subscribeToEvents(async (event) => {
      await db.current.saveEventSync(event)
      setEvents(prev => [...prev, event])
    })
    return () => sub.unsub()
  }, [])

  // ... rest of component
}
```

## Benefits

1. **Offline Support**: Events remain available without network connection
2. **Navigation Persistence**: Data survives screen navigation
3. **Reduced Network Load**: Cached events don't need to be re-fetched
4. **Better UX**: Instant loading of previously seen events
5. **Data Integrity**: Events are stored with their signatures and verification status