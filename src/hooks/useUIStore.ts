import { Tool } from '@/types/Tool'

import { create } from 'zustand'

interface UIState {
  currentTool: Tool
  setTool: (tool: Tool) => void
}

export const useUIStore = create<UIState>((set) => ({
  currentTool: null,
  setTool: (tool) => {
    set({ currentTool: tool })
  },
}))
