# Sacred Component Library Integration

We're using components from the [Sacred Component Library](https://github.com/internet-development/www-sacred) in our app via the 'use dom' directive in Expo. This allows us to maintain a consistent, terminal-inspired aesthetic across our applications.

## Current Implementation

We have adapted these Sacred components:

### Button
```typescript
// components/Button.tsx
'use dom';

interface ButtonProps {
  theme?: 'PRIMARY' | 'SECONDARY';
  isDisabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ theme = 'PRIMARY', isDisabled, children }) => {
  // ...
};
```

### Card
```typescript
// components/Card.tsx
'use dom';

interface CardProps {
  title?: string;
  mode?: 'left' | 'right';
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, mode, children }) => {
  // ...
};
```

## Adding New Components

When adding a new component from Sacred, follow these steps:

1. **Component Selection**
   ```bash
   # Browse Sacred's components directory
   components/
   ├── Button.tsx        # Already implemented
   ├── Card.tsx         # Already implemented
   ├── ListItem.tsx     # Potential next component
   ├── Badge.tsx        # Potential next component
   └── ...
   ```

2. **File Creation**
   ```bash
   # Create new component file in our components directory
   components/
   ├── Button.tsx
   ├── Card.tsx
   └── NewComponent.tsx  # New file
   ```

3. **Basic Structure**
   ```typescript
   'use dom';
   
   import * as React from 'react';
   
   const styles = {
     // Convert SCSS to inline styles
     root: {
       // Base styles
     },
     variants: {
       // Different states/variants
     }
   };
   
   interface Props {
     // TypeScript interface
   }
   
   const Component: React.FC<Props> = ({ ...props }) => {
     return (
       // JSX
     );
   };
   
   export default Component;
   ```

4. **Style Conversion**
   - Convert SCSS to inline styles
   - Use our monospace font
   - Maintain dark theme
   
   From Sacred SCSS:
   ```scss
   .root {
     font-family: var(--font-family-mono);
     padding: calc(var(--base) * 2);
     border: 1px solid var(--border);
   }
   ```
   
   To our inline styles:
   ```typescript
   const styles = {
     root: {
       fontFamily: 'jetBrainsMonoRegular, monospace',
       padding: 'calc(8px * 2)',
       boxShadow: 'inset 0 0 0 1px #fff',
     }
   };
   ```

5. **Font Usage**
   ```typescript
   // Use these font families consistently
   const fonts = {
     normal: 'jetBrainsMonoRegular, monospace',
     bold: 'jetBrainsMonoBold, monospace',
   };
   ```

6. **Color Scheme**
   ```typescript
   // Use these colors consistently
   const colors = {
     background: '#000',
     text: '#fff',
     border: '#fff',
     disabled: '#333',
     disabledText: '#666',
   };
   ```

## Component Guidelines

1. **File Structure**
   ```typescript
   'use dom';  // Always include this
   
   import * as React from 'react';
   
   // Styles object
   const styles = {};
   
   // TypeScript interface
   interface Props {}
   
   // Component
   const Component = () => {};
   
   export default Component;
   ```

2. **Style Patterns**
   ```typescript
   const styles = {
     // Base styles
     root: {
       fontFamily: 'jetBrainsMonoRegular, monospace',
       color: '#fff',
       backgroundColor: '#000',
     },
     
     // Interactive states
     interactive: {
       cursor: 'pointer',
       transition: '200ms ease all',
     },
     
     // Borders
     border: {
       boxShadow: 'inset 0 0 0 1px #fff',
     },
   };
   ```

3. **Props Pattern**
   ```typescript
   interface Props {
     // Required props first
     title: string,
     // Optional props with ?
     theme?: 'PRIMARY' | 'SECONDARY',
     // React standards last
     children?: React.ReactNode,
     style?: React.CSSProperties,
   }
   ```

## Testing New Components

1. Create a test implementation in app/index.tsx
2. Test all variants and states
3. Verify dark theme consistency
4. Check font rendering
5. Test responsive behavior

## Next Components to Add

Priority order for future components:
1. ListItem - For structured data display
2. Badge - For status indicators
3. ActionBar - For command interfaces
4. Message - For system notifications
5. Input - For form fields

## Common Adaptations

1. **Font Replacement**
   ```typescript
   // Sacred
   fontFamily: 'var(--font-family-mono)'
   // Our version
   fontFamily: 'jetBrainsMonoRegular, monospace'
   ```

2. **Color Scheme**
   ```typescript
   // Sacred
   color: 'var(--theme-text)'
   backgroundColor: 'var(--theme-background)'
   // Our version
   color: '#fff'
   backgroundColor: '#000'
   ```

3. **Borders**
   ```typescript
   // Sacred
   border: '1px solid var(--theme-border)'
   // Our version
   boxShadow: 'inset 0 0 0 1px #fff'
   ```

## Resources

- [Sacred Component Library](https://github.com/internet-development/www-sacred)
- [Expo DOM Components Guide](https://docs.expo.dev/guides/dom-components/)
- [React Native Style Guide](https://reactnative.dev/docs/style)

## Troubleshooting

Common issues and solutions:

1. **Text Wrapping in Buttons**
   ```typescript
   // Add to prevent text wrapping
   whiteSpace: 'nowrap'
   ```

2. **Border Alignment**
   ```typescript
   // Use negative margin to adjust alignment
   marginTop: '-7px'  // Example for card titles
   ```

3. **Font Loading**
   ```typescript
   // Ensure font is loaded before rendering
   fontFamily: 'jetBrainsMonoRegular, monospace'
   ```