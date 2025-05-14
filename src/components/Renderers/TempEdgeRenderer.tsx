import { useGraphStore } from '@/hooks/useGraphStore'

export function TempEdgeRenderer({ fromId, x, y }: { fromId: string; x: number; y: number }) {
  const from = useGraphStore.getState().nodes.find((n) => n.id === fromId)
  if (!from) return null

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={x}
      y2={y}
      stroke="gray"
      strokeDasharray="4 2"
      strokeWidth={2}
    />
  )
}
