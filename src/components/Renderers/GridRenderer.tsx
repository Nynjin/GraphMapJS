// Grid.tsx
export function GridRenderer({ spacing = 40 }: { spacing?: number }) {
  const lines = []

  for (let i = 0; i <= 2000; i += spacing) {
    lines.push(
      <line
        key={`v-${i.toString()}`}
        x1={i}
        y1={0}
        x2={i}
        y2={2000}
        stroke="#ccc"
        strokeDasharray="4 4"
        strokeWidth={0.5}
      />,
      <line
        key={`h-${i.toString()}`}
        x1={0}
        y1={i}
        x2={2000}
        y2={i}
        stroke="#ccc"
        strokeDasharray="4 4"
        strokeWidth={0.5}
      />,
    )
  }

  return <g>{lines}</g>
}
