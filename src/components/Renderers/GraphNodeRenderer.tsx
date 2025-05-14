'use client'

import { NODE_HITBOX, NODE_RADIUS } from '@/constants/Graph'
import { useGraphStore } from '@/hooks/useGraphStore'
import { useUIStore } from '@/hooks/useUIStore'
import { Tool } from '@/types/Tool'

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
}: {
  currentTool: Tool
  svgRef: React.RefObject<SVGSVGElement>
}) {
  const { nodes, addGraphNode, deleteGraphNode, moveGraphNode } = useGraphStore()
  const { setIsDraggingNode } = useUIStore()

  // Handle canvas clicks for node creation
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || currentTool !== 'node') return

    const handleClick = (e: MouseEvent) => {
      // Prevent adding if clicking on a node
      const target = e.target as SVGElement
      if (target.closest('[data-node-id]')) return

      const pt = svg.createSVGPoint()
      pt.x = e.clientX
      pt.y = e.clientY
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())

      const isOverlapping = nodes.some((n) => {
        const dx = svgP.x - n.x
        const dy = svgP.y - n.y
        return Math.sqrt(dx * dx + dy * dy) < NODE_DIAMETER
      })
      if (isOverlapping)
        return toast.warning('Too close to existing node', {
          description: 'Please choose a different location.',
        })

      const id = crypto.randomUUID()
      addGraphNode({ id, x: svgP.x, y: svgP.y, label: getNextAvailableLabel(nodes) })
    }

    svg.addEventListener('click', handleClick)
    return () => {
      svg.removeEventListener('click', handleClick)
    }
  }, [currentTool, svgRef, nodes, addGraphNode])

  // Drag logic
  const handleDrag = (nodeId: string, nodeX: number, nodeY: number) => (e: React.MouseEvent) => {
    e.stopPropagation()

    if (currentTool === 'delete') {
      deleteGraphNode(nodeId)
      return
    }

    const startX = e.clientX
    const startY = e.clientY

    const onMove = (moveEvent: MouseEvent) => {
      setIsDraggingNode(true)

      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
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
      setIsDraggingNode(false)
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
