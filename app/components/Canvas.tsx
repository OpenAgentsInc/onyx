import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import React from "react";
import { View, StyleSheet } from "react-native";
import * as THREE from "three";

const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
  // Create WebGLRenderer with specific canvas properties
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

  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  // Set up camera
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

  // Create box with more interesting material
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

  // Add ground plane
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

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  // Main directional light with shadow
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 5, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  // Add some colored point lights
  const pointLight1 = new THREE.PointLight(0x0088ff, 1, 10);
  pointLight1.position.set(2, 2, 2);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xff8800, 1, 10);
  pointLight2.position.set(-2, 1, -2);
  scene.add(pointLight2);

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    // Rotate cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Move lights in circular pattern
    const time = Date.now() * 0.001;
    pointLight1.position.x = Math.sin(time) * 3;
    pointLight1.position.z = Math.cos(time) * 3;
    pointLight2.position.x = Math.sin(time + Math.PI) * 3;
    pointLight2.position.z = Math.cos(time + Math.PI) * 3;

    // Render scene
    renderer.render(scene, camera);

    // Required for Expo's GL View
    gl.endFrameEXP();
  };

  // Start animation
  animate();
};

export function Canvas() {
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