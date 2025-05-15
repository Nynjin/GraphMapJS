// import * as d3 from 'd3'
// import { create } from 'zustand'

// interface UIState {
//   isDraggingNode: boolean
//   setIsDraggingNode: (v: boolean) => void

//   hoveredNodeId: string | null
//   setHoveredNodeId: (id: string | null) => void

//   selectedNodeIds: string[]
//   toggleSelectedNode: (id: string) => void

//   panEnabled: boolean
//   setPanEnabled: (enabled: boolean) => void

//   zoomTransform: d3.ZoomTransform
//   setZoomTransform: (transform: d3.ZoomTransform) => void
// }

// export const useUIStore = create<UIState>((set) => ({
//   isDraggingNode: false,
//   setIsDraggingNode: (v) => {
//     set({ isDraggingNode: v })
//   },

//   hoveredNodeId: null,
//   setHoveredNodeId: (id) => {
//     set({ hoveredNodeId: id })
//   },

//   selectedNodeIds: [],
//   toggleSelectedNode: (id) => {
//     set((state) => ({
//       selectedNodeIds: state.selectedNodeIds.includes(id)
//         ? state.selectedNodeIds.filter((i) => i !== id)
//         : [...state.selectedNodeIds, id],
//     }))
//   },
// }))
