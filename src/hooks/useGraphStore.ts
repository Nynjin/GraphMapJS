// GraphStore update
import { Edge } from '@/types/Edge'
import { GraphNode } from '@/types/GraphNode'

import { create } from 'zustand'

interface GraphState {
  nodes: GraphNode[]
  edges: Edge[]
  addGraphNode: (node: GraphNode) => void
  addEdge: (edge: Edge) => void
  moveGraphNode: (id: string, x: number, y: number) => void
  deleteGraphNode: (id: string) => void
  deleteEdge: (id: string) => void
  updateGraphNode: (id: string, node: GraphNode) => void
  updateEdge: (id: string, edge: Edge) => void
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],

  addGraphNode: (node) => {
    set((state) => ({ nodes: [...state.nodes, node] }))
  },
  addEdge: (edge) => {
    set((state) => ({ edges: [...state.edges, edge], draftEdge: null }))
  },
  moveGraphNode: (id, x, y) => {
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
    }))
  },
  deleteGraphNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.from !== id && e.to !== id),
    }))
  },
  deleteEdge: (id) => {
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
    }))
  },
  updateGraphNode: (id, node) => {
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...node } : n)),
    }))
  },
  updateEdge: (id, edge) => {
    set((state) => ({
      edges: state.edges.map((e) => (e.id === id ? { ...e, ...edge } : e)),
    }))
  },
}))
