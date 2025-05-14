'use client'

import { EdgeRenderer } from '@/components/Renderers/EdgeRenderer'
import { GraphNodeRenderer } from '@/components/Renderers/GraphNodeRenderer'
import { GridRenderer } from '@/components/Renderers/GridRenderer'
import { Tool } from '@/types/Tool'

import { useEffect, useRef, useState } from 'react'

import * as d3 from 'd3'
import { Toaster } from 'sonner'

export function Canvas({
  currentTool,
}: {
  currentTool: Tool
  setCurrentTool: (tool: Tool) => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const [zoomTransform, setZoomTransform] = useState(d3.zoomIdentity)

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return

    const svg = d3.select(svgRef.current)
    const g = d3.select(gRef.current)

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 5])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString())
        setZoomTransform(event.transform)
      })

    svg.call(zoom)

    if (currentTool !== 'span') svg.call(zoom).on('mousedown.zoom', null)
  }, [currentTool])

  return (
    <div className="relative w-full h-full">
      <Toaster></Toaster>
      <svg
        ref={svgRef}
        className="w-full h-full bg-white"
        style={{
          cursor: currentTool === 'node' ? 'crosshair' : 'default',
        }}
      >
        <g ref={gRef}>
          <GridRenderer zoomTransform={zoomTransform} svgRef={svgRef} />
          <EdgeRenderer currentTool={currentTool} svgRef={svgRef} zoomTransform={zoomTransform} />
          <GraphNodeRenderer
            currentTool={currentTool}
            svgRef={svgRef}
            zoomTransform={zoomTransform}
          />
        </g>
      </svg>
    </div>
  )
}
