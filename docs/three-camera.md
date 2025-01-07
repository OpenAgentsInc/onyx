# Three.js Camera and Interaction Implementation

This document details the implementation of camera controls and user interactions in our Three.js visualization system.

## Camera Setup

### Orthographic vs Perspective

We use an orthographic camera for 2D graph visualization:

```typescript
const camera = new THREE.OrthographicCamera(
  frustumSize * aspect / -2,  // left
  frustumSize * aspect / 2,   // right
  frustumSize / 2,           // top
  frustumSize / -2,          // bottom
  1,                         // near
  1000                       // far
)
```

Unlike perspective cameras, orthographic cameras:
- Render objects at the same size regardless of distance
- Don't have perspective distortion
- Are ideal for 2D visualizations and technical drawings
- Maintain parallel lines as parallel

### Camera Parameters

Key parameters that affect the view:

```typescript
interface CameraState {
  zoomLevel: number      // Current zoom level (0.1 to 5)
  position: {
    x: number,          // Camera X position
    y: number,          // Camera Y position
    z: number           // Fixed at 5 for our 2D setup
  }
  frustumSize: number   // Base size of the view (5 in our setup)
}
```

## Interaction Handling

### Zoom Implementation

The zoom functionality uses mouse wheel events and zooms toward the cursor position:

```typescript
public handleWheel = (event: WheelEvent) => {
  const zoomSpeed = 0.001
  const delta = event.deltaY * zoomSpeed
  const newZoom = Math.max(0.1, Math.min(5, this.zoomLevel * (1 - delta)))
  
  // Calculate zoom center point in world coordinates
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  
  // Convert screen coordinates to world coordinates
  const worldX = x * (this.camera.right - this.camera.left) / 2
  const worldY = y * (this.camera.top - this.camera.bottom) / 2
  
  // Calculate the zoom factor
  const zoomFactor = newZoom / this.zoomLevel
  
  // Update camera position to zoom towards mouse point
  this.cameraPosition.x += worldX * (1 - zoomFactor)
  this.cameraPosition.y += worldY * (1 - zoomFactor)
  
  this.zoomLevel = newZoom
  this.updateCamera()
}
```

Key aspects:
1. Zoom speed is controlled by `zoomSpeed`
2. Zoom level is clamped between 0.1 and 5
3. Zoom center is calculated from mouse position
4. Camera position is adjusted to maintain focus point

### Pan Implementation

Panning is implemented using mouse/touch drag events:

```typescript
public handlePanMove = (x: number, y: number) => {
  if (!this.isDragging) return

  const rect = (this.gl.canvas as HTMLCanvasElement).getBoundingClientRect()
  const deltaX = (x - this.previousTouch.x) / rect.width
  const deltaY = (y - this.previousTouch.y) / rect.height

  // Scale the movement based on zoom level and viewport size
  const movementScale = 5 / this.zoomLevel
  this.cameraPosition.x -= deltaX * movementScale
  this.cameraPosition.y += deltaY * movementScale

  this.updateCamera()
  this.previousTouch = { x, y }
}
```

Key aspects:
1. Movement is scaled based on viewport size
2. Pan speed adjusts with zoom level
3. Coordinates are normalized to viewport size
4. Touch events are handled similarly to mouse events

## Camera Updates

The camera is updated through a centralized method:

```typescript
private updateCamera = () => {
  // Update camera position
  this.camera.position.x = this.cameraPosition.x
  this.camera.position.y = this.cameraPosition.y

  // Update camera frustum
  const aspect = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight
  const frustumSize = 5 / this.zoomLevel
  this.camera.left = frustumSize * aspect / -2
  this.camera.right = frustumSize * aspect / 2
  this.camera.top = frustumSize / 2
  this.camera.bottom = frustumSize / -2
  this.camera.updateProjectionMatrix()

  this.render()
}
```

This ensures:
1. Consistent camera state updates
2. Proper aspect ratio maintenance
3. Immediate visual feedback
4. Proper cleanup and re-rendering

## Event Handling

Events are bound in the React component:

```typescript
useEffect(() => {
  if (Platform.OS === "web" && glCanvas) {
    // Mouse events
    glCanvas.addEventListener("wheel", handleWheel, { passive: false })
    glCanvas.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    
    // Touch events
    glCanvas.addEventListener("touchstart", handleTouchStart, { passive: false })
    glCanvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    glCanvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      // Cleanup event listeners...
    }
  }
}, [glCanvas, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp])
```

Important considerations:
1. Events are bound only on web platform
2. Mouse move and up events are bound to window
3. Touch events are handled separately
4. Proper cleanup on component unmount

## Viewport Resizing

The visualization handles viewport resizing:

```typescript
public resize(width: number, height: number) {
  this.renderer.setSize(width, height)
  this.updateCamera()
}
```

This ensures:
1. Proper canvas size
2. Maintained aspect ratio
3. Correct camera frustum
4. Immediate visual update

## Best Practices

1. Performance:
   - Use requestAnimationFrame for smooth animations
   - Debounce resize events
   - Clean up resources properly

2. User Experience:
   - Maintain focus point during zoom
   - Scale pan speed with zoom level
   - Provide smooth transitions
   - Add visual feedback (cursors)

3. Cross-Platform:
   - Handle both mouse and touch events
   - Check platform capabilities
   - Provide fallbacks when needed

4. Maintenance:
   - Centralize camera updates
   - Clean up event listeners
   - Document magic numbers
   - Use TypeScript for type safety

## Future Improvements

1. Features to consider:
   - Double-click to focus
   - Pinch-to-zoom on touch devices
   - Momentum scrolling
   - Reset view button
   - Custom zoom limits per instance

2. Performance optimizations:
   - Frustum culling for large graphs
   - Level of detail system
   - Event throttling
   - WebGL2 features when available

3. User experience:
   - Zoom to fit
   - Smooth animations
   - Better touch controls
   - Keyboard shortcuts

4. Development:
   - Better error handling
   - More configuration options
   - Better type safety
   - Testing utilities