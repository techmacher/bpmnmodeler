import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowInstance,
  Node,
  Edge,
  Connection,
  addEdge,
  Panel,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '@/lib/store';
import { getNodeTypes, getEdgeTypes, getDefaultEdgeOptions } from './BpmnNodeConfig';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Map, Save, Download, Upload, Undo, Redo, Bot, Lock } from 'lucide-react';

export default function BpmnCanvas() {
  const { nodes, edges, setNodes, setEdges } = useStore();
  const [dropTarget, setDropTarget] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [locked, setLocked] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Get frozen node and edge types from singleton
  const nodeTypes = getNodeTypes();
  const edgeTypes = getEdgeTypes();
  const defaultEdgeOptions = getDefaultEdgeOptions();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes(applyNodeChanges(changes, nodes)),
    [nodes, setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges(applyEdgeChanges(changes, edges)),
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = addEdge(params, edges);
      setEdges(newEdge);
    },
    [edges, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDropTarget(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDropTarget(false);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDropTarget(false);

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowInstance || !reactFlowBounds) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { label: type },
      };

      setNodes([...nodes, newNode]);
    },
    [reactFlowInstance, nodes, setNodes]
  );

  return (
    <div 
      ref={reactFlowWrapper} 
      className={`h-full w-full transition-colors ${dropTarget ? 'bg-blue-50' : ''}`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={20}
          size={1}
          color="#e5e7eb"
        />
        {/* Title */}
        <Panel position="top-left" className="left-4 top-4 flex items-center gap-2">
          <Bot className="h-6 w-6" />
          <span className="text-xl font-semibold">BPMN</span>
        </Panel>
        {/* Action buttons */}
        <Panel position="top-right" className="right-2 top-2 flex gap-1">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/75 hover:bg-white/90 shadow-sm"
                  onClick={() => {/* TODO: Implement undo */}}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p className="text-xs">Undo</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/75 hover:bg-white/90 shadow-sm"
                  onClick={() => {/* TODO: Implement redo */}}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p className="text-xs">Redo</p>
              </TooltipContent>
            </Tooltip>
            <div className="w-px h-4 bg-gray-200 mx-1 self-center" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/75 hover:bg-white/90 shadow-sm"
                  onClick={() => {/* TODO: Implement save */}}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p className="text-xs">Save</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/75 hover:bg-white/90 shadow-sm"
                  onClick={() => {/* TODO: Implement export */}}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p className="text-xs">Export</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/75 hover:bg-white/90 shadow-sm"
                  onClick={() => {/* TODO: Implement import */}}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p className="text-xs">Import</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Panel>
        {/* Canvas controls group */}
        <Panel position="bottom-right" className="right-2 bottom-2">
          <div className="bg-white/75 rounded-md shadow-sm flex flex-col gap-2 p-2">
            <Controls 
              showInteractive={false}
              className="!static !transform-none"
            />
            <div className="w-full h-px bg-gray-200" />
            <div className="flex flex-col gap-2">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="w-full h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setLocked(!locked)}
                    >
                      <Lock className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    <p className="text-xs">Lock Canvas</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="w-full h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setShowMiniMap(!showMiniMap)}
                    >
                      <Map className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    <p className="text-xs">Toggle Minimap</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </Panel>
        {/* MiniMap */}
        {showMiniMap && (
          <Panel position="bottom-right" className="right-[120px] bottom-2">
            <div className="bg-white/75 p-1 rounded shadow-sm">
              <MiniMap
                nodeColor={(node) => {
                  switch (node.type) {
                    case 'startEvent':
                      return '#52bd52';
                    case 'endEvent':
                      return '#ff4d4d';
                    default:
                      return '#fff';
                  }
                }}
              />
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
