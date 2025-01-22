import { useCallback, useRef, useState, useEffect } from 'react';
import { BpmnProperties } from './BpmnProperties';
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
  OnSelectionChangeParams,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '@/lib/store';
import { getNodeTypes, getEdgeTypes, getDefaultEdgeOptions } from './BpmnNodeConfig';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Map, Save, Download, Upload, Undo, Redo, Bot, Lock, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-full h-8 flex items-center justify-center hover:bg-white/50 dark:hover:bg-white/10 rounded transition-colors">
        <div className="h-4 w-4" />
      </button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="w-full h-8 flex items-center justify-center hover:bg-white/50 dark:hover:bg-white/10 rounded transition-colors"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="center">
        <p className="text-xs">Toggle Theme</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function BpmnCanvas() {
  const { nodes, edges, selected, setNodes, setEdges, setSelected, setNodeDragging, setPanelPosition, undo, redo } = useStore();
  const [dropTarget, setDropTarget] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [locked, setLocked] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if meta key (Cmd on Mac, Ctrl on Windows) is pressed
      const isMetaKey = e.metaKey || e.ctrlKey;
      
      if (isMetaKey && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

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
      <>
        <style>
          {`
            .react-flow__controls {
              background: transparent;
            }
            .react-flow__controls-button {
              background: rgba(255, 255, 255, 0.75);
              border: none !important;
              border-bottom: none !important;
            }
            .dark .react-flow__controls-button {
              background: rgba(31, 41, 55, 0.75);
            }
            .react-flow__controls-button:hover {
              background: rgba(255, 255, 255, 0.9);
            }
            .dark .react-flow__controls-button:hover {
              background: rgba(31, 41, 55, 0.9);
            }
            .react-flow__controls-button svg {
              fill: none;
              stroke: none;
            }
            .react-flow__controls {
              background: rgba(255, 255, 255, 0.5);
            }
            .dark .react-flow__controls {
              background: rgba(31, 41, 55, 0.5);
            }
            .react-flow__controls-button svg path,
            .react-flow__controls-button svg rect,
            .react-flow__controls-button svg circle {
              fill: #FFFFFF;
            }
            .dark .react-flow__controls-button svg path,
            .dark .react-flow__controls-button svg rect,
            .dark .react-flow__controls-button svg circle {
              fill: #D1D5DB;
            }
          `}
        </style>
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
        onSelectionChange={useCallback(({ nodes: selectedNodes }: OnSelectionChangeParams) => {
          const selectedIds = selectedNodes?.map((node: Node) => node.id) || [];
          setNodeDragging(false);
          setSelected(selectedIds);
          
          // Calculate initial panel position with viewport transform
          if (selectedNodes?.length > 0 && reactFlowInstance) {
            const node = selectedNodes[0];
            const nodeWidth = typeof node.width === 'number' ? node.width : 150; // Default width for BPMN nodes
            const nodeX = node.position.x + nodeWidth + 20;
            const nodeY = node.position.y;
            
            // Convert to screen coordinates
            const screenX = nodeX * reactFlowInstance.getViewport().zoom + reactFlowInstance.getViewport().x;
            const screenY = nodeY * reactFlowInstance.getViewport().zoom + reactFlowInstance.getViewport().y;
            
            setPanelPosition({ x: screenX, y: screenY });
          } else {
            setPanelPosition(null);
          }
        }, [setSelected, setNodeDragging, setPanelPosition, reactFlowInstance])}
        onNodeDragStart={() => setNodeDragging(true)}
        onNodeDragStop={() => setNodeDragging(false)}
        onClick={useCallback((event: React.MouseEvent) => {
          setNodeDragging(false);
          // If clicking on a node, calculate panel position
          const target = event.target as HTMLElement;
          if (target.closest('.react-flow__node') && reactFlowInstance) {
            const node = nodes.find(n => selected.includes(n.id));
            if (node) {
              const nodeWidth = typeof node.width === 'number' ? node.width : 150; // Default width for BPMN nodes
              const nodeX = node.position.x + nodeWidth + 20;
              const nodeY = node.position.y;
              const screenX = nodeX * reactFlowInstance.getViewport().zoom + reactFlowInstance.getViewport().x;
              const screenY = nodeY * reactFlowInstance.getViewport().zoom + reactFlowInstance.getViewport().y;
              setPanelPosition({ x: screenX, y: screenY });
            }
          }
        }, [nodes, selected, reactFlowInstance, setNodeDragging, setPanelPosition])}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={20}
          size={1}
          color={mounted && theme === 'dark' ? '#333333' : '#e5e7eb'}
        />
        {/* Title */}
        <Panel position="top-left" className="left-4 top-4 flex items-center gap-2">
          <Bot className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          <span className="text-xl font-semibold text-gray-600 dark:text-gray-200">BPMN</span>
        </Panel>
        {/* Action buttons */}
        <Panel position="top-right" className="right-2 top-2 flex gap-1">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/50 hover:bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800/75"
                  onClick={undo}
                >
                  <Undo className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p className="text-xs">Undo (⌘Z)</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/50 hover:bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800/75"
                  onClick={redo}
                >
                  <Redo className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p className="text-xs">Redo (⌘⇧Z)</p>
              </TooltipContent>
            </Tooltip>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1 self-center" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/50 hover:bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800/75"
                  onClick={() => {/* TODO: Implement save */}}
                >
                  <Save className="h-4 w-4 text-gray-600 dark:text-gray-300" />
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
                  className="bg-white/50 hover:bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800/75"
                  onClick={() => {/* TODO: Implement export */}}
                >
                  <Download className="h-4 w-4 text-gray-600 dark:text-gray-300" />
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
                  className="bg-white/50 hover:bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800/75"
                  onClick={() => {/* TODO: Implement import */}}
                >
                  <Upload className="h-4 w-4 text-gray-600 dark:text-gray-300" />
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
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm flex flex-col gap-2 p-2">
            <Controls 
              showInteractive={false}
              className="!static !transform-none [&_button]:!bg-transparent dark:[&_button]:!bg-transparent [&_button]:!border-0 [&_button]:!shadow-none [&_button:hover]:!bg-black/5 dark:[&_button:hover]:!bg-white/5 [&_svg_path]:text-gray-600 dark:[&_svg_path]:text-gray-300 [&_svg_path]:stroke-current"
            />
            <div className="w-full h-px bg-gray-200/50 dark:bg-gray-700/50" />
            <div className="flex flex-col gap-2">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="w-full h-8 flex items-center justify-center hover:bg-white/50 dark:hover:bg-white/10 rounded transition-colors"
                      onClick={() => setLocked(!locked)}
                    >
                      <Lock className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    <p className="text-xs">Lock Canvas</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="w-full h-8 flex items-center justify-center hover:bg-white/50 dark:hover:bg-white/10 rounded transition-colors"
                      onClick={() => setShowMiniMap(!showMiniMap)}
                    >
                      <Map className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    <p className="text-xs">Toggle Minimap</p>
                  </TooltipContent>
                </Tooltip>
                <ThemeToggle />
              </TooltipProvider>
            </div>
          </div>
        </Panel>
        {/* MiniMap */}
        {showMiniMap && (
          <Panel position="bottom-right" className="right-[120px] bottom-2">
            <div className="bg-white/50 dark:bg-gray-800/50 p-1 rounded-lg shadow-sm">
              <MiniMap
                nodeColor={(node) => {
                  switch (node.type) {
                    case 'startEvent':
                      return '#52bd52';
                    case 'endEvent':
                      return '#ff4d4d';
                    default:
                      return mounted && theme === 'dark' ? '#333333' : '#ffffff';
                  }
                }}
              />
            </div>
          </Panel>
        )}
        {/* Properties Panel */}
        <BpmnProperties />
      </ReactFlow>
      </>
    </div>
  );
}
