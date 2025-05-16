'use client'

import { NODE_HITBOX, NODE_RADIUS } from '@/constants/Graph'
import { useGraphStore } from '@/hooks/useGraphStore'
import { Tool } from '@/types/Tool'
import { getNextAvailableLabel } from '@/utils/getNextAvailableLabel'
import { getSVGPoint } from '@/utils/getSVGPoint'

import React, { useEffect } from 'react'

import { toast } from 'sonner'

const NODE_DIAMETER = NODE_RADIUS * 2

function getEventClientPoint(e: MouseEvent | TouchEvent) {
  if ('touches' in e && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  } else if ('changedTouches' in e && e.changedTouches.length > 0) {
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
  } else if ('clientX' in e && 'clientY' in e) {
    return { x: e.clientX, y: e.clientY }
  }
  throw new Error('Invalid event object for pointer coordinates')
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
  const nodesRef = React.useRef(nodes)

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  // ─── Node Creation ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || currentTool !== 'node') return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as SVGElement
      if (target.closest('[data-node-id]')) return

      const point = getSVGPoint(svg, e.clientX, e.clientY, zoomTransform)

      const isOverlapping = nodes.some((n) => {
        const dx = point.x - n.x
        const dy = point.y - n.y
        return Math.sqrt(dx * dx + dy * dy) < NODE_DIAMETER
      })

      if (isOverlapping) {
        toast.warning('Too close to existing node', {
          description: 'Please choose a different location.',
        })
        return
      }

      addGraphNode({
        id: crypto.randomUUID(),
        x: point.x,
        y: point.y,
        label: getNextAvailableLabel(nodes),
      })
    }

    svg.addEventListener('click', handleClick)
    return () => {
      svg.removeEventListener('click', handleClick)
    }
  }, [currentTool, svgRef, nodes, addGraphNode, zoomTransform])

  // ─── Unified Drag Handler ───────────────────────────────────────────────────────
  function beginDrag(
    nodeId: string,
    nodeX: number,
    nodeY: number,
    startClient: { x: number; y: number },
  ) {
    const svg = svgRef.current
    if (!svg) return

    const startPoint = getSVGPoint(svg, startClient.x, startClient.y, zoomTransform)

    const onMove = (event: MouseEvent | TouchEvent) => {
      event.stopPropagation()

      try {
        const client = getEventClientPoint(event)
        const movePoint = getSVGPoint(svg, client.x, client.y, zoomTransform)

        const dx = movePoint.x - startPoint.x
        const dy = movePoint.y - startPoint.y
        const newX = nodeX + dx
        const newY = nodeY + dy

        // Prevent collision only with other nodes
        const isColliding = nodesRef.current.some((n) => {
          if (n.id === nodeId) return false
          const ddx = n.x - newX
          const ddy = n.y - newY
          return Math.sqrt(ddx * ddx + ddy * ddy) < NODE_DIAMETER
        })

        if (!isColliding) {
          moveGraphNode(nodeId, newX, newY)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const onEnd = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('touchmove', onEnd)
      window.removeEventListener('touchend', onEnd)
      setPanEnabled(true)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onEnd)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', onEnd)
  }

  function handlePointerDown(e: React.PointerEvent, nodeId: string, nodeX: number, nodeY: number) {
    e.preventDefault()
    e.stopPropagation()

    if (!nodeId) return

    if (currentTool === 'delete') {
      deleteGraphNode(nodeId)
      return
    }

    if (currentTool === 'edge') return

    setPanEnabled(false)

    const client = { x: e.clientX, y: e.clientY }

    beginDrag(nodeId, nodeX, nodeY, client)
  }

  function handleNodeClick(e: React.MouseEvent, nodeId: string) {
    e.stopPropagation()
    if (currentTool === 'delete') deleteGraphNode(nodeId)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────────
  return (
    <>
      {nodes.map((node) => (
        <g key={node.id} data-node-id={node.id}>
          {/* Hitbox */}
          <circle
            cx={node.x}
            cy={node.y}
            r={NODE_HITBOX}
            fill="transparent"
            stroke="transparent"
            style={{ cursor: currentTool === 'edge' ? 'crosshair' : 'pointer' }}
            onClick={(e) => {
              handleNodeClick(e, node.id)
            }}
            onContextMenu={(e) => {
              e.preventDefault()
              deleteGraphNode(node.id)
            }}
            onPointerDown={(e) => {
              setPanEnabled(false)
              handlePointerDown(e, node.id, node.x, node.y)
            }}
            onPointerUp={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setPanEnabled(true)
            }}
            onMouseOver={() => {
              setPanEnabled(false)
            }}
            onMouseOut={() => {
              setPanEnabled(true)
            }}
          />

          {/* Visual Node */}
          <circle
            cx={node.x}
            cy={node.y}
            r={NODE_RADIUS}
            fill={'skyblue'}
            stroke="#444"
            pointerEvents="none"
          />

          {/* Label */}
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
