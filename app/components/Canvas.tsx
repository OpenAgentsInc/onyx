import React, { useRef } from "react"
import { View } from "react-native"
import { Canvas as ThreeCanvas, useFrame } from "@react-three/fiber/native"

function Box() {
  const meshRef = useRef(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta
      meshRef.current.rotation.y += delta
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="white" />
    </mesh>
  )
}

export function Canvas() {
  return (
    <View style={{ flex: 1 }}>
      <ThreeCanvas
        style={{ flex: 1 }}
        gl={{ clearColor: '#000000' }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} />
        <Box />
      </ThreeCanvas>
    </View>
  )
}
