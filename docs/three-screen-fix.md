# Three.js Screen Navigation Fix

## Issue
When navigating between screens in React Navigation with a Three.js/WebGL canvas, the animation would freeze upon returning to the screen. This was caused by WebGL context corruption when the screen loses focus.

## Solution
The solution involves three key components:

1. Force WebGL context recreation on focus changes
2. Proper cleanup of all Three.js resources
3. Strict lifecycle management with animation frames

### Key Implementation Details

1. **Force Context Recreation**
```tsx
<GLView
  key={isFocused ? "focused" : "unfocused"}  // Forces new context on focus change
  onContextCreate={onContextCreate}
/>
```

2. **Resource Cleanup**
```typescript
const cleanupGL = useCallback(() => {
  // Cancel any pending animation frames
  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = undefined;
  }

  // Dispose of Three.js resources
  if (rendererRef.current) {
    rendererRef.current.dispose();
    rendererRef.current = undefined;
  }

  if (cubeRef.current) {
    cubeRef.current.geometry.dispose();
    (cubeRef.current.material as THREE.Material).dispose();
    cubeRef.current = undefined;
  }

  if (sceneRef.current) {
    sceneRef.current.clear();
    sceneRef.current = undefined;
  }

  // Clear all refs
  glRef.current = undefined;
  cameraRef.current = undefined;
  pointLight1Ref.current = undefined;
  pointLight2Ref.current = undefined;
}, []);
```

3. **Focus Change Handling**
```typescript
useEffect(() => {
  if (isFocused) {
    cleanupGL();
    // GLView will create new context due to key change
  } else {
    cleanupGL();
  }
}, [isFocused, cleanupGL]);
```

4. **Animation Loop Safety**
```typescript
const animate = useCallback(() => {
  if (!mountedRef.current || !isFocused) {
    return;
  }

  // Only request next frame if still mounted and focused
  if (mountedRef.current && isFocused) {
    animationFrameRef.current = requestAnimationFrame(animate);
  }
}, [isFocused]);
```

## Why This Works

1. The `key` prop on GLView forces React to unmount and remount the component when focus changes, ensuring a fresh WebGL context
2. The `cleanupGL` function ensures no resources are leaked when switching screens
3. The animation loop checks both mount and focus state before continuing
4. All Three.js resources are properly disposed of before recreation

## Alternative Approaches Considered

1. **Preserving Context**: Attempted to preserve the WebGL context and resume animation, but this led to context corruption
2. **Screen Caching**: Considered using React Navigation's screen caching, but this didn't solve the context corruption issue
3. **Manual Context Management**: Tried manually managing the WebGL context, but forcing recreation proved more reliable

## Implementation Notes

- Always dispose of Three.js resources when cleaning up
- Cancel animation frames before starting new ones
- Keep track of component mount state
- Check both mount state and focus state in animation loop
- Force new context creation when returning to screen
- Clear all refs during cleanup to prevent memory leaks

This solution ensures smooth transitions between screens while maintaining proper resource management and preventing memory leaks.