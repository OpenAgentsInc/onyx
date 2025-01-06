# AgentGraph Documentation

The AgentGraph system provides a flexible 2D/3D knowledge graph visualization using Three.js and Expo GL. It's designed to display connected information nodes in an interactive graph format.

## Architecture

The system is split into several modular components:

```
app/agentgraph/
├── AgentGraph.ts       # Main graph management class
├── NodeRenderer.ts     # Node visualization handling
├── EdgeRenderer.ts     # Edge/connection visualization
└── types.ts           # Shared types and interfaces
```

### Core Components

#### AgentGraph Class
The main class that manages the graph visualization. It handles:
- Scene setup and management
- Camera configuration
- Node and edge management
- Animation loop
- Resource cleanup

```typescript
const graph = new AgentGraph(gl, {
  is3D: false,
  nodeSpacing: 2,
  backgroundColor: 0x09090b,
  animate: false
})
```

#### NodeRenderer
Handles the creation and styling of individual nodes in the graph:
- Node mesh creation
- Text rendering
- Visual styling
- Size calculations

```typescript
const nodeMesh = NodeRenderer.createNodeMesh(content, position, {
  color: 0x111111,
  textColor: "#00ff88",
  fontSize: 24,
  padding: 20,
  opacity: 0.9
})
```

#### EdgeRenderer
Manages the connections between nodes:
- Edge creation
- Line styling
- Position updates
- Visual properties

```typescript
const edge = EdgeRenderer.createConnection(startPos, endPos, {
  color: 0x00ff88,
  opacity: 0.6,
  lineWidth: 1
})
```

## Usage

### Basic Setup

```typescript
import { AgentGraph } from "@/agentgraph/AgentGraph"
import { KnowledgeNode } from "@/agentgraph/types"

// Initialize with GL context
const graph = new AgentGraph(gl, {
  is3D: false,
  animate: false,
  nodeSpacing: 3
})

// Create nodes
const nodes: KnowledgeNode[] = [
  {
    position: new THREE.Vector3(0, 0, 0),
    content: "Main Node",
    connections: [1, 2]
  },
  {
    position: new THREE.Vector3(-2, -1, 0),
    content: "Connected Node 1",
    connections: [0]
  },
  {
    position: new THREE.Vector3(2, -1, 0),
    content: "Connected Node 2",
    connections: [0]
  }
]

// Set nodes in graph
graph.setNodes(nodes)
```

### Configuration Options

```typescript
interface GraphOptions {
  is3D?: boolean          // Enable 3D rendering (default: false)
  nodeSpacing?: number    // Space between nodes (default: 2)
  backgroundColor?: number // Background color (default: 0x09090b)
  animate?: boolean       // Enable animations (default: false)
}

interface NodeRenderOptions {
  color?: number         // Node background color
  textColor?: string    // Text color
  fontSize?: number     // Text size in pixels
  padding?: number      // Internal padding
  opacity?: number      // Node opacity
}

interface EdgeRenderOptions {
  color?: number        // Edge line color
  opacity?: number      // Edge opacity
  lineWidth?: number    // Line thickness
}
```

### Lifecycle Management

```typescript
// Resize handling
graph.resize(width, height)

// Cleanup
graph.dispose()
```

## Implementation Example

Here's how it's used in the Inspector3D component:

```typescript
export function Inspector3D({ selectedItem }: Inspector3DProps) {
  const graphRef = useRef<AgentGraph>()

  const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
    // Initialize with 2D options
    graphRef.current = new AgentGraph(gl, {
      is3D: false,
      animate: false,
      nodeSpacing: 3
    })

    if (selectedItem) {
      const nodes: KnowledgeNode[] = [
        {
          position: new THREE.Vector3(0, 1, 0),
          content: "Main Node",
          connections: [1, 2]
        },
        // ... more nodes
      ]
      graphRef.current.setNodes(nodes)
    }
  }, [selectedItem])

  // Cleanup
  useEffect(() => {
    return () => {
      if (graphRef.current) {
        graphRef.current.dispose()
      }
    }
  }, [])

  return (
    <GLView
      style={styles.canvas}
      onContextCreate={onContextCreate}
    />
  )
}
```

## Best Practices

1. **Resource Management**
   - Always call `dispose()` when unmounting
   - Clear nodes before setting new ones
   - Handle WebGL context loss gracefully

2. **Performance**
   - Limit number of nodes for better performance
   - Use 2D mode for simpler visualizations
   - Disable animation when not needed
   - Consider text length when creating nodes

3. **Layout**
   - Space nodes appropriately using nodeSpacing
   - Consider screen size when positioning nodes
   - Limit text length to prevent overflow
   - Use consistent node sizes

4. **Styling**
   - Use contrasting colors for better visibility
   - Keep opacity in mind for overlapping elements
   - Consider color accessibility
   - Maintain consistent visual hierarchy

## Known Limitations

1. Text Rendering
   - Long text may break node layout
   - Font loading depends on platform support
   - Limited text styling options

2. Performance
   - Large graphs may impact performance
   - Animation can be costly on mobile devices
   - Text rendering is relatively expensive

3. Interaction
   - Limited touch/mouse interaction in current version
   - No zoom functionality implemented yet
   - Pan controls need to be added separately

## Future Improvements

1. Planned Features
   - Zoom controls
   - Node dragging
   - Auto-layout algorithms
   - Better text wrapping
   - Touch gesture support
   - Node collapsing/expanding
   - Custom node shapes
   - Edge labels
   - Multiple edge types

2. Performance Optimizations
   - Instance rendering for similar nodes
   - Texture atlasing for text
   - Culling for large graphs
   - Web Workers for layout calculations

3. Visual Enhancements
   - Node themes
   - Edge animations
   - Custom fonts
   - Node icons/images
   - Edge arrows
   - Node grouping