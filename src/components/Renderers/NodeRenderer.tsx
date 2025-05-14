import { useGraphStore } from '@/hooks/useGraphStore'
import { Node } from '@/types/Node'
import { Tool } from '@/types/Tool'

export function NodeRenderer({
  node,
  currentTool,
  onClickNode,
}: {
  node: Node
  currentTool: Tool
  onClickNode: (nodeId: string, e: React.MouseEvent) => void
}) {
  const { moveNode, deleteNode } = useGraphStore()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (currentTool === 'delete') {
      deleteNode(node.id)
    } else if (currentTool === 'edge') {
      onClickNode(node.id, e)
    }
  }

  const handleDrag = (e: React.MouseEvent) => {
    e.stopPropagation()

    const startX = e.clientX
    const startY = e.clientY
    const startNodeX = node.x
    const startNodeY = node.y

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY

      const newX = startNodeX + deltaX
      const newY = startNodeY + deltaY

      const isColliding = useGraphStore.getState().nodes.some((n) => {
        if (n.id === node.id) return false // Skip self
        const dx = n.x - newX
        const dy = n.y - newY
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < 24 // Adjust this value based on your node size
      })
      if (isColliding) return

      moveNode(node.id, startNodeX + deltaX, startNodeY + deltaY)
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <>
      {/* Invisible larger hitbox */}
      <circle
        cx={node.x}
        cy={node.y}
        r={15} // larger than visual node
        fill="transparent"
        stroke="transparent"
        onClick={handleClick}
        onMouseDown={handleDrag}
        style={{ cursor: currentTool === 'edge' ? 'crosshair' : 'pointer' }}
      />

      {/* Visible node */}
      <circle
        cx={node.x}
        cy={node.y}
        r={12}
        fill="skyblue"
        stroke="#444"
        pointerEvents="none" // allows clicks to pass through to hitbox
      />

      {/* Label */}
      <text
        x={node.x}
        y={node.y - 16}
        fontSize={12}
        fill="#333"
        textAnchor="middle"
        pointerEvents="none"
      >
        {node.label}
      </text>
    </>
  )
}
