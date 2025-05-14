'use client'

import { EDGE_HITBOX, EDGE_WIDTH, NODE_RADIUS } from '@/constants/Graph'
import { useGraphStore } from '@/hooks/useGraphStore'
import { useUIStore } from '@/hooks/useUIStore'
import { GraphNode } from '@/types/GraphNode'
import { Tool } from '@/types/Tool'

import { useEffect, useState } from 'react'

export function EdgeRenderer({
  currentTool,
  svgRef,
}: {
  currentTool: Tool
  svgRef: React.RefObject<SVGSVGElement>
}) {
  const { edges, addEdge, deleteEdge, nodes } = useGraphStore()
  const [isCreating, setIsCreating] = useState(false)
  const [startGraphNode, setStartGraphNode] = useState<GraphNode | null>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)
  const { isDraggingNode } = useUIStore()

  // Handle canvas clicks for edge creation
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || currentTool !== 'edge') return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as SVGElement
      if (target.closest('[data-edge-id]')) return // Prevent click on existing edges

      const pt = svg.createSVGPoint()
      pt.x = e.clientX
      pt.y = e.clientY
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())

      if (!isCreating && !isDraggingNode) {
        // Start creating an edge if not already creating
        const node = nodes.find((n) => {
          const dx = svgP.x - n.x
          const dy = svgP.y - n.y
          return Math.sqrt(dx * dx + dy * dy) < NODE_RADIUS * 2
        })

        if (node) {
          setStartGraphNode(node)
          setIsCreating(true)
        }
      } else {
        // Finalize edge creation on second click
        const node = nodes.find((n) => {
          const dx = svgP.x - n.x
          const dy = svgP.y - n.y
          return Math.sqrt(dx * dx + dy * dy) < NODE_RADIUS * 2
        })

        if (node && startGraphNode && node.id !== startGraphNode.id) {
          addEdge({
            id: `${startGraphNode.id}-${node.id}`,
            from: startGraphNode.id,
            to: node.id,
          })
          setIsCreating(false)
          setStartGraphNode(null)
        } else {
          // Cancel edge creation if clicked outside a node
          setIsCreating(false)
          setStartGraphNode(null)
          setMousePosition(null)
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isCreating) return
      const pt = svg.createSVGPoint()
      pt.x = e.clientX
      pt.y = e.clientY
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())
      setMousePosition({ x: svgP.x, y: svgP.y })
    }

    svg.addEventListener('click', handleClick)
    svg.addEventListener('mousemove', handleMouseMove)
    return () => {
      svg.removeEventListener('click', handleClick)
      svg.removeEventListener('mousemove', handleMouseMove)
    }
  }, [currentTool, svgRef, nodes, addEdge, isCreating, startGraphNode, isDraggingNode])

  // Handle edge deletion
  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentTool === 'delete') {
      deleteEdge(id)
    }
  }

  return (
    <>
      {/* Render existing edges */}
      {edges.map((edge) => {
        const fromGraphNode = nodes.find((n) => n.id === edge.from)
        const toGraphNode = nodes.find((n) => n.id === edge.to)

        return fromGraphNode && toGraphNode ? (
          <>
            {/* Visible thin edge */}
            <line
              key={`visible-${edge.id}`}
              data-edge-id={edge.id}
              x1={fromGraphNode.x}
              y1={fromGraphNode.y}
              x2={toGraphNode.x}
              y2={toGraphNode.y}
              stroke="#888"
              strokeWidth={EDGE_WIDTH}
              pointerEvents="none" // avoid blocking the hitbox line
            />

            {/* Invisible, thick hitbox */}
            <line
              key={`hitbox-${edge.id}`}
              x1={fromGraphNode.x}
              y1={fromGraphNode.y}
              x2={toGraphNode.x}
              y2={toGraphNode.y}
              stroke="transparent"
              strokeWidth={EDGE_HITBOX} // Bigger click area
              onClick={handleClick(edge.id)}
              onMouseOver={(e) => {
                e.currentTarget.style.cursor = 'pointer'
              }}
            />
          </>
        ) : null
      })}

      {/* Temporary dashed edge if creating new one */}
      {isCreating && startGraphNode && mousePosition && (
        <line
          x1={startGraphNode.x}
          y1={startGraphNode.y}
          x2={mousePosition.x}
          y2={mousePosition.y}
          stroke="gray"
          strokeWidth={2}
          strokeDasharray="4"
        />
      )}
    </>
  )
}
