import { Node } from '@/types/Node'

export function IsOverlapping(x: number, y: number, radius: number, nodes: Node[]): boolean {
  return nodes.some((n) => {
    const dx = n.x - x
    const dy = n.y - y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < radius * 2
  })
}
