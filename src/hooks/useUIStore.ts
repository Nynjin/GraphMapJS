import { create } from 'zustand'

interface UIState {
  isDraggingNode: boolean
  setIsDraggingNode: (v: boolean) => void

  hoveredNodeId: string | null
  setHoveredNodeId: (id: string | null) => void

  // Optional for future use:
  selectedNodeIds: string[]
  toggleSelectedNode: (id: string) => void

  panEnabled: boolean
  setPanEnabled: (enabled: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isDraggingNode: false,
  setIsDraggingNode: (v) => {
    set({ isDraggingNode: v })
  },

  hoveredNodeId: null,
  setHoveredNodeId: (id) => {
    set({ hoveredNodeId: id })
  },

  selectedNodeIds: [],
  toggleSelectedNode: (id) => {
    set((state) => ({
      selectedNodeIds: state.selectedNodeIds.includes(id)
        ? state.selectedNodeIds.filter((i) => i !== id)
        : [...state.selectedNodeIds, id],
    }))
  },

  panEnabled: true,
  setPanEnabled: (enabled) => {
    set({ panEnabled: enabled })
  },
}))
