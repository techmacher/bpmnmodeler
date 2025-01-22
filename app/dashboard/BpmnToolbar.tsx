import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import * as Icons from './BpmnIcons';
import { useStore } from '@/lib/store';
import { useBpmnTypes } from './BpmnContext';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

export default function BpmnToolbar() {
  const { setNodes, nodes } = useStore();
  const { nodeTypes } = useBpmnTypes();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  const handleDragStart = (type: string, e: React.DragEvent) => {
    setDraggedNode(type);
    
    // Set the dragged element type for ReactFlow
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create ghost element
    const ghost = e.currentTarget.cloneNode(true) as HTMLElement;
    ghost.style.transform = 'scale(0.8)';
    ghost.style.opacity = '0.8';
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 20, 20);
    requestAnimationFrame(() => document.body.removeChild(ghost));
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
  };

  const addNode = (type: string) => {
    const newNode = {
      id: `${type}-${nodes.length + 1}`,
      type,
      position: { x: 100, y: 100 },
      data: { label: type }
    };
    setNodes([...nodes, newNode]);
  };

  const NodeButton = ({ 
    type, 
    icon: Icon, 
    title, 
    description 
  }: { 
    type: string; 
    icon: React.ComponentType<any>; 
    title: string; 
    description: string;
  }) => (
    <TooltipPrimitive.Root delayDuration={200}>
      <TooltipPrimitive.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 p-1.5 hover:bg-white/20 hover:scale-105 transition-all rounded-lg"
          draggable
          onDragStart={(e) => handleDragStart(type, e)}
          onDragEnd={handleDragEnd}
          onClick={() => addNode(type)}
        >
          <Icon 
            className="w-full h-full text-gray-700" 
            style={{ 
              stroke: 'currentColor',
              strokeWidth: type.includes('Event') ? 1.5 : 2,
              fill: type.includes('Event') ? 'white' : 'none'
            }} 
          />
        </Button>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="right" 
          sideOffset={10}
          className="z-[1000] rounded-md bg-white/75 px-3 py-2 text-xs text-gray-900 shadow-sm"
        >
          <div className="max-w-[160px]">
            <div className="font-medium">{title}</div>
            <div className="text-gray-600">{description}</div>
          </div>
          <TooltipPrimitive.Arrow className="fill-white/75" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );

  return (
    <TooltipPrimitive.Provider>
      <div className="fixed left-6 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-2 flex flex-col gap-2 z-[100] max-h-[80vh] overflow-y-auto">
        {/* Events */}
        <div className="flex flex-col gap-1.5">
          <NodeButton
            type="startEvent"
            icon={Icons.StartEventIcon}
            title="Start Event"
            description="Indicates where a process begins"
          />
          <NodeButton
            type="endEvent"
            icon={Icons.EndEventIcon}
            title="End Event"
            description="Indicates where a process ends"
          />
          <NodeButton
            type="timerEvent"
            icon={Icons.TimerEventIcon}
            title="Timer Event"
            description="Triggers based on time conditions"
          />
          <NodeButton
            type="messageEvent"
            icon={Icons.MessageEventIcon}
            title="Message Event"
            description="Handles message-based communication"
          />
        </div>

        {/* Tasks */}
        <div className="flex flex-col gap-1.5 border-t border-white/20 pt-2">
          <NodeButton
            type="userTask"
            icon={Icons.UserTaskIcon}
            title="User Task"
            description="Task performed by a human"
          />
          <NodeButton
            type="serviceTask"
            icon={Icons.ServiceTaskIcon}
            title="Service Task"
            description="Automated task performed by a system"
          />
          <NodeButton
            type="task"
            icon={Icons.TaskIcon}
            title="Generic Task"
            description="Basic task or activity"
          />
        </div>

        {/* Flow Control */}
        <div className="flex flex-col gap-1.5 border-t border-white/20 pt-2">
          <NodeButton
            type="exclusiveGateway"
            icon={Icons.ExclusiveGatewayIcon}
            title="Exclusive Gateway"
            description="Routes flow based on conditions"
          />
          <NodeButton
            type="parallelGateway"
            icon={Icons.ParallelGatewayIcon}
            title="Parallel Gateway"
            description="Splits flow into parallel paths"
          />
        </div>

        {/* Connectors */}
        <div className="flex flex-col gap-1.5 border-t border-white/20 pt-2">
          <NodeButton
            type="sequenceFlow"
            icon={Icons.ConnectIcon}
            title="Sequence Flow"
            description="Connects elements in sequence"
          />
        </div>
      </div>
    </TooltipPrimitive.Provider>
  );
}
