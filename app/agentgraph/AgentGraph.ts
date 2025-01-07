import { ExpoWebGLRenderingContext } from "expo-gl"
import * as THREE from "three"
import { EdgeRenderer } from "./EdgeRenderer"
import { NodeRenderer } from "./NodeRenderer"
import { GraphOptions, KnowledgeNode } from "./types"

export class AgentGraph {
  private gl: ExpoWebGLRenderingContext
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.OrthographicCamera
  private nodes: KnowledgeNode[] = []
  private animationFrame?: number
  private mounted: boolean = true
  private options: Required<GraphOptions>
  private isDragging: boolean = false
  private previousTouch = { x: 0, y: 0 }
  private zoomLevel: number = 1
  private cameraPosition = { x: 0, y: 0 }

  constructor(gl: ExpoWebGLRenderingContext, options: GraphOptions = {}) {
    this.gl = gl
    this.options = {
      is3D: false,
      nodeSpacing: 2,
      backgroundColor: 0x09090b,
      animate: false,
      ...options
    }

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
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
      } as unknown as HTMLCanvasElement,
      context: gl,
      alpha: true,
    })

    this.renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)
    this.renderer.setClearColor(this.options.backgroundColor, 1)

    // Initialize scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(this.options.backgroundColor)

    // Initialize orthographic camera for 2D view
    const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight
    const frustumSize = 5
    this.camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      1000
    )
    this.camera.position.z = 5

    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
    this.scene.add(ambientLight)

    if (this.options.animate) {
      this.animate()
    } else {
      this.render()
    }
  }

  private render = () => {
    this.renderer.render(this.scene, this.camera)
    this.gl.endFrameEXP()
  }

  private animate = () => {
    if (!this.mounted) return

    // Simple animation if enabled
    if (this.options.animate) {
      this.nodes.forEach((node, index) => {
        if (node.mesh) {
          const timeOffset = index * 0.5
          node.mesh.position.y = node.position.y + Math.sin(Date.now() * 0.001 + timeOffset) * 0.05

          // Update connection lines
          if (node.edges) {
            node.edges.forEach((edge, edgeIndex) => {
              const connectedNode = this.nodes[node.connections[edgeIndex]]
              if (connectedNode.mesh) {
                EdgeRenderer.updateConnection(
                  edge,
                  node.mesh!.position,
                  connectedNode.mesh.position
                )
              }
            })
          }
        }
      })
    }

    this.renderer.render(this.scene, this.camera)
    this.gl.endFrameEXP()

    this.animationFrame = requestAnimationFrame(this.animate)
  }

  public handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    const zoomSpeed = 0.1
    const delta = -Math.sign(event.deltaY) * zoomSpeed
    this.zoomLevel = Math.max(0.1, Math.min(5, this.zoomLevel + delta))
    
    // Update camera zoom
    const aspect = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight
    const frustumSize = 5 / this.zoomLevel
    this.camera.left = frustumSize * aspect / -2
    this.camera.right = frustumSize * aspect / 2
    this.camera.top = frustumSize / 2
    this.camera.bottom = frustumSize / -2
    this.camera.updateProjectionMatrix()
    
    this.render()
  }

  public handlePanStart = (x: number, y: number) => {
    this.isDragging = true
    this.previousTouch = { x, y }
  }

  public handlePanMove = (x: number, y: number) => {
    if (!this.isDragging) return

    const deltaX = x - this.previousTouch.x
    const deltaY = y - this.previousTouch.y

    // Scale the movement based on zoom level and viewport size
    const movementScale = (5 / this.zoomLevel) / this.gl.drawingBufferWidth
    this.cameraPosition.x -= deltaX * movementScale
    this.cameraPosition.y += deltaY * movementScale

    // Update camera position
    this.camera.position.x = this.cameraPosition.x
    this.camera.position.y = this.cameraPosition.y

    this.previousTouch = { x, y }
    this.render()
  }

  public handlePanEnd = () => {
    this.isDragging = false
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

    // Create meshes
    nodes.forEach((node) => {
      const mesh = NodeRenderer.createNodeMesh(node.content, node.position)
      this.scene.add(mesh)
      node.mesh = mesh
      node.edges = []
    })

    // Create connections
    nodes.forEach((node) => {
      node.connections.forEach((targetIndex) => {
        const targetNode = nodes[targetIndex]
        if (node.mesh && targetNode.mesh) {
          const connection = EdgeRenderer.createConnection(
            node.mesh.position,
            targetNode.mesh.position
          )
          this.scene.add(connection)
          node.edges?.push(connection)
        }
      })
    })

    if (!this.options.animate) {
      this.render()
    }
  }

  public resize(width: number, height: number) {
    this.renderer.setSize(width, height)

    // Update orthographic camera aspect ratio
    const aspect = width / height
    const frustumSize = 5 / this.zoomLevel
    this.camera.left = frustumSize * aspect / -2
    this.camera.right = frustumSize * aspect / 2
    this.camera.top = frustumSize / 2
    this.camera.bottom = frustumSize / -2
    this.camera.updateProjectionMatrix()

    if (!this.options.animate) {
      this.render()
    }
  }

  public dispose() {
    this.mounted = false
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }

    // Clean up resources
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
          if (edge.material instanceof THREE.Material) {
            edge.material.dispose()
          } else if (Array.isArray(edge.material)) {
            edge.material.forEach((m) => m.dispose())
          }
        })
      }
    })

    this.renderer.dispose()
  }
}