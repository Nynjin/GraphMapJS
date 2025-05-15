'use client'

import { NODE_HITBOX, NODE_RADIUS } from '@/constants/Graph'
import { useGraphStore } from '@/hooks/useGraphStore'
import { Tool } from '@/types/Tool'
import { getSVGPoint } from '@/utils/getSVGPoint'

import { useEffect } from 'react'

import { toast } from 'sonner'

const NODE_DIAMETER = NODE_RADIUS * 2

function getNextAvailableLabel(nodes: { label: string }[]): string {
  const used = new Set<number>()

  for (const node of nodes) {
    const match = node.label.match(/^N(\d+)$/)
    if (match) used.add(parseInt(match[1]))
  }

  let i = 1
  while (used.has(i)) i++
  return `N${i.toString()}`
}

export function GraphNodeRenderer({
  currentTool,
  svgRef,
  zoomTransform,
  setPanEnabled,
}: {
  currentTool: Tool
  svgRef: React.RefObject<SVGSVGElement>
  zoomTransform: d3.ZoomTransform
  setPanEnabled: (enabled: boolean) => void
}) {
  const { nodes, addGraphNode, deleteGraphNode, moveGraphNode } = useGraphStore()

  // Handle canvas clicks for node creation
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || currentTool !== 'node') return

    const handleClick = (e: MouseEvent) => {
      // Prevent adding if clicking on a node
      const target = e.target as SVGElement
      if (target.closest('[data-node-id]')) return

      const point = getSVGPoint(svg, e.clientX, e.clientY, zoomTransform)

      const isOverlapping = nodes.some((n) => {
        const dx = point.x - n.x
        const dy = point.y - n.y
        return Math.sqrt(dx * dx + dy * dy) < NODE_DIAMETER
      })
      if (isOverlapping)
        return toast.warning('Too close to existing node', {
          description: 'Please choose a different location.',
        })

      const id = crypto.randomUUID()
      addGraphNode({ id, x: point.x, y: point.y, label: getNextAvailableLabel(nodes) })
    }

    svg.addEventListener('click', handleClick)
    return () => {
      svg.removeEventListener('click', handleClick)
    }
  }, [currentTool, svgRef, nodes, addGraphNode, zoomTransform])

  // Drag logic
  const handleDrag = (nodeId: string, nodeX: number, nodeY: number) => (e: React.MouseEvent) => {
    e.stopPropagation()

    if (currentTool === 'delete') {
      deleteGraphNode(nodeId)
      return
    }

    if (currentTool === 'edge') return

    const svg = svgRef.current
    if (!svg) return

    const startPoint = getSVGPoint(svg, e.clientX, e.clientY, zoomTransform)
    const onMove = (moveEvent: MouseEvent) => {
      const movePoint = getSVGPoint(svg, moveEvent.clientX, moveEvent.clientY, zoomTransform)

      const dx = movePoint.x - startPoint.x
      const dy = movePoint.y - startPoint.y
      const newX = nodeX + dx
      const newY = nodeY + dy

      const isColliding = useGraphStore.getState().nodes.some((n) => {
        if (n.id === nodeId) return false
        const ddx = n.x - newX
        const ddy = n.y - newY
        return Math.sqrt(ddx * ddx + ddy * ddy) < NODE_DIAMETER
      })
      if (!isColliding) {
        moveGraphNode(nodeId, newX, newY)
      }
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentTool === 'delete') {
      deleteGraphNode(id)
    }
  }

  return (
    <>
      {nodes.map((node) => (
        <g key={node.id} data-node-id={node.id}>
          {/* Large invisible hitbox for easier click/drag */}
          <circle
            cx={node.x}
            cy={node.y}
            r={NODE_HITBOX}
            fill="transparent"
            stroke="transparent"
            onClick={handleClick(node.id)}
            onMouseDown={handleDrag(node.id, node.x, node.y)}
            onMouseOver={() => {
              setPanEnabled(false)
            }}
            onMouseOut={() => {
              setPanEnabled(true)
            }}
            style={{ cursor: currentTool === 'edge' ? 'crosshair' : 'pointer' }}
          />
          {/* Visible node */}
          <circle
            cx={node.x}
            cy={node.y}
            r={NODE_RADIUS}
            fill="skyblue"
            stroke="#444"
            pointerEvents="none"
          />
          <text
            x={node.x}
            y={node.y - 16}
            fontSize={12}
            fill="#333"
            textAnchor="middle"
            pointerEvents="none"
            style={{ userSelect: 'none' }}
          >
            {node.label}
          </text>
        </g>
      ))}
    </>
  )
}
