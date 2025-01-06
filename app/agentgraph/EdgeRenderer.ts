import * as THREE from "three"

export interface EdgeRenderOptions {
  color?: number
  opacity?: number
  lineWidth?: number
}

export class EdgeRenderer {
  private static defaultOptions: EdgeRenderOptions = {
    color: 0x00ff88,
    opacity: 0.6,
    lineWidth: 1
  }

  public static createConnection(
    start: THREE.Vector3,
    end: THREE.Vector3,
    options: EdgeRenderOptions = {}
  ): THREE.Line {
    const opts = { ...EdgeRenderer.defaultOptions, ...options }
    
    const points = [start, end]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    
    const material = new THREE.LineBasicMaterial({
      color: opts.color,
      transparent: true,
      opacity: opts.opacity,
      linewidth: opts.lineWidth
    })

    return new THREE.Line(geometry, material)
  }

  public static updateConnection(
    line: THREE.Line,
    start: THREE.Vector3,
    end: THREE.Vector3
  ): void {
    const positions = line.geometry.attributes.position
    positions.setXYZ(0, start.x, start.y, start.z)
    positions.setXYZ(1, end.x, end.y, end.z)
    positions.needsUpdate = true
  }
}