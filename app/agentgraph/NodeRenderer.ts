import * as THREE from "three"

export interface NodeRenderOptions {
  color?: number
  textColor?: string
  fontSize?: number
  padding?: number
  opacity?: number
}

export class NodeRenderer {
  private static defaultOptions: NodeRenderOptions = {
    color: 0x111111,
    textColor: "#00ff88",
    fontSize: 24,
    padding: 20,
    opacity: 0.9
  }

  public static createNodeMesh(
    content: string, 
    position: THREE.Vector3,
    options: NodeRenderOptions = {}
  ): THREE.Mesh {
    const opts = { ...NodeRenderer.defaultOptions, ...options }
    
    // Create simple plane geometry for 2D rendering
    const geometry = new THREE.PlaneGeometry(2, 1)

    // Create basic material
    const material = new THREE.MeshBasicMaterial({
      color: opts.color,
      transparent: true,
      opacity: opts.opacity,
    })

    // Create mesh and position it
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(position)

    // Add text
    const textMesh = NodeRenderer.createTextSprite(content, opts)
    mesh.add(textMesh)

    return mesh
  }

  private static createTextSprite(
    content: string,
    options: NodeRenderOptions
  ): THREE.Sprite {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) return new THREE.Sprite()

    // Set canvas size
    canvas.width = 512
    canvas.height = 128

    // Configure text rendering
    context.fillStyle = options.textColor!
    context.font = `${options.fontSize}px 'JetBrains Mono'`
    context.textAlign = "center"
    context.textBaseline = "middle"

    // Measure text
    const textMetrics = context.measureText(content)
    const textWidth = textMetrics.width + options.padding! * 2
    const textHeight = options.fontSize! + options.padding! * 2

    // Clear and draw text
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillText(content, canvas.width / 2, canvas.height / 2)

    // Create sprite
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: options.opacity,
    })

    const sprite = new THREE.Sprite(spriteMaterial)
    
    // Scale sprite to fit text
    const scaleX = (textWidth / canvas.width) * 2
    const scaleY = (textHeight / canvas.height) * 2
    sprite.scale.set(Math.max(scaleX, 1.5), Math.max(scaleY, 0.4), 1)

    return sprite
  }
}