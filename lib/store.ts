import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';

export type DiagramState = {
  nodes: Node[];
  edges: Edge[];
};

interface EditorState {
  nodes: Node[];
  edges: Edge[];
  selected: string[];
  history: {
    past: DiagramState[];
    future: DiagramState[];
  };
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelected: (ids: string[]) => void;
  undo: () => void;
  redo: () => void;
}

export const useStore = create<EditorState>((set) => ({
  nodes: [],
  edges: [],
  selected: [],
  history: {
    past: [],
    future: []
  },
  setNodes: (nodes: Node[]) => set((state) => ({
    nodes,
    history: {
      past: [...state.history.past, { nodes: state.nodes, edges: state.edges }],
      future: []
    }
  })),
  setEdges: (edges: Edge[]) => set((state) => ({
    edges,
    history: {
      past: [...state.history.past, { nodes: state.nodes, edges: state.edges }],
      future: []
    }
  })),
  setSelected: (selected: string[]) => set({ selected }),
  undo: () => set((state) => {
    if (state.history.past.length === 0) return state;
    const previous = state.history.past[state.history.past.length - 1];
    return {
      nodes: previous.nodes,
      edges: previous.edges,
      history: {
        past: state.history.past.slice(0, -1),
        future: [...state.history.future, { nodes: state.nodes, edges: state.edges }]
      }
    };
  }),
  redo: () => set((state) => {
    if (state.history.future.length === 0) return state;
    const next = state.history.future[state.history.future.length - 1];
    return {
      nodes: next.nodes,
      edges: next.edges,
      history: {
        past: [...state.history.past, { nodes: state.nodes, edges: state.edges }],
        future: state.history.future.slice(0, -1)
      }
    };
  })
}));
