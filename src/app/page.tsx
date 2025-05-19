'use client'

import { Canvas } from '@/components/Canvas/Canvas'
import { Tool } from '@/types/Tool'

import { useState } from 'react'

export default function HomePage() {
  const [tool, setTool] = useState<Tool>(null)

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas currentTool={tool} setCurrentTool={setTool} />
    </div>
  )
}
