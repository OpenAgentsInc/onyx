import * as THREE from "three"

export interface NodeRenderOptions {
  color?: number
  textColor?: string
  fontSize?: number
  padding?: number
  opacity?: number
  maxWidth?: number
}

export class NodeRenderer {
  private static defaultOptions: NodeRenderOptions = {
    color: 0x111111,
    textColor: "#00ff88",
    fontSize: 24,
    padding: 20,
    opacity: 0.9,
    maxWidth: 400
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

  private static wrapText(
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): { lines: string[], totalHeight: number } {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width = context.measureText(currentLine + " " + word).width
      if (width < maxWidth) {
        currentLine += " " + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)

    return {
      lines,
      totalHeight: lines.length * (context.measureText('M').actualBoundingBoxAscent + context.measureText('M').actualBoundingBoxDescent * 1.2)
    }
  }

  private static createTextSprite(
    content: string,
    options: NodeRenderOptions
  ): THREE.Sprite {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) return new THREE.Sprite()

    // Set canvas size to be more square
    canvas.width = 512
    canvas.height = 512

    // Configure text rendering
    context.fillStyle = options.textColor!
    context.font = `${options.fontSize}px 'JetBrains Mono'`
    context.textAlign = "center"
    context.textBaseline = "middle"

    // Wrap text and calculate dimensions
    const maxWidth = options.maxWidth! - (options.padding! * 2)
    const { lines, totalHeight } = NodeRenderer.wrapText(context, content, maxWidth)
    
    const maxLineWidth = Math.max(...lines.map(line => context.measureText(line).width))
    const textWidth = Math.min(maxLineWidth + options.padding! * 2, options.maxWidth!)
    const textHeight = totalHeight + options.padding! * 2

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Draw text lines
    const startY = (canvas.height - totalHeight) / 2
    lines.forEach((line, index) => {
      const lineHeight = context.measureText('M').actualBoundingBoxAscent + context.measureText('M').actualBoundingBoxDescent
      const y = startY + (index * lineHeight * 1.2) + lineHeight / 2
      context.fillText(line, canvas.width / 2, y)
    })

    // Create sprite
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: options.opacity,
    })

    const sprite = new THREE.Sprite(spriteMaterial)
    
    // Scale sprite proportionally
    const scaleX = (textWidth / canvas.width) * 2
    const scaleY = (textHeight / canvas.width) * 2  // Using width for both to maintain aspect ratio
    sprite.scale.set(Math.max(scaleX, 0.8), Math.max(scaleY, 0.4), 1)

    return sprite
  }
}