import { useCallback, useEffect, useRef, useState } from 'react';
import { Node as FlowNode, Panel, useReactFlow, useViewport } from 'reactflow';
import { nodeTypes } from './BpmnNodeTypes';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import type { PropertiesPanelState } from '@/lib/store';
import { X } from 'lucide-react';

type BpmnNode = FlowNode<{
  label?: string;
  description?: string;
  condition?: string;
}>;

interface Position {
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
}

export function BpmnProperties() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { getNode } = useReactFlow();
  const viewport = useViewport();
  const [dragPosition, setDragPosition] = useState<Position | null>(null);
  const {
    nodes,
    selected,
    setNodes,
    propertiesPanel,
    setPanelPosition,
    setPanelOffset,
    setPanelDragging,
    setPanelTab,
    setSelected
  } = useStore();

  // Get the first selected node
  const selectedNode = nodes.find((node) => selected.includes(node.id)) as BpmnNode | undefined;

  // Calculate panel position
  const calculatePosition = useCallback(() => {
    if (!selectedNode || !panelRef.current) return null;

    const node = getNode(selectedNode.id);
    if (!node) return null;

    // Calculate position relative to viewport
    const nodeX = (node.position.x + (node.width || 0)) * viewport.zoom + viewport.x;
    const nodeY = node.position.y * viewport.zoom + viewport.y;
    
    // Add default offset
    return {
      x: nodeX + propertiesPanel.offset.x,
      y: nodeY + propertiesPanel.offset.y
    };
  }, [selectedNode, viewport, getNode, propertiesPanel.offset]);

  // Update position when selection or viewport changes
  useEffect(() => {
    if (propertiesPanel.isDragging || !selectedNode) return;
    
    // Use RAF to avoid rapid updates during viewport changes
    const rafId = requestAnimationFrame(() => {
      const newPosition = calculatePosition();
      if (newPosition && JSON.stringify(newPosition) !== JSON.stringify(propertiesPanel.position)) {
        setPanelPosition(newPosition);
        setDragPosition(null);
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [selectedNode?.id, viewport.zoom, viewport.x, viewport.y, propertiesPanel.isDragging, propertiesPanel.offset]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selected.length > 0) {
        setSelected([]);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selected, setSelected]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(e.target as Element) &&
        selected.length > 0 &&
        !propertiesPanel.isDragging
      ) {
        setSelected([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selected, propertiesPanel.isDragging, setSelected]);

  // Update handlers
  const updateNodeLabel = useCallback(
    (newLabel: string) => {
      if (!selectedNode) return;
      const updatedNodes = nodes.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      );
      setNodes(updatedNodes);
    },
    [selectedNode, nodes, setNodes]
  );

  const updateNodeDescription = useCallback(
    (newDescription: string) => {
      if (!selectedNode) return;
      const updatedNodes = nodes.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, description: newDescription } }
          : node
      );
      setNodes(updatedNodes);
    },
    [selectedNode, nodes, setNodes]
  );

  const updateNodeCondition = useCallback(
    (newCondition: string) => {
      if (!selectedNode) return;
      const updatedNodes = nodes.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, condition: newCondition } }
          : node
      );
      setNodes(updatedNodes);
    },
    [selectedNode, nodes, setNodes]
  );

  if (!selectedNode) return null;

  // Use drag position if available, otherwise use store position
  const position = dragPosition || propertiesPanel.position || { x: 0, y: 0 };

  // Convert node type to display name
  const displayName = selectedNode.type
    ? selectedNode.type
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Node';

  return (
    <Panel position="top-left" style={{ left: 0, top: 0 }}>
      <AnimatePresence>
        <motion.div
          ref={panelRef}
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            cursor: 'move',
            touchAction: 'none'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.1 }}
          onPointerDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('.no-drag')) return; // Don't drag when clicking inputs etc.
            
            setPanelDragging(true);
            const rect = panelRef.current?.getBoundingClientRect();
            if (!rect) return;
            
            const startX = e.clientX - rect.left;
            const startY = e.clientY - rect.top;
            
            const handlePointerMove = (e: PointerEvent) => {
              const newPosition = {
                x: e.clientX - startX,
                y: e.clientY - startY
              };
              setDragPosition(newPosition);
              e.preventDefault();
            };
            
            const handlePointerUp = (e: PointerEvent) => {
              setPanelDragging(false);
              const finalPosition = {
                x: e.clientX - startX,
                y: e.clientY - startY
              };
              setPanelPosition(finalPosition);
              setDragPosition(null);
              window.removeEventListener('pointermove', handlePointerMove);
              window.removeEventListener('pointerup', handlePointerUp);
              e.preventDefault();
            };
            
            window.addEventListener('pointermove', handlePointerMove, { capture: true });
            window.addEventListener('pointerup', handlePointerUp, { capture: true });
            e.preventDefault();
          }}
        >
          <Card className="w-[300px] shadow-lg bg-white/90 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {displayName} Properties
              </CardTitle>
              <button
                onClick={() => setSelected([])}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors no-drag"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent>
              <Tabs.Root
                value={propertiesPanel.activeTab}
                onValueChange={(value: string) => setPanelTab(value as PropertiesPanelState['activeTab'])}
              >
                <Tabs.List className="flex space-x-2 border-b mb-4">
                  <Tabs.Trigger
                    value="general"
                    className="px-3 py-1.5 text-sm text-gray-600 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 no-drag"
                  >
                    General
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="advanced"
                    className="px-3 py-1.5 text-sm text-gray-600 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 no-drag"
                  >
                    Advanced
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="documentation"
                    className="px-3 py-1.5 text-sm text-gray-600 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 no-drag"
                  >
                    Docs
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="general" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">Label</Label>
                    <div className="no-drag">
                      <Input
                        id="label"
                        value={selectedNode.data.label || ''}
                        onChange={(e) => updateNodeLabel(e.target.value)}
                        placeholder="Enter label"
                      />
                    </div>
                  </div>

                  {selectedNode.type === 'task' && (
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <div className="no-drag">
                        <Input
                          id="description"
                          value={selectedNode.data.description || ''}
                          onChange={(e) => updateNodeDescription(e.target.value)}
                          placeholder="Enter task description"
                        />
                      </div>
                    </div>
                  )}

                  {selectedNode.type === 'gateway' && (
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <div className="no-drag">
                        <Input
                          id="condition"
                          value={selectedNode.data.condition || ''}
                          onChange={(e) => updateNodeCondition(e.target.value)}
                          placeholder="Enter gateway condition"
                        />
                      </div>
                    </div>
                  )}
                </Tabs.Content>

                <Tabs.Content value="advanced" className="space-y-4">
                  <Collapsible.Root>
                    <Collapsible.Trigger className="flex w-full items-center justify-between py-2 text-sm font-medium no-drag">
                      <span>Execution</span>
                      <span className="text-gray-400">▼</span>
                    </Collapsible.Trigger>
                    <Collapsible.Content className="space-y-2 pb-4">
                      {/* Advanced execution options will go here */}
                      <p className="text-sm text-gray-500">Coming soon</p>
                    </Collapsible.Content>
                  </Collapsible.Root>
                </Tabs.Content>

                <Tabs.Content value="documentation" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentation">Documentation</Label>
                    <div className="no-drag">
                      <textarea
                        id="documentation"
                        className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add documentation..."
                      />
                    </div>
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </Panel>
  );
}
