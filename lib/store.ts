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
  showGrid: boolean;
  snapToGrid: boolean;
  isLocked: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isExpanded: boolean;
  history: {
    past: DiagramState[];
    future: DiagramState[];
  };
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelected: (ids: string[]) => void;
  setShowGrid: (show: boolean) => void;
  setSnapToGrid: (snap: boolean) => void;
  setLocked: (locked: boolean) => void;
  setMinimized: (minimized: boolean) => void;
  setMaximized: (maximized: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  undo: () => void;
  redo: () => void;
}

export const useStore = create<EditorState>((set) => ({
  nodes: [],
  edges: [],
  selected: [],
  showGrid: true,
  snapToGrid: true,
  isLocked: false,
  isMinimized: false,
  isMaximized: false,
  isExpanded: false,
  history: {
    past: [],
    future: []
  },
  setNodes: (nodes: Node[]) => set((state) => {
    if (state.isLocked) return state;
    return {
      nodes,
      history: {
        past: [...state.history.past, { nodes: state.nodes, edges: state.edges }],
        future: []
      }
    };
  }),
  setEdges: (edges: Edge[]) => set((state) => {
    if (state.isLocked) return state;
    return {
      edges,
      history: {
        past: [...state.history.past, { nodes: state.nodes, edges: state.edges }],
        future: []
      }
    };
  }),
  setSelected: (selected: string[]) => set((state) => {
    if (state.isLocked) return state;
    return { selected };
  }),
  setShowGrid: (showGrid: boolean) => set((state) => ({ showGrid })),
  setSnapToGrid: (snapToGrid: boolean) => set((state) => ({ snapToGrid })),
  setLocked: (isLocked: boolean) => set((state) => ({ isLocked })),
  setMinimized: (isMinimized: boolean) => set((state) => ({ 
    ...state,
    isMinimized,
    isMaximized: isMinimized ? false : state.isMaximized,
    isExpanded: isMinimized ? false : state.isExpanded 
  })),
  setMaximized: (isMaximized: boolean) => set((state) => ({ 
    ...state,
    isMaximized,
    isMinimized: isMaximized ? false : state.isMinimized,
    isExpanded: isMaximized ? false : state.isExpanded 
  })),
  setExpanded: (isExpanded: boolean) => set((state) => ({ 
    ...state,
    isExpanded,
    isMinimized: isExpanded ? false : state.isMinimized,
    isMaximized: isExpanded ? false : state.isMaximized 
  })),
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
