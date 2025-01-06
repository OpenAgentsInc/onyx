# OSINT Chat Implementation

This document details the implementation of the OSINT (Open Source Intelligence) chat interface, which combines a real-time chat with an intelligence data inspector.

## File Structure

```
app/
  osint/
    ChatDemo.tsx         # Main chat component with split view
    components/
      Message.tsx        # Individual message component
      Inspector3D.tsx    # 3D visualization of OSINT data
    types.ts            # TypeScript interfaces
    styles.ts           # Shared styles
    data.ts            # Sample OSINT data and interfaces
```

## Key Components

### ChatDemo.tsx

The main component implements a split-view interface with a chat panel and an inspector panel. 

Key features:
- Real-time chat with message history
- Split view layout using React Native's flexbox
- OSINT data inspection panel
- Auto-scroll and focus management
- Keyboard event handling

### Message Component

Located at `app/osint/components/Message.tsx`, handles individual message rendering:
```typescript
interface MessageProps {
  message: Message
}

export function Message({ message }: MessageProps) {
  return (
    <View style={{ marginVertical: 15 }}>
      <Text className="opacity-50">{message.user}</Text>
      <Text>{message.text}</Text>
    </View>
  )
}
```

### Inspector3D Component

Located at `app/osint/components/Inspector3D.tsx`, provides a 3D visualization of OSINT data relationships:

Key features:
- Interactive 3D scene using Three.js
- Node-based visualization of OSINT events
- Dynamic text rendering with proper scaling
- Animated connections between related events
- Responsive canvas sizing

Text Rendering Implementation:
```typescript
// Create text sprite with high visibility
const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")
if (context) {
  // High-resolution canvas for crisp text
  canvas.width = 512
  canvas.height = 128
  context.fillStyle = "#00ff88"
  context.font = "bold 32px Arial"
  context.textAlign = "center"
  context.textBaseline = "middle"
  
  // Add padding and measure text
  const padding = 20
  const textMetrics = context.measureText(content)
  const textWidth = textMetrics.width + padding * 2
  const textHeight = 40 + padding * 2
  
  // Draw centered text
  context.fillText(content, canvas.width / 2, canvas.height / 2)

  // Create sprite with dynamic scaling
  const sprite = new THREE.Sprite(spriteMaterial)
  const scaleX = (textWidth / canvas.width) * 2
  const scaleY = (textHeight / canvas.height) * 2
  sprite.scale.set(Math.max(scaleX, 1.5), Math.max(scaleY, 0.4), 1)
  sprite.position.z = 0.1
}
```

## Data Structure

### Message Interface
```typescript
interface Message {
  id: number
  text: string
  user: string
  osintData?: OSINTEvent  // Optional OSINT data
}
```

### OSINT Event Interface
```typescript
interface OSINTEvent {
  kind: number
  id: string
  content: string  // JSON-encoded string
  tags: any[]
}
```

### Knowledge Node Interface
```typescript
interface KnowledgeNode {
  position: THREE.Vector3
  content: string
  mesh?: THREE.Mesh
  textMesh?: THREE.Mesh
  edges?: THREE.Line[]
  connections: number[]
}
```

## Styling

### Component Library Usage

The implementation uses the reusable UI components from `@/components/ui/`:
- Card and variants (CardHeader, CardContent, etc.)
- Input
- Text

### Layout Approach

1. Container Layout:
```typescript
<View style={{ 
  flexDirection: "row", 
  height: "100vh",
  padding: 20,
  gap: 20,
}}>
```

2. Panel Layout:
```typescript
<View style={{ flex: 1 }}>
  <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
```

### Styling Methodology

1. Component-specific styles in `styles.ts`:
```typescript
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
    margin: 20,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    padding: 20,
    paddingTop: 0,
  },
  scrollView: {
    flex: 1,
  },
})
```

2. Typography:
- Uses `typography.primary.normal` from theme
- Consistent font styling across components

3. Responsive Design:
- Flex-based layout for adaptability
- Percentage-based widths
- Viewport height units

## React Native Web Considerations

The implementation uses React Native components but is optimized for web:

1. Web-specific features:
```typescript
onClick={() => message.osintData && setSelectedItem(message.osintData)}
style={{ cursor: message.osintData ? 'pointer' : 'default' }}
```

2. Cross-platform compatibility:
- Uses `ScrollView` from React Native
- Implements web-specific event handlers
- Maintains native compatibility

## State Management

1. Message State:
```typescript
const [messages, setMessages] = useState<(Message & { osintData?: OSINTEvent })[]>(initialMessages)
```

2. Input Management:
```typescript
const [value, setValue] = useState("")
const inputRef = useRef<HTMLInputElement>(null)
```

3. Selection State:
```typescript
const [selectedItem, setSelectedItem] = useState<OSINTEvent | null>(null)
```

## Event Handling

1. Message Submission:
```typescript
const handleSubmit = async (e?: any) => {
  if (e?.key === "Enter" || !e) {
    e?.preventDefault?.()
    if (value.trim()) {
      // Handle message creation
    }
  }
}
```

2. Focus Management:
```typescript
useEffect(() => {
  inputRef.current?.focus()
}, [])
```

## Inspector Implementation

The inspector panel displays OSINT data when a message is clicked:

1. Empty State:
```typescript
if (!selectedItem) {
  return (
    <Card style={{ height: "100%" }}>
      <CardHeader>
        <CardTitle>Inspector</CardTitle>
        <CardDescription>Click on a message to inspect its data</CardDescription>
      </CardHeader>
    </Card>
  )
}
```

2. Data Display:
- Parses JSON content
- Displays structured data
- Shows tags and metadata
- 3D visualization of relationships

## Future Improvements

1. Planned Features:
- Draggable inspector panel
- Infinite canvas for OSINT data visualization
- Multiple selection support
- Advanced filtering and search
- Enhanced 3D visualization controls
- Custom node appearance options

2. Technical Debt:
- Type safety for OSINT data structure
- Better error handling for JSON parsing
- Proper event type definitions
- Performance optimization for large datasets
- WebGL fallbacks for mobile devices

## Development Guidelines

1. Code Style:
- Use TypeScript interfaces for type safety
- Implement proper error boundaries
- Follow React Native best practices
- Maintain web compatibility

2. Component Structure:
- Keep components focused and small
- Extract reusable logic to hooks
- Maintain clear component hierarchy
- Document complex implementations

3. State Management:
- Use local state for UI elements
- Consider Redux for scaling
- Implement proper state updates
- Handle side effects consistently

## Testing

Currently implemented:
- Basic component rendering
- State management
- User interactions

Needed:
- Unit tests for components
- Integration tests for chat flow
- E2E tests for user interactions
- Performance testing
- WebGL compatibility testing

## Dependencies

Key libraries:
- React Native Web
- Three.js for 3D visualization
- UI components from @/components/ui
- Typography from theme
- StyleSheet from React Native