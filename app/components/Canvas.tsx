import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import React, { useCallback, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as THREE from "three";

export function Canvas() {
  const isFocused = useIsFocused();
  const mountedRef = useRef(true);
  const glRef = useRef<ExpoWebGLRenderingContext>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const gemRef = useRef<THREE.Group>();
  const glowRef = useRef<THREE.PointLight>();
  const pulseRef = useRef<THREE.PointLight>();
  const animationFrameRef = useRef<number>();

  const animate = useCallback(() => {
    if (!mountedRef.current || !isFocused) {
      return;
    }

    if (!glRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
      return;
    }

    const gem = gemRef.current;
    const glow = glowRef.current;
    const pulse = pulseRef.current;

    if (gem) {
      // Gentle floating motion
      gem.position.y = Math.sin(Date.now() * 0.001) * 0.1;
      gem.rotation.y += 0.005;
    }

    if (glow && pulse) {
      // Pulsing light effect
      const intensity = 1 + Math.sin(Date.now() * 0.003) * 0.5;
      glow.intensity = intensity;
      pulse.intensity = intensity * 0.5;
    }

    try {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      glRef.current.endFrameEXP();
      
      if (mountedRef.current && isFocused) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    } catch (error) {
      console.error("Error in animation loop:", error);
    }
  }, [isFocused]);

  const cleanupGL = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = undefined;
    }

    if (gemRef.current) {
      gemRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      gemRef.current = undefined;
    }

    if (sceneRef.current) {
      sceneRef.current.clear();
      sceneRef.current = undefined;
    }

    glRef.current = undefined;
    cameraRef.current = undefined;
    glowRef.current = undefined;
    pulseRef.current = undefined;
  }, []);

  const createGemGeometry = () => {
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    // Distort vertices slightly for more crystalline look
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      const noise = (Math.random() - 0.5) * 0.2;
      positions.setXYZ(i, x + noise, y + noise, z + noise);
    }
    geometry.computeVertexNormals();
    return geometry;
  };

  const setupScene = useCallback((gl: ExpoWebGLRenderingContext) => {
    cleanupGL();
    
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
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    scene.fog = new THREE.FogExp2(0x000000, 0.1);

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 4;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    // Create gem group
    const gemGroup = new THREE.Group();
    
    // Main gem body
    const gemGeometry = createGemGeometry();
    const gemMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0x000000,
      metalness: 0.9,
      roughness: 0.1,
      reflectivity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1
    });
    const gem = new THREE.Mesh(gemGeometry, gemMaterial);
    gem.castShadow = true;
    gem.receiveShadow = true;
    gemGroup.add(gem);

    // Add subtle white edges
    const edgeGeometry = new THREE.EdgesGeometry(gemGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.2
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    gemGroup.add(edges);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // Main directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Glow light
    const glowLight = new THREE.PointLight(0xffffff, 1, 10);
    glowLight.position.set(0, 0, 2);
    scene.add(glowLight);

    // Pulse light
    const pulseLight = new THREE.PointLight(0xffffff, 0.5, 5);
    pulseLight.position.set(0, 0, -2);
    scene.add(pulseLight);

    // Add everything to scene
    scene.add(gemGroup);

    // Store refs
    glRef.current = gl;
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    gemRef.current = gemGroup;
    glowRef.current = glowLight;
    pulseRef.current = pulseLight;

    return true;
  }, [cleanupGL]);

  const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
    const success = setupScene(gl);
    if (!success) {
      return;
    }

    if (isFocused && mountedRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isFocused, setupScene, animate]);

  useEffect(() => {
    if (isFocused) {
      cleanupGL();
    } else {
      cleanupGL();
    }
  }, [isFocused, cleanupGL]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanupGL();
    };
  }, [cleanupGL]);

  return (
    <View style={styles.container}>
      <GLView
        key={isFocused ? "focused" : "unfocused"}
        msaaSamples={0}
        style={styles.canvas}
        onContextCreate={onContextCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});