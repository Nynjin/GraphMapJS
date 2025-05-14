'use client'

import { EdgeRenderer } from '@/components/Renderers/EdgeRenderer'
import { GraphNodeRenderer } from '@/components/Renderers/GraphNodeRenderer'
import { GridRenderer } from '@/components/Renderers/GridRenderer'
import { Tool } from '@/types/Tool'

import { useRef } from 'react'

import { Toaster } from 'sonner'

export function Canvas({
  currentTool,
}: {
  currentTool: Tool
  setCurrentTool: (tool: Tool) => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)

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
        <GridRenderer />
        <EdgeRenderer currentTool={currentTool} svgRef={svgRef} />
        <GraphNodeRenderer currentTool={currentTool} svgRef={svgRef} />
      </svg>
    </div>
  )
}
