# Tool Invocation Component

The Tool Invocation component displays the execution and results of AI tool calls in a mobile-friendly format. It's designed to show tool execution status, parameters, and results in a clear and interactive way.

## Location

- Main component: `app/onyx/markdown/ToolInvocation.tsx`
- Integration: `app/onyx/markdown/MessageContent.tsx`

## Features

- Display tool execution status (pending/completed/failed)
- Show tool name and repository information
- View input parameters in a modal
- View file contents in a modal (when available)
- Mobile-optimized touch interactions
- Native styling matching app theme

## Component Structure

### ToolInvocation Props

```typescript
interface ToolInvocation {
  id?: string
  toolCallId?: string
  tool_name?: string
  toolName?: string
  input?: JSONValue
  args?: JSONValue
  output?: JSONValue
  result?: JSONValue
  status?: 'pending' | 'completed' | 'failed'
  state?: 'call' | 'result' | 'partial-call'
}

interface ModalContentProps {
  title: string
  description: string
  content: any
  visible: boolean
  onClose: () => void
}
```

### Visual Elements

1. **Header**
   - Tool name
   - Repository info (if available)
   - Status indicator (⟳ pending, ✓ completed, ✗ failed)

2. **Content**
   - Summary of tool execution
   - Interactive buttons for viewing details

3. **Modals**
   - Input Parameters modal
   - File Content modal (when available)

## Usage in MessageContent

The ToolInvocation component is integrated into the MessageContent component to display tool calls within chat messages:

```typescript
interface MessageContentProps {
  message: Message & {
    toolInvocations?: Array<any>
  }
}

// Usage in render
<View style={[styles.container, isUserMessage && styles.userMessage]}>
  {hasContent && (
    <Markdown style={markdownStyles}>
      {message.content}
    </Markdown>
  )}

  {hasToolInvocations && (
    <View style={[styles.toolInvocations, hasContent && styles.toolInvocationsWithContent]}>
      {message.toolInvocations.map((invocation, index) => (
        <ToolInvocation
          key={`${invocation.id || invocation.toolCallId}-${index}`}
          toolInvocation={invocation}
        />
      ))}
    </View>
  )}
</View>
```

## Styling

The component uses React Native's StyleSheet system and follows the app's theme colors:

```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  // ... other styles
})
```

Key style features:
- Consistent border radius and spacing
- Clear visual hierarchy
- Responsive touch targets
- Modal overlay for detailed information
- Status-specific colors for indicators
- Proper spacing when combined with message content

## Modal System

The component uses React Native's Modal component for displaying detailed information:

1. **Input Parameters Modal**
   - Shows all input parameters in a scrollable view
   - JSON formatting for readability
   - Close button for dismissal
   - Semi-transparent overlay background

2. **File Content Modal**
   - Displays file contents when available
   - Scrollable for long content
   - Monospace font for code readability
   - Maximum height constraint with scrolling

## Status Indicators

Status is displayed using text characters for simplicity and reliability:
- ⟳ Pending (gray color)
- ✓ Completed (text color)
- ✗ Failed (error color)

## Integration with Message System

The component integrates with the AI message system by:
1. Detecting tool invocations in messages
2. Rendering tool cards below message content
3. Maintaining message flow and readability
4. Preserving message hierarchy
5. Supporting partial call states during execution

## Best Practices

When using the ToolInvocation component:

1. Always provide complete tool invocation data
2. Handle all possible states (pending/completed/failed/partial-call)
3. Ensure modals have appropriate content
4. Test touch interactions for usability
5. Verify status indicator visibility
6. Check modal scrolling with large content
7. Consider content spacing when tools appear with message text

## Error Handling

The component includes error handling for:
- Invalid tool invocation data
- JSON parsing errors
- Missing or malformed content
- Modal interaction edge cases
- Missing optional fields

## Future Improvements

Potential areas for enhancement:
1. Animation for status changes
2. Expanded touch interactions
3. Additional tool-specific displays
4. Enhanced error messaging
5. Accessibility improvements
6. Performance optimizations for large datasets
7. Custom styling per tool type
8. Interactive tool results
9. Retry functionality for failed invocations