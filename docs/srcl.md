# Sacred Component Library Integration

We're using components from the [Sacred Component Library](https://github.com/internet-development/www-sacred) in our app via the 'use dom' directive in Expo. This allows us to maintain a consistent, terminal-inspired aesthetic across our applications.

## Current Implementation

We've adapted the Sacred Card component for use in our app with these modifications:
- Converted SCSS modules to inline styles
- Adapted for dark theme (white text on black background)
- Integrated JetBrains Mono font from our typography system
- Removed DOM-specific code for cross-platform compatibility

Example usage:
```typescript
'use dom';

const Card = ({ title, children }) => {
  return (
    <article style={styles.card}>
      <header style={styles.action}>
        <div style={styles.left} aria-hidden="true"></div>
        <h2 style={styles.title}>{title}</h2>
        <div style={styles.right} aria-hidden="true"></div>
      </header>
      <section style={styles.children}>{children}</section>
    </article>
  );
};
```

## Guidelines for Adding New Components

When pulling in additional components from Sacred:

1. **Component Selection**
   - Browse the Sacred repo's `components/` directory
   - Look for components that match our terminal-inspired aesthetic
   - Prefer simpler components that don't rely heavily on DOM APIs

2. **Adaptation Process**
   - Copy the component's core structure
   - Convert SCSS modules to inline styles
   - Remove any DOM-specific code (document, window, etc.)
   - Use our typography system (JetBrains Mono fonts)
   - Maintain dark theme colors (black backgrounds, white text/borders)

3. **Cross-Platform Considerations**
   - Avoid using DOM-specific features outside 'use dom' files
   - Test component in both web and native environments
   - Keep styles simple and compatible with React Native's style system
   - Use flexbox for layouts when possible

4. **Style Conversion Example**
   From SCSS:
   ```scss
   .card {
     position: relative;
     display: block;
     padding: 0 1ch calc(8px * var(--theme-line-height-base)) 1ch;
   }
   ```
   To inline styles:
   ```typescript
   const styles = {
     card: {
       position: 'relative',
       display: 'block',
       padding: '0 1ch calc(8px * 1.5) 1ch',
       backgroundColor: '#000',
       color: '#fff',
       fontFamily: 'jetBrainsMonoRegular, monospace',
     }
   };
   ```

5. **Font Usage**
   - Use 'jetBrainsMonoRegular' for normal text
   - Use 'jetBrainsMonoBold' for headings and emphasis
   - Don't rely on font-weight variations beyond Regular and Bold

## Styling Patterns

Maintain these consistent patterns when adapting components:

```typescript
const styles = {
  // Container elements
  container: {
    backgroundColor: '#000',
    minHeight: '100vh',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  
  // Text elements
  text: {
    fontFamily: 'jetBrainsMonoRegular, monospace',
    color: '#fff',
    fontSize: '14px',
    margin: '8px 0',
  },
  
  // Borders and dividers
  border: {
    boxShadow: 'inset 1px 0 0 0 #fff',  // Single white line
  }
};
```

## Future Considerations

Components we might want to adapt next:
- `Button.tsx` for consistent action buttons
- `ListItem.tsx` for structured data display
- `Badge.tsx` for status indicators
- `ActionBar.tsx` for command interfaces
- `Message.tsx` for system notifications

When adding new components:
1. Start with the simplest version that works
2. Add features incrementally as needed
3. Document any DOM-specific features or limitations
4. Keep the terminal-inspired aesthetic consistent
5. Test thoroughly in both web and native environments

## Resources

- [Sacred Component Library](https://github.com/internet-development/www-sacred)
- [Expo DOM Components Guide](https://docs.expo.dev/guides/dom-components/)
- [React Native Style Guide](https://reactnative.dev/docs/style)