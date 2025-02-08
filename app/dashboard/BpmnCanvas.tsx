import { useCallback, useRef, useState, useEffect } from 'react';
import { BpmnProperties } from './BpmnProperties';
import {createProcessData, downloadFile, getEdgeCoordinates} from '@/lib/bpmn/editorHelper';
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
  EdgeChange,
  OnEdgeUpdateFunc,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '@/lib/store';
import { getNodeTypes, getEdgeTypes, getDefaultEdgeOptions } from './BpmnNodeConfig';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Map, Save, Download, Upload, Undo, Redo, Workflow, Lock, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { BpmnXmlConverter } from '@/lib/bpmn/bpmnXmlConverter';
import type BPMN from '@/lib/types/bpmn-types';
import { nodeTypeMapping } from './BpmnNodeTypes';
import { any } from 'zod';

interface NodeData {
  id: string;
  type: string;
  data: {
    label: string;
  };
  position: {
    x: number;
    y: number;
  };
  width?: number;
  height?: number;
}

interface EdgeData {
  id: string;
  source: string; // ID of the source node
  target: string; // ID of the target node
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

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
  const { nodes, edges, selected, setNodes, setEdges: setEdgesStore, setSelected, setNodeDragging, setPanelPosition, undo, redo } = useStore();
  
  // Wrapper for setEdges that accepts a function
  const setEdges = useCallback((updater: Edge[] | ((edges: Edge[]) => Edge[])) => {
    if (typeof updater === 'function') {
      setEdgesStore(updater(edges));
    } else {
      setEdgesStore(updater);
    }
  }, [edges, setEdgesStore]);
  const [dropTarget, setDropTarget] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [locked, setLocked] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const xmlConverter = new BpmnXmlConverter();

  const handleExportBpmn40 = async () => {
    try {
      // 1. Create flow nodes first (without sequence flows)
      const flowNodes: BPMN.FlowNode[] = nodes.map(node => ({
        id: node.id,
        $type: `bpmn:${nodeTypeMapping[node.type ?? 'default']}`,
        name: node.data.label,
        documentation: Array.isArray(node.data.documentation) 
          ? node.data.documentation.map(doc => doc.text)
          : [],
        incoming: [],
        outgoing: [],
        ...(node.data.eventType ? { eventType: node.data.eventType } : {}),
        ...(node.data.timerType ? { timerType: node.data.timerType } : {}),
        ...(node.data.timerExpression ? { timerExpression: node.data.timerExpression } : {}),
        ...(node.data.gatewayDirection ? { gatewayDirection: node.data.gatewayDirection } : {})
      }));
  
      // Create lookup map
      const flowNodeMap = new globalThis.Map(flowNodes.map(node => [node.id, node]));
  
      // 2. Create sequence flows with references
      const sequenceFlows: BPMN.SequenceFlow[] = edges.map(edge => {
        const sourceNode = flowNodeMap.get(edge.source);
        const targetNode = flowNodeMap.get(edge.target);
        
        if (!sourceNode || !targetNode) {
          throw new Error(`Source or target node not found for edge ${edge.id}`);
        }
  
        const sequenceFlow: BPMN.SequenceFlow = {
          id: edge.id,
          $type: 'bpmn:SequenceFlow',
          sourceRef: sourceNode,
          targetRef: targetNode
        };
  
        // Update incoming/outgoing references
        sourceNode.outgoing.push(sequenceFlow);
        targetNode.incoming.push(sequenceFlow);
  
        return sequenceFlow;
      });
  
      // 3. Create DI elements using moddle
      const diShapes = nodes.map(node => {
        return xmlConverter.moddle.create('bpmndi:BPMNShape', {
          id: `Shape_${node.id}`,
          bpmnElement: flowNodeMap.get(node.id),
          bounds: xmlConverter.moddle.create('dc:Bounds', {
            x: node.position.x,
            y: node.position.y,
            width: node.width ?? 100,
            height: node.height ?? 80
          })
        });
      });
  
      const diEdges = edges.map(edge => {
        // Get source and target nodes
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
      
        if (!sourceNode || !targetNode) {
          throw new Error(`Source or target node not found for edge ${edge.id}`);
        }
      
        // Calculate edge coordinates using getEdgeCoordinates helper
        const coords = getEdgeCoordinates(
          {
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle ?? 'center',
            targetHandle: edge.targetHandle ?? 'center'
          },
          nodes
        );
      
        if (!coords) {
          throw new Error(`Could not compute coordinates for edge ${edge.id}`);
        }
      
        return xmlConverter.moddle.create('bpmndi:BPMNEdge', {
          id: `Edge_${edge.id}`,
          bpmnElement: sequenceFlows.find(flow => flow.id === edge.id),
          waypoint: [
            xmlConverter.moddle.create('dc:Point', { 
              x: coords.sourceX, 
              y: coords.sourceY 
            }),
            xmlConverter.moddle.create('dc:Point', { 
              x: coords.targetX, 
              y: coords.targetY 
            })
          ]
        });
      });
  
      // 4. Create process with all elements
      const process = {
        id: 'Process_1',
        $type: 'bpmn:Process',
        isExecutable: true,
        flowElements: [...flowNodes, ...sequenceFlows],
        di: xmlConverter.moddle.create('bpmndi:BPMNDiagram', {})
      };
  
      // 5. Create diagram using moddle
      const bpmnPlane = xmlConverter.moddle.create('bpmndi:BPMNPlane', {
        id: 'BPMNPlane_1',
        bpmnElement: process,
        planeElement: [...diShapes, ...diEdges]
      });
  
      const bpmnDiagram = xmlConverter.moddle.create('bpmndi:BPMNDiagram', {
        id: 'BPMNDiagram_1',
        plane: bpmnPlane
      });
  
      process.di = bpmnDiagram;
  
      // Convert to XML and download
      const xml = await xmlConverter.toXML30(process as BPMN.Process);
      downloadFile(xml, 'diagram.bpmn', 'application/xml');
    } catch (error) {
      console.error('Failed to export BPMN:', error);
    }
  }
 
  const handleExportSvg = () => {
    const svgContent = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      ${nodes.map(node => 
        `<rect x="${node.position.x}" y="${node.position.y}" width="100" height="80" fill="#fff" stroke="#000"/>
         <text x="${node.position.x + 10}" y="${node.position.y + 20}">${node.data?.label || ''}</text>`
      ).join('\n')}
    </svg>`;
    downloadFile(svgContent, 'diagram.svg', 'image/svg+xml');
  };
  

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
        onEdgeUpdate={(oldEdge: Edge, newConnection: Connection) => {
          // Delete the old edge and create a new one
          setEdges((els: Edge[]) => {
            const remainingEdges = els.filter((e: Edge) => e.id !== oldEdge.id);
            const newEdge: Edge = {
              ...oldEdge,
              source: newConnection.source || oldEdge.source,
              target: newConnection.target || oldEdge.target,
              sourceHandle: newConnection.sourceHandle,
              targetHandle: newConnection.targetHandle,
            };
            return [...remainingEdges, newEdge];
          });
        }}
        onEdgeUpdateStart={() => {
          // Add a class to handles to increase their z-index during edge update
          document.body.classList.add('updating-edge');
        }}
        onEdgeUpdateEnd={() => {
          document.body.classList.remove('updating-edge');
        }}
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
          className="!z-[var(--z-background)]"
          style={{
            backgroundColor: mounted && theme === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.9)'
          }}
        />
        {/* Title */}
        <Panel position="top-left" className="left-4 top-4 flex items-center gap-2 !z-[var(--z-interactive)]">
          <Workflow className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          <span className="text-xl font-semibold text-gray-600 dark:text-gray-200">Machers Workflow Studio</span>
        </Panel>
        {/* Action buttons */}
        <Panel position="top-right" className="right-2 top-2 flex gap-1 !z-[var(--z-interactive)]">
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
                  onClick={handleExportBpmn40}
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
        <Panel position="bottom-right" className="right-2 bottom-2 !z-[var(--z-interactive)]">
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
          <Panel position="bottom-right" className="right-[120px] bottom-2 !z-[var(--z-interactive)]">
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
