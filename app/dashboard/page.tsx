'use client';

import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '@/lib/store';
import BpmnControls from './BpmnControls';
import Chat from 'components/chat';

export default function DashboardPage() {
  const { nodes, edges } = useStore();

  return (
    <div className="flex h-screen">
      <div className="flex-1 relative">
        <ReactFlow 
          nodes={nodes}
          edges={edges}
          fitView
          nodesDraggable
          nodesConnectable
          proOptions={{ hideAttribution: true }}
        >
          <BpmnControls />
        </ReactFlow>
      </div>
      <Chat className="w-96 border-l" />
    </div>
  );
}
