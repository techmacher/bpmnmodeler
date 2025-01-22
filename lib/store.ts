import { create } from 'zustand';
import { BpmnValidator } from './validation/bpmnValidation';
import type { BPMN } from './types/bpmn';

const validator = new BpmnValidator();
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
  actions: {
    updateNodes: (nodes: Node[]) => void;
    updateEdges: (edges: Edge[]) => void;
    setSelected: (ids: string[]) => void;
  };
}

export const useStore = create<EditorState>((set: (state: Partial<EditorState>) => void) => ({
  nodes: [],
  edges: [],
  selected: [],
  history: {
    past: [],
    future: []
  },
  actions: {
    updateNodes: (nodes) => set({ nodes }),
    updateEdges: (edges) => set({ edges }),
    setSelected: (selected) => set({ selected })
  }
}));