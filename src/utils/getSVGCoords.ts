export function getSVGCoords(e: React.PointerEvent, svg: SVGSVGElement | null) {
  if (!svg?.getScreenCTM()) return { x: 0, y: 0 }
  const pt = svg.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY
  const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse())
  return { x: cursor.x, y: cursor.y }
}
