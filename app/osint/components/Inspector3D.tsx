import { ExpoWebGLRenderingContext, GLView } from "expo-gl"
import React, { useCallback, useEffect, useRef } from "react"
import { StyleSheet, View } from "react-native"
import * as THREE from "three"
import { AgentGraph } from "@/agentgraph/AgentGraph"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { isEmulator } from "@/utils/isEmulator"
import { useIsFocused } from "@/utils/useIsFocused"
import { OSINTEvent } from "../data"

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
  const isFocused = useIsFocused()
  const graphRef = useRef<AgentGraph>()

  if (isEmulator()) {
    return <View style={styles.container} />
  }

  // Update onContextCreate to depend on selectedItem
  const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
    // Initialize AgentGraph
    graphRef.current = new AgentGraph(gl)

    // Set nodes based on selectedItem
    if (selectedItem) {
      const nodes: KnowledgeNode[] = [
        {
          position: new THREE.Vector3(-1.5, 0, 0),
          content: selectedItem.content || "OSINT Data",
          connections: [1],
        },
        {
          position: new THREE.Vector3(1.5, 0, 0),
          content: "Related Data",
          connections: [0],
        },
      ]
      graphRef.current.setNodes(nodes)
    }
  }, [selectedItem]) // Add selectedItem as dependency

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (graphRef.current) {
        graphRef.current.dispose()
      }
    }
  }, [])

  if (!selectedItem) {
    return (
      <Card style={{ height: "100%" }}>
        <CardHeader>
          <CardTitle>Inspector</CardTitle>
          <CardDescription>Click on a message to inspect its data</CardDescription>
        </CardHeader>
      </Card>
    )
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
            // Add selectedItem to key to force re-render when it changes
            key={`${isFocused ? "focused" : "unfocused"}-${selectedItem.id}`}
            style={styles.canvas}
            onContextCreate={onContextCreate}
          />
        </View>
      </CardContent>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  canvas: {
    flex: 1,
    width: "100%",
    height: "100%",
    minHeight: 300,
  },
})