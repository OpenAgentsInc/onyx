# Onyx Orb Visualization

The Onyx orb is a 3D visualization representing our AI agent. It takes the form of a black crystalline gem that pulses with white light, symbolizing the active and responsive nature of the AI.

## Technical Implementation

The visualization is built using Three.js with direct `expo-gl` integration in React Native.

### Core Components

#### Geometry
- Base: `IcosahedronGeometry` with subdivision level 2
- Subtle vertex distortion for crystalline appearance
- White edge highlighting using `EdgesGeometry`
- Inner glow mesh using scaled back-face material

```typescript
const geometry = new THREE.IcosahedronGeometry(1, 2);
// Vertex distortion for crystalline look
const positions = geometry.attributes.position;
for (let i = 0; i < positions.count; i++) {
  const x = positions.getX(i);
  const y = positions.getY(i);
  const z = positions.getZ(i);
  const noise = (Math.random() - 0.5) * 0.15;
  positions.setXYZ(i, x + noise, y + noise, z + noise);
}
```

#### Materials

Main Gem Material:
```typescript
const gemMaterial = new THREE.MeshPhysicalMaterial({ 
  color: 0x000000,
  metalness: 1.0,
  roughness: 0.0,
  reflectivity: 1.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.0,
  envMapIntensity: 3.0,
  ior: 2.5,
});
```

Edge Highlighting:
```typescript
const edgeMaterial = new THREE.LineBasicMaterial({ 
  color: 0xffffff,
  transparent: true,
  opacity: 0.4
});
```

Inner Glow:
```typescript
const innerGlowMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.1,
  side: THREE.BackSide
});
```

### Lighting System

The orb uses a complex lighting setup for optimal visibility and dramatic effect:

1. Base Lighting:
   - Ambient light (0.3 intensity)
   - Directional main light (1.0 intensity)

2. Dynamic Lights:
   - Front glow light (1.5 intensity, range 10)
   - Back pulse light (1.0 intensity, range 8)
   - Moving rim spotlight (2.0 intensity, range 10)
   - Two fill lights (0.5 intensity each)

### Animation

The orb features several animated elements:

1. Physical Movement:
   ```typescript
   // Gentle floating
   gem.position.y = Math.sin(Date.now() * 0.001) * 0.1;
   // Slow rotation
   gem.rotation.y += 0.005;
   ```

2. Light Animation:
   ```typescript
   // Pulsing light effect
   const time = Date.now() * 0.002;
   const intensity = 1.5 + Math.sin(time) * 0.5;
   glow.intensity = intensity;
   pulse.intensity = intensity * 0.7;
   ```

3. Dynamic Rim Light:
   ```typescript
   rimLight.position.x = Math.sin(time) * 3;
   rimLight.position.z = Math.cos(time) * 3;
   rimLight.intensity = 2 + Math.sin(time * 1.5) * 0.5;
   ```

### Rendering Configuration

Optimal rendering settings for the effect:

```typescript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
```

## Visual Design Philosophy

The Onyx orb design embodies several key concepts:

1. **Sophistication**: Black crystalline structure with high reflectivity
2. **Responsiveness**: Pulsing white light indicating AI activity
3. **Depth**: Multiple layers including inner glow and edge highlighting
4. **Dynamism**: Constant but subtle motion and light changes
5. **Minimalism**: Clean geometric form with focused lighting effects

## Future Enhancements

Potential improvements to consider:

1. Reactive animations tied to AI processing state
2. Particle effects for enhanced visual feedback
3. Color variations for different AI states
4. Interactive elements responding to user input
5. Ambient environment reflections