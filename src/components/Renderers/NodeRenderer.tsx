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
  const { deleteNode } = useGraphStore()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (currentTool === 'delete') {
      deleteNode(node.id)
    } else if (currentTool === 'edge') {
      onClickNode(node.id, e)
    }
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
