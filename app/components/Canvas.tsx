import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import React, { useCallback, useRef } from "react";
import { View, StyleSheet } from "react-native";
import * as THREE from "three";

export function Canvas() {
  // Use refs to store animation-related values that need to persist between renders
  const requestRef = useRef<number>();
  const glRef = useRef<ExpoWebGLRenderingContext>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const cubeRef = useRef<THREE.Mesh>();
  const pointLight1Ref = useRef<THREE.PointLight>();
  const pointLight2Ref = useRef<THREE.PointLight>();

  const animate = useCallback(() => {
    if (!glRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

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

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    glRef.current.endFrameEXP();
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  const onContextCreate = useCallback(async (gl: ExpoWebGLRenderingContext) => {
    glRef.current = gl;

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
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    sceneRef.current = scene;

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
    cameraRef.current = camera;

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
    cubeRef.current = cube;

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
    pointLight1Ref.current = pointLight1;

    const pointLight2 = new THREE.PointLight(0xff8800, 1, 10);
    pointLight2.position.set(-2, 1, -2);
    scene.add(pointLight2);
    pointLight2Ref.current = pointLight2;

    // Start animation
    requestRef.current = requestAnimationFrame(animate);
  }, [animate]);

  // Cleanup function
  React.useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
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