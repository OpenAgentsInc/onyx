# Three.js Integration in Onyx

This document explains our Three.js implementation and the technical decisions behind it.

## Overview

Our 3D rendering implementation uses Three.js with direct `expo-gl` integration, rather than using `@react-three/fiber`. This decision was made due to compatibility issues between React Three Fiber and React Native's new architecture on iOS.

## Implementation Details

### Core Technologies
- `expo-gl`: Direct WebGL context access in React Native
- `three`: 3D graphics library
- No `@react-three/fiber` due to iOS compatibility issues

### Key Components

#### Canvas Component (`app/components/Canvas.tsx`)
The main rendering component that sets up the Three.js scene.

```typescript
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import * as THREE from "three";

const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
  // Renderer setup with specific canvas properties
  const renderer = new THREE.WebGLRenderer({
    canvas: {
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
      style: {},
      addEventListener: (() => {}) as any,
      removeEventListener: (() => {}) as any,
      clientHeight: gl.drawingBufferHeight,
    },
    context: gl,
  });
  // ... scene setup, animation loop, etc.
};
```

### Critical Implementation Details

1. **WebGL Renderer Setup**
   - Must include specific canvas properties
   - Requires empty event listeners
   - Needs explicit dimensions from GL context

2. **GLView Configuration**
   ```typescript
   <GLView
     msaaSamples={0}  // Important for iOS compatibility
     style={styles.canvas}
     onContextCreate={onContextCreate}
   />
   ```

3. **Frame Completion**
   - Must call `gl.endFrameEXP()` at the end of each frame
   ```typescript
   const animate = () => {
     requestAnimationFrame(animate);
     renderer.render(scene, camera);
     gl.endFrameEXP();  // Required for Expo's GL View
   };
   ```

## Technical Background

### Why Not React Three Fiber?

While `@react-three/fiber` provides a more React-like API for Three.js, it currently has compatibility issues with React Native's new architecture on iOS. Specifically:

1. Render target initialization fails
2. Canvas context issues
3. Reconciliation problems with the new architecture

### Direct Three.js Approach Benefits

1. **Reliability**: Works consistently across platforms
2. **Performance**: Direct control over rendering pipeline
3. **Debugging**: Simpler stack traces and error handling
4. **Compatibility**: Works with React Native's new architecture

## Usage Example

Basic scene setup:

```typescript
const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

const camera = new THREE.PerspectiveCamera(
  75,
  gl.drawingBufferWidth / gl.drawingBufferHeight,
  0.1,
  1000
);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 'white' });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

## Known Issues and Solutions

1. **iOS Black Screen**
   - Solution: Ensure `msaaSamples={0}` is set on GLView
   - Verify canvas properties in WebGLRenderer setup

2. **Performance**
   - Use appropriate pixel ratio (`renderer.setPixelRatio(1)`)
   - Minimize scene complexity
   - Implement proper cleanup in component unmount

## Future Considerations

1. **React Three Fiber Migration**
   - Monitor R3F updates for iOS new architecture compatibility
   - Consider migration when stability improves

2. **Performance Optimizations**
   - Implement object pooling
   - Add level of detail (LOD) system
   - Consider implementing frustum culling

## References

- [Original Issue Discussion](https://github.com/pmndrs/react-three-fiber/issues/3399)
- [Working Example Repository](https://github.com/jb-san/expo-52-three-fiber)
- [Expo GL Documentation](https://docs.expo.dev/versions/latest/sdk/gl-view/)
- [Three.js Documentation](https://threejs.org/docs/)