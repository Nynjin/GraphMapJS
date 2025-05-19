import React, { useEffect, useState } from 'react'

export function GridRenderer({
  spacing = 40,
  zoomTransform,
  svgRef,
}: {
  spacing?: number
  zoomTransform: d3.ZoomTransform
  svgRef: React.RefObject<SVGSVGElement>
}) {
  const [lines, setLines] = useState<JSX.Element[]>([])

  useEffect(() => {
    if (!svgRef.current) return

    const svgRect = svgRef.current.getBoundingClientRect()
    const { width, height } = svgRect

    const inv = zoomTransform.invert([0, 0])
    const [x0, y0] = inv
    const [x1, y1] = zoomTransform.invert([width, height])

    const visibleLines: JSX.Element[] = []

    const startX = Math.floor(x0 / spacing) * spacing
    const endX = Math.ceil(x1 / spacing) * spacing
    const startY = Math.floor(y0 / spacing) * spacing
    const endY = Math.ceil(y1 / spacing) * spacing

    for (let x = startX; x <= endX; x += spacing) {
      visibleLines.push(
        <line
          key={`v-${x.toString()}`}
          x1={x}
          y1={y0}
          x2={x}
          y2={y1}
          stroke="#ccc"
          strokeDasharray="4 4"
          strokeWidth={0.5}
        />,
      )
    }

    for (let y = startY; y <= endY; y += spacing) {
      visibleLines.push(
        <line
          key={`h-${y.toString()}`}
          x1={x0}
          y1={y}
          x2={x1}
          y2={y}
          stroke="#ccc"
          strokeDasharray="4 4"
          strokeWidth={0.5}
        />,
      )
    }

    setLines(visibleLines)
  }, [zoomTransform, spacing, svgRef])

  return <g>{lines}</g>
}
