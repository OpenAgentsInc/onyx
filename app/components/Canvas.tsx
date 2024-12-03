import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import React, { useCallback, useEffect, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as THREE from "three";

export function Canvas() {
  const isFocused = useIsFocused();
  const mountedRef = useRef(true);
  const glRef = useRef<ExpoWebGLRenderingContext>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const cubeRef = useRef<THREE.Mesh>();
  const pointLight1Ref = useRef<THREE.PointLight>();
  const pointLight2Ref = useRef<THREE.PointLight>();
  const animationFrameRef = useRef<number>();
  const debugRef = useRef({
    frameCount: 0,
    lastTime: Date.now(),
  });

  const logDebug = (message: string) => {
    const now = Date.now();
    const state = {
      message,
      time: now,
      timeSinceLastLog: now - debugRef.current.lastTime,
      frameCount: debugRef.current.frameCount,
      mounted: mountedRef.current,
      focused: isFocused,
      hasGL: !!glRef.current,
      hasRenderer: !!rendererRef.current,
      hasScene: !!sceneRef.current,
      hasCamera: !!cameraRef.current,
      hasCube: !!cubeRef.current,
      hasAnimFrame: !!animationFrameRef.current,
    };
    debugRef.current.lastTime = now;
    Alert.alert("Debug", JSON.stringify(state, null, 2));
  };

  const animate = useCallback(() => {
    if (!mountedRef.current) {
      logDebug("Not mounted, stopping animation");
      return;
    }

    if (!isFocused) {
      logDebug("Not focused, pausing animation");
      return;
    }

    debugRef.current.frameCount++;

    if (!glRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
      logDebug("Missing refs in animate");
      return;
    }

    const cube = cubeRef.current;
    const pointLight1 = pointLight1Ref.current;
    const pointLight2 = pointLight2Ref.current;

    if (cube) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }

    if (pointLight1 && pointLight2) {
      const time = Date.now() * 0.001;
      pointLight1.position.x = Math.sin(time) * 3;
      pointLight1.position.z = Math.cos(time) * 3;
      pointLight2.position.x = Math.sin(time + Math.PI) * 3;
      pointLight2.position.z = Math.cos(time + Math.PI) * 3;
    }

    try {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      glRef.current.endFrameEXP();
      
      // Only request next frame if still mounted and focused
      if (mountedRef.current && isFocused) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    } catch (error) {
      logDebug("Error in animate: " + error.message);
    }
  }, [isFocused]);

  const cleanupGL = useCallback(() => {
    logDebug("Cleaning up GL resources");
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    // Cleanup Three.js resources
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

    glRef.current = undefined;
    cameraRef.current = undefined;
    pointLight1Ref.current = undefined;
    pointLight2Ref.current = undefined;
  }, []);

  const setupScene = useCallback((gl: ExpoWebGLRenderingContext) => {
    logDebug("Setting up scene");
    
    // Clean up any existing GL resources first
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

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 3;
    camera.position.y = 2;
    camera.position.x = 2;
    camera.lookAt(0, 0, 0);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhysicalMaterial({ 
      color: 0x888888,
      metalness: 0.5,
      roughness: 0.1,
      reflectivity: 1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;

    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      roughness: 0.8,
      metalness: 0.2
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    plane.receiveShadow = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;

    const pointLight1 = new THREE.PointLight(0x0088ff, 1, 10);
    pointLight1.position.set(2, 2, 2);

    const pointLight2 = new THREE.PointLight(0xff8800, 1, 10);
    pointLight2.position.set(-2, 1, -2);

    // Add everything to scene
    scene.add(cube);
    scene.add(plane);
    scene.add(ambientLight);
    scene.add(dirLight);
    scene.add(pointLight1);
    scene.add(pointLight2);

    // Store refs
    glRef.current = gl;
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    cubeRef.current = cube;
    pointLight1Ref.current = pointLight1;
    pointLight2Ref.current = pointLight2;

    logDebug("Scene setup complete");
    return true;
  }, [cleanupGL]);

  const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
    logDebug("Context created");
    
    // Setup scene
    const success = setupScene(gl);
    if (!success) {
      logDebug("Failed to setup scene");
      return;
    }

    // Start animation if focused
    if (isFocused && mountedRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
      logDebug("Animation started");
    }
  }, [isFocused, setupScene, animate]);

  // Handle focus changes
  useEffect(() => {
    if (isFocused) {
      logDebug("Screen focused - requesting new context");
      // Force a new context when focusing
      cleanupGL();
      // The GLView will automatically create a new context
    } else {
      logDebug("Screen unfocused - cleaning up");
      cleanupGL();
    }
  }, [isFocused, cleanupGL]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      logDebug("Component unmounting");
      mountedRef.current = false;
      cleanupGL();
    };
  }, [cleanupGL]);

  return (
    <View style={styles.container}>
      <GLView
        key={isFocused ? "focused" : "unfocused"} // Force new context on focus change
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