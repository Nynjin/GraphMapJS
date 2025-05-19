export function getSVGPoint(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
  zoomTransform: d3.ZoomTransform,
): DOMPoint {
  const pt = svg.createSVGPoint()

  // Get the mouse position in the window
  pt.x = clientX
  pt.y = clientY

  // Get the bounding client rectangle of the SVG to factor in the position of the SVG element within the page
  const svgRect = svg.getBoundingClientRect()

  // Convert the mouse position from screen space to SVG coordinate space
  const x = pt.x - svgRect.left
  const y = pt.y - svgRect.top

  // Apply the inverse of the zoom transform to get the coordinates relative to the SVG space
  // Need to include the translation components (tx, ty) as well
  const transformedPoint = new DOMPoint(
    (x - zoomTransform.x) / zoomTransform.k,
    (y - zoomTransform.y) / zoomTransform.k,
  )

  return transformedPoint
}
