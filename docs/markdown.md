# Markdown Support

The chat interface supports rich markdown rendering using the `react-native-markdown-display` package. This allows for formatted text, code blocks with syntax highlighting, tables, lists, and more in chat messages.

## Implementation

The markdown rendering is implemented in three main parts:

1. **MessageContent Component** (`app/onyx/markdown/MessageContent.tsx`)
   - Handles the actual markdown rendering
   - Manages link interactions
   - Adds blockquote formatting for user messages

2. **Markdown Styles** (`app/onyx/markdown/styles.ts`)
   - Defines consistent styling for all markdown elements
   - Uses app theme colors for consistency
   - Provides proper spacing and formatting

3. **ChatOverlay Integration** (`app/onyx/ChatOverlay.tsx`)
   - Integrates markdown rendering with the chat interface
   - Maintains clipboard functionality
   - Handles message scrolling

## Supported Markdown Features

The following markdown features are supported and styled:

### Text Formatting
- **Bold** using `**text**` or `__text__`
- *Italic* using `*text*` or `_text_`
- ~~Strikethrough~~ using `~~text~~`
- `Inline code` using \`code\`

### Code Blocks
\```javascript
function example() {
  console.log("Hello world");
}
\```

### Lists
- Unordered lists using `- `, `+ `, or `* `
- Ordered lists using `1. `, `2. `, etc.
- Nested lists with indentation

### Links
- [Regular links](https://example.com) using `[text](url)`
- Links with titles using `[text](url "title")`

### Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

### Blockquotes
> Blockquotes using `> text`
> > Nested blockquotes

### Headers
# H1 using `# text`
## H2 using `## text`
### H3 using `### text`

## Styling

The markdown styles are defined in `app/onyx/markdown/styles.ts` and include:

- Theme-consistent colors
- Proper spacing and margins
- Code block formatting
- Table borders and padding
- List indentation
- Link colors
- Blockquote formatting

## Usage in Messages

Messages are automatically rendered with markdown support. User messages are wrapped in blockquotes for visual distinction.

Example message:
\```markdown
Here's a **formatted** message with some `code` and a [link](https://example.com).

- List item 1
- List item 2

\```javascript
console.log("Hello world");
\```
\```

## Link Handling

Links in messages are handled by the `handleLinkPress` function in `MessageContent.tsx`. By default, links open in the device's browser using React Native's `Linking` API.

## Clipboard Integration

The entire message content (including markdown) can be copied to the clipboard by tapping on the message. The raw markdown text is copied, allowing users to paste the formatted text elsewhere.

## Customization

### Modifying Styles

To modify markdown styles, edit the `markdownStyles` object in `app/onyx/markdown/styles.ts`. The styles follow React Native's StyleSheet format and can be customized for each markdown element type.

Example:
```typescript
export const markdownStyles = StyleSheet.create({
  code_block: {
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 4,
    // Add or modify styles here
  },
  // Other style overrides
})
```

### Custom Link Handling

To modify how links are handled, update the `handleLinkPress` function in `MessageContent.tsx`:

```typescript
const handleLinkPress = (url: string) => {
  // Custom link handling logic
  return Linking.openURL(url)
}
```

## Adding New Features

To add support for additional markdown features or custom rendering:

1. Add new styles to `markdownStyles`
2. Update `MessageContent.tsx` with any new props or handlers
3. If needed, create custom render rules for specific markdown elements

## Dependencies

- `react-native-markdown-display`: Main markdown rendering package
- `@react-native-clipboard/clipboard`: For copy functionality
- React Native's `Linking` API: For handling URLs

## Installation

1. Install the required package:
```bash
yarn add react-native-markdown-display
```

2. The markdown components are already integrated into the chat interface - no additional setup required.

## Notes

- User messages are automatically prefixed with `> ` to render as blockquotes
- Code blocks support syntax highlighting
- All markdown rendering is done using native components (not WebView)
- Styles automatically adapt to the app's theme colors
- Messages maintain touch interaction for clipboard functionality