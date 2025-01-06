import * as THREE from "three"

export interface KnowledgeNode {
  position: THREE.Vector3
  content: string
  mesh?: THREE.Mesh
  edges?: THREE.Line[]
  connections: number[]
}

export interface GraphOptions {
  is3D?: boolean
  nodeSpacing?: number
  backgroundColor?: number
  animate?: boolean
}