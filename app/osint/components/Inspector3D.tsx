import { ExpoWebGLRenderingContext, GLView } from "expo-gl"
import React, { useCallback, useEffect, useRef } from "react"
import { StyleSheet, View } from "react-native"
import * as THREE from "three"
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { isEmulator } from "@/utils/isEmulator"
import { useIsFocused } from "@/utils/useIsFocused"
import { MinimalCanvas } from "@/app/canvas/types"
import { OSINTEvent } from "../types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Inspector3DProps {
  selectedItem: OSINTEvent | null
}

interface KnowledgeNode {
  position: THREE.Vector3
  content: string
  mesh?: THREE.Mesh
  textMesh?: THREE.Mesh
  edges?: THREE.Line[]
  connections: number[]
}

export function Inspector3D({ selectedItem }: Inspector3DProps) {
  const isFocused = useIsFocused();
  const mountedRef = useRef(true);
  const glRef = useRef<ExpoWebGLRenderingContext>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const nodesRef = useRef<KnowledgeNode[]>([]);
  const animationFrameRef = useRef<number>();
  const fontRef = useRef<THREE.Font>();

  if (isEmulator()) {
    return <View style={styles.container} />;
  }

  const createNodeMesh = (content: string, position: THREE.Vector3) => {
    // Create card geometry (flat box)
    const geometry = new THREE.BoxGeometry(2, 1.2, 0.05);
    
    // Create materials for the card
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.8,
      roughness: 0.2,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.2,
      envMapIntensity: 2.0,
    });

    // Create mesh and position it
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    // Add glowing edges
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.6
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    mesh.add(edges);

    // Add text sprite as fallback
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = 256;
      canvas.height = 64;
      context.fillStyle = '#00ff88';
      context.font = '24px Arial';
      context.textAlign = 'center';
      context.fillText(content, canvas.width / 2, canvas.height / 2);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.8
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(1, 0.25, 1);
      sprite.position.z = 0.03;
      mesh.add(sprite);
    }

    return mesh;
  };

  const createConnection = (start: THREE.Vector3, end: THREE.Vector3) => {
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.3,
    });
    return new THREE.Line(geometry, material);
  };

  const animate = useCallback(() => {
    if (!mountedRef.current || !isFocused) return;
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    // Animate nodes
    nodesRef.current.forEach((node, index) => {
      if (node.mesh) {
        // Gentle floating motion
        const timeOffset = index * 0.5;
        node.mesh.position.y = node.position.y + Math.sin(Date.now() * 0.001 + timeOffset) * 0.1;
        
        // Subtle rotation
        node.mesh.rotation.y = Math.sin(Date.now() * 0.0005 + timeOffset) * 0.1;

        // Update connection lines
        if (node.edges) {
          node.edges.forEach((edge, edgeIndex) => {
            const positions = edge.geometry.attributes.position;
            positions.setXYZ(0, node.mesh!.position.x, node.mesh!.position.y, node.mesh!.position.z);
            const connectedNode = nodesRef.current[node.connections[edgeIndex]];
            if (connectedNode.mesh) {
              positions.setXYZ(1, 
                connectedNode.mesh.position.x,
                connectedNode.mesh.position.y,
                connectedNode.mesh.position.z
              );
            }
            positions.needsUpdate = true;
          });
        }
      }
    });

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    glRef.current.endFrameEXP();

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isFocused]);

  const setupScene = useCallback((gl: ExpoWebGLRenderingContext) => {
    const renderer = new THREE.WebGLRenderer({
      canvas: {
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        clientHeight: gl.drawingBufferHeight,
        getContext: () => gl,
      } as MinimalCanvas,
      context: gl,
    });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create nodes
    const nodes: KnowledgeNode[] = [
      {
        position: new THREE.Vector3(-1.5, 0, 0),
        content: "Drone Sighting",
        connections: [1]
      },
      {
        position: new THREE.Vector3(1.5, 0, 0),
        content: "Government Data",
        connections: [0]
      }
    ];

    // Create meshes and connections
    nodes.forEach((node, index) => {
      const mesh = createNodeMesh(node.content, node.position);
      scene.add(mesh);
      node.mesh = mesh;
      node.edges = [];
    });

    // Create connections
    nodes.forEach((node, index) => {
      node.connections.forEach(targetIndex => {
        const targetNode = nodes[targetIndex];
        const connection = createConnection(node.position, targetNode.position);
        scene.add(connection);
        node.edges?.push(connection);
      });
    });

    nodesRef.current = nodes;

    // Basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Store refs
    glRef.current = gl;
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    return true;
  }, []);

  const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
    setupScene(gl);
    animate();
  }, [setupScene, animate]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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

  return (
    <Card style={{ height: "100%" }}>
      <CardHeader>
        <CardTitle>Knowledge Graph</CardTitle>
        <CardDescription>OSINT Event Connections</CardDescription>
      </CardHeader>
      <CardContent style={{ flex: 1 }}>
        <View style={styles.container}>
          <GLView
            key={isFocused ? "focused" : "unfocused"}
            style={styles.canvas}
            onContextCreate={onContextCreate}
          />
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