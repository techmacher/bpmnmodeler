import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';

export type DiagramState = {
  nodes: Node[];
  edges: Edge[];
};

export interface PropertiesPanelState {
  position: { x: number; y: number } | null;
  offset: { x: number; y: number };
  isDragging: boolean;
  activeTab: 'general' | 'advanced' | 'documentation';
}

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
  propertiesPanel: PropertiesPanelState;
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
  setPanelPosition: (position: { x: number; y: number } | null) => void;
  setPanelOffset: (offset: { x: number; y: number }) => void;
  setPanelDragging: (isDragging: boolean) => void;
  setPanelTab: (tab: PropertiesPanelState['activeTab']) => void;
  undo: () => void;
  redo: () => void;
}

export const useStore = create<EditorState>((set) => ({
  propertiesPanel: {
    position: null,
    offset: { x: 20, y: 0 }, // Default offset from node
    isDragging: false,
    activeTab: 'general'
  },
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
    // Only add to history if nodes actually changed
    const nodesChanged = JSON.stringify(nodes) !== JSON.stringify(state.nodes);
    return {
      nodes,
      history: nodesChanged ? {
        past: [...state.history.past, { nodes: state.nodes, edges: state.edges }],
        future: []
      } : state.history
    };
  }),
  setEdges: (edges: Edge[]) => set((state) => {
    if (state.isLocked) return state;
    // Only add to history if edges actually changed
    const edgesChanged = JSON.stringify(edges) !== JSON.stringify(state.edges);
    return {
      edges,
      history: edgesChanged ? {
        past: [...state.history.past, { nodes: state.nodes, edges: state.edges }],
        future: []
      } : state.history
    };
  }),
  setSelected: (selected: string[]) => set((state) => {
    if (state.isLocked) return state;
    // Reset panel position when selection changes
    return { 
      selected,
      propertiesPanel: {
        ...state.propertiesPanel,
        position: null // Will be recalculated on render
      }
    };
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
  setPanelPosition: (position) => set((state) => {
    // Only update if position actually changed
    if (JSON.stringify(position) === JSON.stringify(state.propertiesPanel.position)) {
      return state;
    }
    return {
      propertiesPanel: { ...state.propertiesPanel, position }
    };
  }),
  setPanelOffset: (offset) => set((state) => ({
    propertiesPanel: { ...state.propertiesPanel, offset }
  })),
  setPanelDragging: (isDragging) => set((state) => ({
    propertiesPanel: { ...state.propertiesPanel, isDragging }
  })),
  setPanelTab: (activeTab) => set((state) => ({
    propertiesPanel: { ...state.propertiesPanel, activeTab }
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
