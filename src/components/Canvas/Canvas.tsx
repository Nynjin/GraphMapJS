'use client'

import { Toolbar } from '@/components/Menus/Toolbar'
import { EdgeRenderer } from '@/components/Renderers/EdgeRenderer'
import { GraphNodeRenderer } from '@/components/Renderers/GraphNodeRenderer'
import { GridRenderer } from '@/components/Renderers/GridRenderer'
import { Tool } from '@/types/Tool'

import { useEffect, useRef, useState } from 'react'

import * as d3 from 'd3'
import { Toaster } from 'sonner'

export function Canvas({
  currentTool,
  setCurrentTool,
}: {
  currentTool: Tool
  setCurrentTool: (tool: Tool) => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [panEnabled, setPanEnabled] = useState(true)
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity)

  // Apply transform when it changes externally
  useEffect(() => {
    if (!gRef.current) return
    const g = d3.select(gRef.current)
    g.attr('transform', zoomTransform.toString())

    // If we have active zoom behavior, update its transform too
    if (zoomRef.current && svgRef.current) {
      d3.select(svgRef.current).call(zoomRef.current.transform.bind(zoomRef.current), zoomTransform)
    }
  }, [zoomTransform])

  // Setup zoom behavior
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return

    const svg = d3.select(svgRef.current)
    const g = d3.select(gRef.current)

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 5])
      .filter((event: PointerEvent) => {
        // Enable zooming with mouse wheel
        if (event.type === 'wheel') return true

        // Enable panning only with middle mouse button or left button if panEnabled
        if (event.type === 'mousedown') {
          return panEnabled && (event.button === 1 || event.button === 0)
        }

        // Enable touch events for mobile
        if (event.type.startsWith('touch')) {
          return panEnabled
        }

        return false
      })
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString())
        setZoomTransform(event.transform)
      })

    // Store zoom reference so it can be used to programmatically update zoom
    zoomRef.current = zoom

    // Set initial transform from store
    svg.call(zoom.transform.bind(zoom), zoomTransform)

    svg.call(zoom)

    // Prevent default middle-click behavior (usually autoscroll)
    svg.on('mousedown', (event: PointerEvent) => {
      if (event.button === 1) {
        event.preventDefault()
      }
    })

    return () => {
      // Clean up zoom behavior
      zoomRef.current = null
    }
  }, [panEnabled, zoomTransform, setZoomTransform])

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
            setPanEnabled={setPanEnabled}
          />
        </g>
      </svg>
      <Toolbar
        currentTool={currentTool}
        onSelectTool={setCurrentTool}
        setZoomTransform={setZoomTransform}
      />
    </div>
  )
}
