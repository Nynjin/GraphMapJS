import { useGraphStore } from '@/hooks/useGraphStore'
import { Edge } from '@/types/Edge'
import { Node } from '@/types/Node'
import { Tool } from '@/types/Tool'

export function EdgeRenderer({
  edge,
  from,
  to,
  currentTool,
}: {
  edge: Edge
  from: Node
  to: Node
  currentTool: Tool
}) {
  const { deleteEdge } = useGraphStore()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentTool === 'delete') {
      deleteEdge(edge.id)
    }
  }

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="#888"
      strokeWidth={2}
      onClick={handleClick}
    />
  )
}
