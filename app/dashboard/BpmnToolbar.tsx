'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import * as Icons from './BpmnIcons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Group BPMN elements by category
const toolbarGroups = {
  events: [
    { type: 'startEvent', label: 'Start Event', icon: Icons.StartEventIcon, description: 'Indicates where a process begins' },
    { type: 'endEvent', label: 'End Event', icon: Icons.EndEventIcon, description: 'Indicates where a process ends' },
    { type: 'intermediateThrowEvent', label: 'Intermediate Throw Event', icon: Icons.IntermediateThrowEventIcon, description: 'Throws an intermediate event' },
    { type: 'intermediateCatchEvent', label: 'Intermediate Catch Event', icon: Icons.IntermediateCatchEventIcon, description: 'Catches an intermediate event' },
    { type: 'timerEvent', label: 'Timer Event', icon: Icons.TimerEventIcon, description: 'Triggers based on time' },
    { type: 'messageEvent', label: 'Message Event', icon: Icons.MessageEventIcon, description: 'Handles message-based communication' },
    { type: 'signalEvent', label: 'Signal Event', icon: Icons.SignalEventIcon, description: 'Broadcasts or catches signals' }
  ],
  tasks: [
    { type: 'task', label: 'Task', icon: Icons.TaskIcon, description: 'Basic task or activity' },
    { type: 'userTask', label: 'User Task', icon: Icons.UserTaskIcon, description: 'Task performed by a human' },
    { type: 'serviceTask', label: 'Service Task', icon: Icons.ServiceTaskIcon, description: 'Automated task performed by a system' },
    { type: 'scriptTask', label: 'Script Task', icon: Icons.ScriptTaskIcon, description: 'Task executed by a script' },
    { type: 'businessRuleTask', label: 'Business Rule Task', icon: Icons.BusinessRuleTaskIcon, description: 'Task using business rules' }
  ],
  gateways: [
    { type: 'exclusiveGateway', label: 'Exclusive Gateway', icon: Icons.ExclusiveGatewayIcon, description: 'Routes flow based on conditions' },
    { type: 'parallelGateway', label: 'Parallel Gateway', icon: Icons.ParallelGatewayIcon, description: 'Creates parallel paths' },
    { type: 'inclusiveGateway', label: 'Inclusive Gateway', icon: Icons.InclusiveGatewayIcon, description: 'Routes based on inclusive conditions' },
    { type: 'eventBasedGateway', label: 'Event Based Gateway', icon: Icons.EventBasedGatewayIcon, description: 'Routes based on events' }
  ],
  data: [
    { type: 'dataObject', label: 'Data Object', icon: Icons.DataObjectIcon, description: 'Represents process data' },
    { type: 'dataStore', label: 'Data Store', icon: Icons.DataStoreIcon, description: 'Represents a data store' }
  ],
  containers: [
    { type: 'pool', label: 'Pool', icon: Icons.PoolIcon, description: 'Contains a process' },
    { type: 'lane', label: 'Lane', icon: Icons.LaneIcon, description: 'Organizes activities' }
  ]
};

export default function BpmnToolbar() {
  const [draggedNode, setDraggedNode] = React.useState<string | null>(null);

  const handleDragStart = (type: string, e: React.DragEvent) => {
    setDraggedNode(type);
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

  return (
    <TooltipProvider delayDuration={0}>
      <div className="fixed left-6 top-1/2 -translate-y-1/2 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex flex-col gap-2 z-[var(--z-interactive)] max-h-[80vh] overflow-y-auto bg-white/85 dark:bg-gray-800/85">
        {Object.entries(toolbarGroups).map(([groupName, elements], groupIndex) => (
          <div key={groupName} className={`flex flex-col gap-1.5 ${groupIndex > 0 ? 'border-t border-gray-200 dark:border-gray-700 pt-2' : ''}`}>
            {elements.map(({ type, label, icon: Icon, description }) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <button
                    draggable
                    onDragStart={(e) => handleDragStart(type, e)}
                    onDragEnd={handleDragEnd}
                    className="w-9 h-9 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 transition-all rounded-lg text-gray-900 dark:text-gray-300"
                  >
                    <Icon 
                      className="w-full h-full text-gray-900 dark:text-gray-300" 
                      style={{ 
                        stroke: 'currentColor',
                        strokeWidth: type.includes('Event') ? 1.5 : 2,
                        fill: type.includes('Event') ? 'currentColor' : 'none'
                      }} 
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10} className="rounded-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-2 text-xs shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="max-w-[160px]">
                    <div className="font-medium text-gray-700 dark:text-gray-300">{label}</div>
                    <div className="text-gray-500 dark:text-gray-400">{description}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
