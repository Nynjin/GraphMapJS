import { Tool } from '@/types/Tool'

import { Circle, MousePointer2, Move, Spline, Trash } from 'lucide-react'

interface Props {
  currentTool: string | null
  onSelectTool: (tool: Tool) => void
}

export function Toolbar({ currentTool, onSelectTool }: Props) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl p-3 flex space-x-4 z-50">
      <button
        onClick={() => {
          onSelectTool(currentTool === 'pointer' ? null : 'pointer')
        }}
        className={`p-2 rounded-full ${currentTool === 'pointer' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        <MousePointer2 />
      </button>
      <button
        onClick={() => {
          onSelectTool(currentTool === 'span' ? null : 'span')
        }}
        className={`p-2 rounded-full ${currentTool === 'span' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        <Move />
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
