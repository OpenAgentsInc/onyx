import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import React, { useCallback, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import * as THREE from "three";

export function Canvas() {
  const mountedRef = useRef(true);
  const glRef = useRef<ExpoWebGLRenderingContext>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const cubeRef = useRef<THREE.Mesh>();
  const pointLight1Ref = useRef<THREE.PointLight>();
  const pointLight2Ref = useRef<THREE.PointLight>();
  const animationFrameRef = useRef<number>();

  const animate = useCallback(() => {
    if (!mountedRef.current) {
      console.log("Animation stopped - component unmounted");
      return;
    }

    if (!glRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
      console.log("Missing required refs:", {
        gl: !!glRef.current,
        renderer: !!rendererRef.current,
        scene: !!sceneRef.current,
        camera: !!cameraRef.current
      });
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
      animationFrameRef.current = requestAnimationFrame(animate);
    } catch (error) {
      console.error("Error in animation loop:", error);
    }
  }, []);

  const setupScene = useCallback((gl: ExpoWebGLRenderingContext) => {
    console.log("Setting up scene...");
    
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
    scene.add(cube);

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
    scene.add(plane);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const pointLight1 = new THREE.PointLight(0x0088ff, 1, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff8800, 1, 10);
    pointLight2.position.set(-2, 1, -2);
    scene.add(pointLight2);

    // Store refs
    glRef.current = gl;
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    cubeRef.current = cube;
    pointLight1Ref.current = pointLight1;
    pointLight2Ref.current = pointLight2;

    console.log("Scene setup complete");
    return true;
  }, []);

  const onContextCreate = useCallback(async (gl: ExpoWebGLRenderingContext) => {
    console.log("Context created");
    
    // Cancel any existing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Setup scene
    const success = setupScene(gl);
    if (!success) {
      console.error("Failed to setup scene");
      return;
    }

    // Start animation
    console.log("Starting animation");
    mountedRef.current = true;
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [animate, setupScene]);

  // Cleanup function
  useEffect(() => {
    return () => {
      console.log("Component unmounting - cleaning up");
      mountedRef.current = false;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }

      // Cleanup Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (cubeRef.current) {
        cubeRef.current.geometry.dispose();
        (cubeRef.current.material as THREE.Material).dispose();
      }

      if (sceneRef.current) {
        sceneRef.current.clear();
      }

      // Clear all refs
      glRef.current = undefined;
      rendererRef.current = undefined;
      sceneRef.current = undefined;
      cameraRef.current = undefined;
      cubeRef.current = undefined;
      pointLight1Ref.current = undefined;
      pointLight2Ref.current = undefined;
    };
  }, []);

  return (
    <View style={styles.container}>
      <GLView
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