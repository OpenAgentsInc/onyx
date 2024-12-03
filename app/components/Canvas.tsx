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

  // Create box
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 'white' });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    // Rotate cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

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