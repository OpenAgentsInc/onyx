import React, { useCallback, useEffect, useRef } from "react"
import { StyleSheet, View } from "react-native"
import * as THREE from "three"
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
  edges?: THREE.Line[]
  connections: number[]
}

export function Inspector3D({ selectedItem }: Inspector3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const nodesRef = useRef<KnowledgeNode[]>([]);
  const animationFrameRef = useRef<number>();

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
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Add glowing edges
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.6
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    mesh.add(edges);

    return mesh;
  };

  const createConnection = (start: THREE.Vector3, end: THREE.Vector3) => {
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.3,
      linewidth: 1,
    });
    return new THREE.Line(geometry, material);
  };

  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
      return;
    }

    // Animate nodes
    nodesRef.current.forEach((node, index) => {
      if (node.mesh) {
        // Gentle floating motion unique to each node
        const timeOffset = index * 0.5;
        node.mesh.position.y = node.position.y + Math.sin(Date.now() * 0.001 + timeOffset) * 0.1;
        
        // Subtle rotation
        node.mesh.rotation.y = Math.sin(Date.now() * 0.0005 + timeOffset) * 0.1;

        // Update connection lines positions
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
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const setupScene = useCallback(() => {
    if (!canvasRef.current) return;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    scene.fog = new THREE.FogExp2(0x000000, 0.15);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    // Create knowledge graph nodes
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

    // Create connections after all meshes are created
    nodes.forEach((node, index) => {
      node.connections.forEach(targetIndex => {
        const targetNode = nodes[targetIndex];
        const connection = createConnection(node.position, targetNode.position);
        scene.add(connection);
        node.edges?.push(connection);
      });
    });

    nodesRef.current = nodes;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

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

    // Store refs
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    // Start animation
    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    const cleanup = setupScene();
    return () => {
      cleanup?.();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      nodesRef.current.forEach(node => {
        if (node.mesh) {
          node.mesh.geometry.dispose();
          (node.mesh.material as THREE.Material).dispose();
          node.edges?.forEach(edge => {
            edge.geometry.dispose();
            (edge.material as THREE.Material).dispose();
          });
        }
      });
    };
  }, [setupScene]);

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
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: 300,
          }}
        />
      </CardContent>
    </Card>
  );
}