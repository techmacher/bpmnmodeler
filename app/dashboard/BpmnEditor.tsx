import { useCallback, useRef, DragEvent, useState } from 'react';
import * as Icons from './BpmnIcons';
import ReactFlow, { 
  Controls,
  Background,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowInstance,
  Panel,
  BackgroundVariant,
  MarkerType,
  Viewport,
  ViewportHelperFunctions
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '@/lib/store';
import { nodeTypes } from './BpmnNodeTypes';
import { BpmnProperties } from './BpmnProperties';

// BPMN 2.0 specification nodes
const nodeDefaults = {
  // Events
  startEvent: { label: 'Start Event', width: 36, height: 36, description: 'Indicates where a process begins' },
  endEvent: { label: 'End Event', width: 36, height: 36, description: 'Indicates where a process ends' },
  intermediateThrowEvent: { label: 'Intermediate Throw Event', width: 36, height: 36, description: 'Throws an intermediate event during process execution' },
  intermediateCatchEvent: { label: 'Intermediate Catch Event', width: 36, height: 36, description: 'Catches an intermediate event during process execution' },
  timerEvent: { label: 'Timer Event', width: 36, height: 36, description: 'Triggers based on a specific time or cycle' },
  messageEvent: { label: 'Message Event', width: 36, height: 36, description: 'Sends or receives messages between processes' },
  signalEvent: { label: 'Signal Event', width: 36, height: 36, description: 'Broadcasts or catches signals across processes' },
  
  // Activities
  task: { label: 'Task', width: 100, height: 80, description: 'Represents an atomic activity within a process' },
  userTask: { label: 'User Task', width: 100, height: 80, description: 'A task performed by a human' },
  serviceTask: { label: 'Service Task', width: 100, height: 80, description: 'A task performed by a system' },
  scriptTask: { label: 'Script Task', width: 100, height: 80, description: 'A task executed by a business rule engine' },
  businessRuleTask: { label: 'Business Rule Task', width: 100, height: 80, description: 'A task that executes business rules' },
  
  // Gateways
  exclusiveGateway: { label: 'Exclusive Gateway', width: 50, height: 50, description: 'Routes the sequence flow based on conditions' },
  parallelGateway: { label: 'Parallel Gateway', width: 50, height: 50, description: 'Creates parallel sequence flows' },
  inclusiveGateway: { label: 'Inclusive Gateway', width: 50, height: 50, description: 'Routes based on conditions, allows multiple paths' },
  eventBasedGateway: { label: 'Event Based Gateway', width: 50, height: 50, description: 'Routes based on events' },
  
  // Data
  dataObject: { label: 'Data Object', width: 36, height: 50, description: 'Represents information flowing through the process' },
  dataStore: { label: 'Data Store', width: 50, height: 50, description: 'Represents a place where the process can read or write data' },
  
  // Swimlanes
  pool: { label: 'Pool', width: 600, height: 200, description: 'Contains a process and represents a participant' },
  lane: { label: 'Lane', width: 600, height: 100, description: 'Subdivides a pool and organizes activities' },
  
  // Artifacts
  group: { label: 'Group', width: 200, height: 200, description: 'Visual grouping of elements' },
  textAnnotation: { label: 'Text Annotation', width: 100, height: 30, description: 'Adds additional text information' }
};

// Edge types for BPMN sequence flows
const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: '#666', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#666',
  },
};

export default function BpmnEditor() {
  const { nodes, edges, setNodes, setEdges, setSelected } = useStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [zoom, setZoom] = useState(100);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      // Handle selection changes
      const selectionChange = changes.find(change => change.type === 'select');
      if (selectionChange && 'selected' in selectionChange) {
        setSelected(selectionChange.selected ? [selectionChange.id] : []);
      }
      setNodes(applyNodeChanges(changes, nodes));
    },
    [nodes, setNodes, setSelected]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges(applyEdgeChanges(changes, edges)),
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges(addEdge({ ...connection, ...defaultEdgeOptions }, edges)),
    [edges, setEdges]
  );

  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: keyof typeof nodeDefaults) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow') as keyof typeof nodeDefaults;
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { label: nodeDefaults[type].label },
      };

      setNodes([...nodes, newNode]);
    },
    [reactFlowInstance, nodes, setNodes]
  );

  const handleZoomIn = useCallback(() => {
    reactFlowInstance?.zoomIn();
  }, [reactFlowInstance]);

  const handleZoomOut = useCallback(() => {
    reactFlowInstance?.zoomOut();
  }, [reactFlowInstance]);

  const handleFitView = useCallback(() => {
    reactFlowInstance?.fitView();
  }, [reactFlowInstance]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top toolbar with BPMN elements */}
      <div className="border-b border-gray-200 p-2 bg-white">
        <div className="flex items-center space-x-4 overflow-x-auto px-4">
          {/* Events */}
          <div className="flex items-center space-x-2 border-r pr-4">
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'startEvent')}
            >
              <Icons.StartEventIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Start Event</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.startEvent.description}
              </div>
            </div>
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'endEvent')}
            >
              <Icons.EndEventIcon className="w-8 h-8" />
              <span className="text-xs mt-1">End Event</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.endEvent.description}
              </div>
            </div>
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'intermediateThrowEvent')}
            >
              <Icons.IntermediateThrowEventIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Throw Event</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.intermediateThrowEvent.description}
              </div>
            </div>
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'intermediateCatchEvent')}
            >
              <Icons.IntermediateCatchEventIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Catch Event</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.intermediateCatchEvent.description}
              </div>
            </div>
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'timerEvent')}
            >
              <Icons.TimerEventIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Timer</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.timerEvent.description}
              </div>
            </div>
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'messageEvent')}
            >
              <Icons.MessageEventIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Message</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.messageEvent.description}
              </div>
            </div>
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'signalEvent')}
            >
              <Icons.SignalEventIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Signal</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.signalEvent.description}
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="flex items-center space-x-2 border-r pr-4">
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'task')}
            >
              <Icons.TaskIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Task</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.task.description}
              </div>
            </div>
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'userTask')}
            >
              <Icons.UserTaskIcon className="w-8 h-8" />
              <span className="text-xs mt-1">User Task</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.userTask.description}
              </div>
            </div>
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'serviceTask')}
            >
              <Icons.ServiceTaskIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Service Task</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.serviceTask.description}
              </div>
            </div>
          </div>

          {/* Gateways */}
          <div className="flex items-center space-x-2 border-r pr-4">
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'exclusiveGateway')}
            >
              <Icons.ExclusiveGatewayIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Gateway</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.exclusiveGateway.description}
              </div>
            </div>
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'parallelGateway')}
            >
              <Icons.ParallelGatewayIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Parallel</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.parallelGateway.description}
              </div>
            </div>
          </div>

          {/* Data & Organization */}
          <div className="flex items-center space-x-2">
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'dataObject')}
            >
              <Icons.DataObjectIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Data</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.dataObject.description}
              </div>
            </div>
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'pool')}
            >
              <Icons.PoolIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Pool</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.pool.description}
              </div>
            </div>
            <div
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded cursor-move group relative"
              draggable
              onDragStart={(e) => onDragStart(e, 'lane')}
            >
              <Icons.LaneIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Lane</span>
              <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
                {nodeDefaults.lane.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main editor area */}
      <div ref={reactFlowWrapper} className="flex-1 relative" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          style={{ width: '100%', height: '100%' }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onInit={(instance: ReactFlowInstance) => {
            setReactFlowInstance(instance);
            setZoom(Math.round(instance.getViewport().zoom * 100));
          }}
          onMove={() => {
            if (reactFlowInstance) {
              const { zoom } = reactFlowInstance.getViewport();
              setZoom(Math.round(zoom * 100));
            }
          }}
          fitView
        >
          <Background
            variant={BackgroundVariant.Lines}
            gap={12}
            size={1}
            color="#e5e7eb"
            style={{ backgroundColor: '#ffffff' }}
          />
          <Controls
            showInteractive={true}
            className="bg-white border border-gray-200 shadow-sm"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '8px',
              borderRadius: '8px',
            }}
          />
          <MiniMap
            className="bg-white border border-gray-200 shadow-sm"
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
            }}
            nodeColor={(node) => {
              switch (node.type) {
                case 'startEvent':
                  return '#52bd52';
                case 'endEvent':
                  return '#ff4d4d';
                case 'intermediateThrowEvent':
                case 'intermediateCatchEvent':
                case 'timerEvent':
                case 'messageEvent':
                case 'signalEvent':
                  return '#888';
                case 'task':
                case 'userTask':
                case 'serviceTask':
                  return '#fff';
                case 'exclusiveGateway':
                case 'parallelGateway':
                  return '#fff';
                default:
                  return '#eee';
              }
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          <Panel position="top-center" className="bg-white/75 px-2 py-1 rounded text-sm">
            Double-click to add a node • Drag between nodes to connect
          </Panel>
        </ReactFlow>
      </div>

      {/* Bottom controls */}
      <div className="border-t border-gray-200 p-2 bg-white">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => useStore.getState().undo()}
              className="p-2 hover:bg-gray-100 rounded text-gray-700"
              title="Undo"
            >
              <Icons.UndoIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => useStore.getState().redo()}
              className="p-2 hover:bg-gray-100 rounded text-gray-700"
              title="Redo"
            >
              <Icons.RedoIcon className="w-5 h-5" />
            </button>
            <div className="h-4 w-px bg-gray-300 mx-2" />
            <button 
              className="p-2 hover:bg-gray-100 rounded text-gray-700"
              title="Load Saved Diagram"
            >
              <Icons.LoadIcon className="w-5 h-5" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded text-gray-700"
              title="Save Diagram"
            >
              <Icons.SaveIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded text-gray-700"
              title="Zoom Out"
            >
              <Icons.ZoomOutIcon className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-700">{zoom}%</span>
            <button 
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded text-gray-700"
              title="Zoom In"
            >
              <Icons.ZoomInIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={handleFitView}
              className="p-2 hover:bg-gray-100 rounded text-gray-700"
              title="Fit View"
            >
              <Icons.FitViewIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
