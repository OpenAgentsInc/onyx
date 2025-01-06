import { ExpoWebGLRenderingContext } from "expo-gl"
import * as THREE from "three"
import { MinimalCanvas } from "@/canvas/types"

interface KnowledgeNode {
  position: THREE.Vector3
  content: string
  mesh?: THREE.Mesh
  textMesh?: THREE.Mesh
  edges?: THREE.Line[]
  connections: number[]
}

export class AgentGraph {
  private gl: ExpoWebGLRenderingContext
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private nodes: KnowledgeNode[] = []
  private animationFrame?: number
  private mounted: boolean = true

  constructor(gl: ExpoWebGLRenderingContext) {
    this.gl = gl

    // Initialize renderer with canvas cast to HTMLCanvasElement
    this.renderer = new THREE.WebGLRenderer({
      canvas: {
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        clientHeight: gl.drawingBufferHeight,
        getContext: () => gl,
        toDataURL: (type?: string) => '',
        toBlob: (callback: BlobCallback) => {},
        captureStream: (frameRate?: number) => new MediaStream(),
      } as unknown as HTMLCanvasElement,
      context: gl,
      alpha: true,
    })
    this.renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)
    this.renderer.setClearColor(0x09090b, 1)

    // Initialize scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color("#09090b")

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000,
    )
    this.camera.position.z = 5

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
    dirLight.position.set(5, 5, 5)
    this.scene.add(dirLight)

    // Start animation loop
    this.animate()
  }

  private createNodeMesh(content: string, position: THREE.Vector3): THREE.Mesh {
    // Create card geometry (flat box)
    const geometry = new THREE.BoxGeometry(2, 1.2, 0.05)

    // Create materials for the card
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.8,
      roughness: 0.2,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.2,
      envMapIntensity: 2.0,
      transparent: true,
      opacity: 0.9,
    })

    // Create mesh and position it
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(position)

    // Add glowing edges
    const edgeGeometry = new THREE.EdgesGeometry(geometry)
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.6,
    })
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial)
    mesh.add(edges)

    // Add text sprite with improved visibility
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (context) {
      // Increase canvas size for better text resolution
      canvas.width = 512
      canvas.height = 128
      context.fillStyle = "#00ff88"
      context.font = "bold 32px Arial"
      context.textAlign = "center"
      context.textBaseline = "middle"

      // Add padding and measure text
      const padding = 20
      const textMetrics = context.measureText(content)
      const textWidth = textMetrics.width + padding * 2
      const textHeight = 40 + padding * 2

      // Clear canvas with transparent background
      context.clearRect(0, 0, canvas.width, canvas.height)

      // Draw text centered
      context.fillText(content, canvas.width / 2, canvas.height / 2)

      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true

      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      })

      const sprite = new THREE.Sprite(spriteMaterial)
      // Adjust sprite scale to maintain text aspect ratio
      const scaleX = (textWidth / canvas.width) * 2
      const scaleY = (textHeight / canvas.height) * 2
      sprite.scale.set(Math.max(scaleX, 1.5), Math.max(scaleY, 0.4), 1)

      // Position sprite slightly in front of the card
      sprite.position.z = 0.1
      mesh.add(sprite)
    }

    return mesh
  }

  private createConnection(start: THREE.Vector3, end: THREE.Vector3): THREE.Line {
    const points = [start, end]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.3,
    })
    return new THREE.Line(geometry, material)
  }

  private animate = () => {
    if (!this.mounted) return

    // Animate nodes
    this.nodes.forEach((node, index) => {
      if (node.mesh) {
        // Gentle floating motion
        const timeOffset = index * 0.5
        node.mesh.position.y = node.position.y + Math.sin(Date.now() * 0.001 + timeOffset) * 0.1

        // Subtle rotation
        node.mesh.rotation.y = Math.sin(Date.now() * 0.0005 + timeOffset) * 0.1

        // Update connection lines
        if (node.edges) {
          node.edges.forEach((edge, edgeIndex) => {
            const positions = edge.geometry.attributes.position
            positions.setXYZ(0, node.mesh!.position.x, node.mesh!.position.y, node.mesh!.position.z)
            const connectedNode = this.nodes[node.connections[edgeIndex]]
            if (connectedNode.mesh) {
              positions.setXYZ(
                1,
                connectedNode.mesh.position.x,
                connectedNode.mesh.position.y,
                connectedNode.mesh.position.z,
              )
            }
            positions.needsUpdate = true
          })
        }
      }
    })

    this.renderer.render(this.scene, this.camera)
    this.gl.endFrameEXP()

    this.animationFrame = requestAnimationFrame(this.animate)
  }

  public setNodes(nodes: KnowledgeNode[]) {
    // Clear existing nodes
    this.nodes.forEach((node) => {
      if (node.mesh) {
        this.scene.remove(node.mesh)
      }
      if (node.edges) {
        node.edges.forEach((edge) => {
          this.scene.remove(edge)
        })
      }
    })

    this.nodes = nodes

    // Create meshes and connections
    nodes.forEach((node, index) => {
      const mesh = this.createNodeMesh(node.content, node.position)
      this.scene.add(mesh)
      node.mesh = mesh
      node.edges = []
    })

    // Create connections
    nodes.forEach((node, index) => {
      node.connections.forEach((targetIndex) => {
        const targetNode = nodes[targetIndex]
        const connection = this.createConnection(node.position, targetNode.position)
        this.scene.add(connection)
        node.edges?.push(connection)
      })
    })
  }

  public resize(width: number, height: number) {
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  public dispose() {
    this.mounted = false
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }

    // Clean up Three.js resources
    this.nodes.forEach((node) => {
      if (node.mesh) {
        node.mesh.geometry.dispose()
        if (Array.isArray(node.mesh.material)) {
          node.mesh.material.forEach((m) => m.dispose())
        } else {
          node.mesh.material.dispose()
        }
      }
      if (node.edges) {
        node.edges.forEach((edge) => {
          edge.geometry.dispose()
          // Type check before calling dispose
          if (edge.material instanceof THREE.Material) {
            edge.material.dispose()
          } else if (Array.isArray(edge.material)) {
            edge.material.forEach(m => m.dispose())
          }
        })
      }
    })

    this.renderer.dispose()
  }
}