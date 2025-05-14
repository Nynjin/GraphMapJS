import { Edge } from '@/types/Edge'
import { Node } from '@/types/Node'

import { create } from 'zustand'

interface GraphState {
  nodes: Node[]
  edges: Edge[]
  addNode: (node: Node) => void
  addEdge: (edge: Edge) => void
  moveNode: (id: string, x: number, y: number) => void
  deleteNode: (id: string) => void
  deleteEdge: (id: string) => void
  updateNode: (id: string, node: Node) => void
  updateEdge: (id: string, edge: Edge) => void
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],

  addNode: (node) => {
    set((state) => ({ nodes: [...state.nodes, node] }))
  },
  addEdge: (edge) => {
    set((state) => ({ edges: [...state.edges, edge] }))
  },
  moveNode: (id, x, y) => {
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
    }))
  },
  deleteNode: (id) => {
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
  updateNode: (id, node) => {
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
