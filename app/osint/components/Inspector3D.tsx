import { ExpoWebGLRenderingContext, GLView } from "expo-gl"
import React, { useCallback, useEffect, useRef } from "react"
import { StyleSheet, View } from "react-native"
import * as THREE from "three"
import { isEmulator } from "@/utils/isEmulator"
import { useIsFocused } from "@/utils/useIsFocused"
import { MinimalCanvas } from "@/app/canvas/types"
import { OSINTEvent } from "../types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Text } from "@/components/ui/text"

interface Inspector3DProps {
  selectedItem: OSINTEvent | null
}

export function Inspector3D({ selectedItem }: Inspector3DProps) {
  const isFocused = useIsFocused();
  const mountedRef = useRef(true);
  const glRef = useRef<ExpoWebGLRenderingContext>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const cardGroupRef = useRef<THREE.Group>();
  const animationFrameRef = useRef<number>();

  if (isEmulator()) {
    return <View style={styles.container} />;
  }

  const animate = useCallback(() => {
    if (!mountedRef.current || !isFocused) {
      return;
    }

    if (!glRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
      return;
    }

    const cardGroup = cardGroupRef.current;

    if (cardGroup) {
      // Gentle floating motion
      cardGroup.position.y = 0.8 + Math.sin(Date.now() * 0.001) * 0.1;
      cardGroup.rotation.y += 0.005;
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

    if (cardGroupRef.current) {
      cardGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      cardGroupRef.current = undefined;
    }

    if (sceneRef.current) {
      sceneRef.current.clear();
      sceneRef.current = undefined;
    }

    glRef.current = undefined;
    cameraRef.current = undefined;
  }, []);

  const createCardGeometry = () => {
    const geometry = new THREE.BoxGeometry(2, 3, 0.1);
    return geometry;
  };

  const setupScene = useCallback((gl: ExpoWebGLRenderingContext) => {
    cleanupGL();

    const renderer = new THREE.WebGLRenderer({
      // @ts-ignore
      canvas: {
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
        style: {},
        addEventListener: () => { },
        removeEventListener: () => { },
        clientHeight: gl.drawingBufferHeight,
        getContext: () => gl,
        toDataURL: () => "",
        toBlob: () => { },
        captureStream: () => new MediaStream(),
      } as MinimalCanvas,
      context: gl,
    });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    scene.fog = new THREE.FogExp2(0x000000, 0.15);

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 3.5;
    camera.position.y = 0.5;
    camera.lookAt(0, 0.8, 0);

    // Create card group
    const cardGroup = new THREE.Group();
    cardGroup.position.y = 0.8;

    // Main card body
    const cardGeometry = createCardGeometry();
    const cardMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.8,
      roughness: 0.2,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.2,
      envMapIntensity: 2.0,
    });
    const card = new THREE.Mesh(cardGeometry, cardMaterial);
    card.castShadow = true;
    card.receiveShadow = true;
    cardGroup.add(card);

    // Add glowing edges
    const edgeGeometry = new THREE.EdgesGeometry(cardGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.6
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    cardGroup.add(edges);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Main directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Add rim lights
    const rimLight1 = new THREE.SpotLight(0x00ff88, 2, 10, Math.PI / 4, 0.5, 1);
    rimLight1.position.set(3, 2, 0);
    scene.add(rimLight1);

    const rimLight2 = new THREE.SpotLight(0x00ff88, 2, 10, Math.PI / 4, 0.5, 1);
    rimLight2.position.set(-3, 2, 0);
    scene.add(rimLight2);

    // Add everything to scene
    scene.add(cardGroup);

    // Store refs
    glRef.current = gl;
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    cardGroupRef.current = cardGroup;

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

  if (!selectedItem) {
    return (
      <Card style={{ height: "100%" }}>
        <CardHeader>
          <CardTitle>Inspector</CardTitle>
          <CardDescription>Click on a message to inspect its data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const parsedContent = JSON.parse(selectedItem.content);

  return (
    <Card style={{ height: "100%" }}>
      <CardHeader>
        <CardTitle>{parsedContent.title}</CardTitle>
        <CardDescription>OSINT Event (kind={selectedItem.kind})</CardDescription>
      </CardHeader>
      <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <View style={{ flex: 1, marginBottom: 20 }}>
          <GLView
            key={isFocused ? "focused" : "unfocused"}
            msaaSamples={0}
            style={styles.canvas}
            onContextCreate={onContextCreate}
          />
        </View>
        
        <View style={{ marginBottom: 20 }}>
          <Text className="font-semibold mb-2">Description:</Text>
          <Text>{parsedContent.description}</Text>
        </View>
        
        <View style={{ marginBottom: 20 }}>
          <Text className="font-semibold mb-2">Source:</Text>
          <Text>{parsedContent.source}</Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text className="font-semibold mb-2">Confidence:</Text>
          <Text>{parsedContent.confidence}</Text>
        </View>

        <View>
          <Text className="font-semibold mb-2">Tags:</Text>
          {selectedItem.tags.map((tag, index) => (
            <Text key={index} className="mb-1">
              {tag.join(": ")}
            </Text>
          ))}
        </View>
      </CardContent>
    </Card>
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
    minHeight: 300,
  },
});