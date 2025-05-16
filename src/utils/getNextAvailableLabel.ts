export function getNextAvailableLabel(nodes: { label: string }[]): string {
  const used = new Set<number>()

  for (const node of nodes) {
    const match = node.label.match(/^N(\d+)$/)
    if (match) used.add(parseInt(match[1]))
  }

  let i = 1
  while (used.has(i)) i++
  return `N${i.toString()}`
}
