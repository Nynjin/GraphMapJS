'use client'

import { EdgeRenderer } from '@/components/Renderers/EdgeRenderer'
import { GridRenderer } from '@/components/Renderers/GridRenderer'
import { NODE_RADIUS, NodeRenderer } from '@/components/Renderers/NodeRenderer'
import { TempEdgeRenderer } from '@/components/Renderers/TempEdgeRenderer'
import { useGraphStore } from '@/hooks/useGraphStore'
import { TempEdge } from '@/types/TempEdge'
import { Tool } from '@/types/Tool'
import { IsOverlapping } from '@/utils/IsOverlapping'

import { useEffect, useRef, useState } from 'react'

import { Toaster, toast } from 'sonner'

export function Canvas({
  currentTool,
  setCurrentTool,
}: {
  currentTool: Tool
  setCurrentTool: (tool: Tool) => void
}) {
  const { nodes, edges, addNode, addEdge } = useGraphStore()
  const svgRef = useRef<SVGSVGElement>(null)
  const [tempEdge, setTempEdge] = useState<TempEdge | null>(null)

  const getCoords = (e: React.MouseEvent) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse())
    return { x: cursor.x, y: cursor.y }
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (currentTool === 'edge' && tempEdge) {
      // Clicked on empty canvas — cancel edge
      setTempEdge(null)
      return
    }

    if (currentTool === 'node') {
      const { x, y } = getCoords(e)
      const id = crypto.randomUUID()
      if (IsOverlapping(x, y, NODE_RADIUS, nodes)) {
        // Check if the new node overlaps with existing nodes
        toast.warning('Node overlaps with existing nodes', {
          description: 'Please choose a different location.',
        })
        return
      }
      addNode({ id, x, y, label: id.slice(0, 4) })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tempEdge) {
      const { x, y } = getCoords(e)
      setTempEdge((prev) => prev && { ...prev, x, y })
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (tempEdge) setTempEdge(null)
      else setCurrentTool(null)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  const handleEdgeCreation = (nodeId: string, e: React.MouseEvent) => {
    if (currentTool !== 'edge') return

    if (!tempEdge) {
      // First click — set starting node for edge
      setTempEdge({ fromId: nodeId, x: e.clientX, y: e.clientY })
    } else if (tempEdge.fromId !== nodeId) {
      // Second click — finalize edge
      addEdge({
        id: crypto.randomUUID(),
        from: tempEdge.fromId,
        to: nodeId,
      })
      setTempEdge(null)
    }
  }

  return (
    <div className="relative w-full h-full">
      <Toaster></Toaster>
      <svg
        ref={svgRef}
        className="w-full h-full bg-white"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        style={{
          cursor: currentTool === 'node' ? 'crosshair' : 'default',
        }}
      >
        <GridRenderer />
        {edges.map((edge) => {
          const from = nodes.find((n) => n.id === edge.from)
          const to = nodes.find((n) => n.id === edge.to)
          if (!from || !to) return null
          return (
            <EdgeRenderer key={edge.id} edge={edge} from={from} to={to} currentTool={currentTool} />
          )
        })}

        {tempEdge && <TempEdgeRenderer fromId={tempEdge.fromId} x={tempEdge.x} y={tempEdge.y} />}

        {nodes.map((node) => (
          <NodeRenderer
            key={node.id}
            node={node}
            currentTool={currentTool}
            onClickNode={handleEdgeCreation}
          />
        ))}
      </svg>
    </div>
  )
}
