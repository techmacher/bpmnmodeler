import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';

export interface BpmnNodeData {
  label?: string;
  description?: string;
  condition?: string;
  // Event properties
  eventType?: string;
  timerType?: 'date' | 'duration' | 'cycle';
  timerExpression?: string;
  messageName?: string;
  correlationKey?: string;
  // Task properties
  taskType?: string;
  assignee?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  implementation?: string;
  operation?: string;
  scriptFormat?: string;
  scriptContent?: string;
  // Gateway properties
  gatewayDirection?: 'diverging' | 'converging';
  defaultFlow?: string;
  // Data properties
  dataStructure?: string;
  dataSchema?: string;
  // Documentation
  documentation?: string;
}

export type BpmnNode = Node<BpmnNodeData>;

export type DiagramState = {
  nodes: BpmnNode[];
  edges: Edge[];
};

export interface PropertiesPanelState {
  position: { x: number; y: number } | null;
  offset: { x: number; y: number };
  isDragging: boolean;
  nodeDragging: boolean;
  activeTab: 'general' | 'advanced' | 'documentation';
}

interface EditorState {
  nodes: BpmnNode[];
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
  setNodes: (nodes: BpmnNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeData: (nodeId: string, data: Partial<BpmnNodeData>) => void;
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
  setNodeDragging: (isDragging: boolean) => void;
  setPanelTab: (tab: PropertiesPanelState['activeTab']) => void;
  undo: () => void;
  redo: () => void;
}

export const useStore = create<EditorState>((set) => ({
  propertiesPanel: {
    position: null,
    offset: { x: 20, y: 0 }, // Default offset from node
    isDragging: false,
    nodeDragging: false,
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
  setNodes: (nodes: BpmnNode[]) => set((state) => {
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
  updateNodeData: (nodeId: string, data: Partial<BpmnNodeData>) => set((state) => {
    if (state.isLocked) return state;
    const updatedNodes = state.nodes.map(node =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, ...data } }
        : node
    );
    const nodesChanged = JSON.stringify(updatedNodes) !== JSON.stringify(state.nodes);
    return {
      nodes: updatedNodes,
      history: nodesChanged ? {
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
  setNodeDragging: (nodeDragging) => set((state) => ({
    propertiesPanel: { ...state.propertiesPanel, nodeDragging }
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
