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
  state?: 'call' | 'result'
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
<View style={styles.container}>
  {hasContent && (
    <Markdown style={markdownStyles}>
      {message.content}
    </Markdown>
  )}

  {hasToolInvocations && (
    <View style={styles.toolInvocations}>
      {message.toolInvocations.map((invocation, index) => (
        <ToolInvocation
          key={`${invocation.id}-${index}`}
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

## Modal System

The component uses React Native's Modal component for displaying detailed information:

1. **Input Parameters Modal**
   - Shows all input parameters in a scrollable view
   - JSON formatting for readability
   - Close button for dismissal

2. **File Content Modal**
   - Displays file contents when available
   - Scrollable for long content
   - Monospace font for code readability

## Status Indicators

Status is displayed using text characters for simplicity and reliability:
- ⟳ Pending (spinning animation)
- ✓ Completed (success)
- ✗ Failed (error)

## Integration with Message System

The component integrates with the AI message system by:
1. Detecting tool invocations in messages
2. Rendering tool cards below message content
3. Maintaining message flow and readability
4. Preserving message hierarchy

## Best Practices

When using the ToolInvocation component:

1. Always provide complete tool invocation data
2. Handle both success and error states
3. Ensure modals have appropriate content
4. Test touch interactions for usability
5. Verify status indicator visibility
6. Check modal scrolling with large content

## Error Handling

The component includes error handling for:
- Invalid tool invocation data
- JSON parsing errors
- Missing or malformed content
- Modal interaction edge cases

## Future Improvements

Potential areas for enhancement:
1. Animation for status changes
2. Expanded touch interactions
3. Additional tool-specific displays
4. Enhanced error messaging
5. Accessibility improvements
6. Performance optimizations for large datasets