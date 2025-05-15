import { Tool } from '@/types/Tool'

import * as d3 from 'd3'
import { Circle, RefreshCcw, Spline, Trash } from 'lucide-react'

interface Props {
  currentTool: string | null
  onSelectTool: (tool: Tool) => void
  setZoomTransform: (transform: d3.ZoomTransform) => void
}

export function Toolbar({ currentTool, onSelectTool, setZoomTransform }: Props) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl p-3 flex space-x-4 z-50">
      <button
        onClick={() => {
          setZoomTransform(d3.zoomIdentity)
        }}
        className="p-2 rounded-full text-white bg-gray-200 hover:bg-blue-200 active:bg-blue-500 transition-colors duration-100"
      >
        <RefreshCcw />
      </button>
      <button
        onClick={() => {
          onSelectTool(currentTool === 'node' ? null : 'node')
        }}
        className={`p-2 rounded-full ${currentTool === 'node' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        <Circle />
      </button>
      <button
        onClick={() => {
          onSelectTool(currentTool === 'edge' ? null : 'edge')
        }}
        className={`p-2 rounded-full ${currentTool === 'edge' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        <Spline />
      </button>
      <button
        onClick={() => {
          onSelectTool(currentTool === 'delete' ? null : 'delete')
        }}
        className={`p-2 rounded-full ${currentTool === 'delete' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
      >
        <Trash />
      </button>
    </div>
  )
}
