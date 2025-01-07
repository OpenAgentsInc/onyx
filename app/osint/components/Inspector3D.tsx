import { ExpoWebGLRenderingContext, GLView } from "expo-gl"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Platform, StyleSheet, View } from "react-native"
import * as THREE from "three"
import { AgentGraph } from "@/agentgraph/AgentGraph"
import { KnowledgeNode } from "@/agentgraph/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { isEmulator } from "@/utils/isEmulator"
import { useIsFocused } from "@/utils/useIsFocused"
import { OSINTEvent } from "../data"

interface Inspector3DProps {
  selectedItem: OSINTEvent | null
}

interface OSINTContent {
  title: string
  description: string
  source: string
  confidence: string
}

export function Inspector3D({ selectedItem }: Inspector3DProps) {
  const isFocused = useIsFocused()
  const graphRef = useRef<AgentGraph>()
  const [glCanvas, setGLCanvas] = useState<HTMLCanvasElement | null>(null)

  if (isEmulator()) {
    return <View style={styles.container} />
  }

  const onContextCreate = useCallback(
    (gl: ExpoWebGLRenderingContext) => {
      // Initialize AgentGraph with 2D options
      graphRef.current = new AgentGraph(gl, {
        is3D: false,
        animate: false,
        nodeSpacing: 3
      })

      // Store canvas reference for web
      if (Platform.OS === "web") {
        const canvas = gl.canvas as HTMLCanvasElement
        setGLCanvas(canvas)
      }

      if (selectedItem) {
        try {
          const parsedContent = JSON.parse(selectedItem.content) as OSINTContent
          
          // Create a more detailed knowledge graph
          const nodes: KnowledgeNode[] = [
            {
              position: new THREE.Vector3(0, 1, 0),
              content: parsedContent.title || "OSINT Data",
              connections: [1, 2]
            },
            {
              position: new THREE.Vector3(-2, -1, 0),
              content: parsedContent.source || "Data Source",
              connections: [0]
            },
            {
              position: new THREE.Vector3(2, -1, 0),
              content: `Confidence: ${parsedContent.confidence || "N/A"}`,
              connections: [0]
            }
          ]

          // Add description node if it exists and isn't too long
          if (parsedContent.description && parsedContent.description.length < 50) {
            nodes.push({
              position: new THREE.Vector3(0, -2, 0),
              content: parsedContent.description,
              connections: [0]
            })
            nodes[0].connections.push(3)
          }

          graphRef.current.setNodes(nodes)
        } catch (e) {
          console.error("Failed to parse OSINT content:", e)
        }
      }
    },
    [selectedItem]
  )

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault()
    if (graphRef.current) {
      graphRef.current.handleWheel(event)
    }
  }, [])

  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (graphRef.current) {
      graphRef.current.handlePanStart(event.clientX, event.clientY)
    }
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (graphRef.current) {
      graphRef.current.handlePanMove(event.clientX, event.clientY)
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.handlePanEnd()
    }
  }, [])

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (graphRef.current && event.touches.length === 1) {
      event.preventDefault()
      const touch = event.touches[0]
      graphRef.current.handlePanStart(touch.clientX, touch.clientY)
    }
  }, [])

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (graphRef.current && event.touches.length === 1) {
      event.preventDefault()
      const touch = event.touches[0]
      graphRef.current.handlePanMove(touch.clientX, touch.clientY)
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.handlePanEnd()
    }
  }, [])

  useEffect(() => {
    if (Platform.OS === "web" && glCanvas) {
      // Add event listeners for mouse/touch interactions
      glCanvas.addEventListener("wheel", handleWheel, { passive: false })
      glCanvas.addEventListener("mousedown", handleMouseDown)
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      
      // Touch events
      glCanvas.addEventListener("touchstart", handleTouchStart, { passive: false })
      glCanvas.addEventListener("touchmove", handleTouchMove, { passive: false })
      glCanvas.addEventListener("touchend", handleTouchEnd)
      glCanvas.addEventListener("touchcancel", handleTouchEnd)

      return () => {
        // Clean up event listeners
        glCanvas.removeEventListener("wheel", handleWheel)
        glCanvas.removeEventListener("mousedown", handleMouseDown)
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
        
        glCanvas.removeEventListener("touchstart", handleTouchStart)
        glCanvas.removeEventListener("touchmove", handleTouchMove)
        glCanvas.removeEventListener("touchend", handleTouchEnd)
        glCanvas.removeEventListener("touchcancel", handleTouchEnd)
      }
    }
  }, [glCanvas, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, 
      handleTouchStart, handleTouchMove, handleTouchEnd])

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
        <CardDescription>OSINT Event Connections (Use mouse wheel to zoom, drag to pan)</CardDescription>
      </CardHeader>
      <CardContent style={{ flex: 1 }}>
        <View style={styles.container}>
          <GLView
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
    height: "100%"
  },
  canvas: {
    flex: 1,
    width: "100%",
    height: "100%",
    minHeight: 300,
    cursor: "grab"
  }
})