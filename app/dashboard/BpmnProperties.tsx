import { useCallback, useEffect, useRef, useState } from 'react';
import { Panel, useReactFlow, useViewport } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import type { PropertiesPanelState, BpmnNode, BpmnNodeData } from '@/lib/store';
import { X } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

const SHOW_DELAY = 0; // Show panel immediately

export function BpmnProperties() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { getNode } = useReactFlow();
  const viewport = useViewport();
  const [dragPosition, setDragPosition] = useState<Position | null>(null);
  const {
    nodes,
    selected,
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

    // Calculate position relative to node with viewport transform
    const nodeX = node.position.x + (node.width || 0) + 20;
    const nodeY = node.position.y;
    
    // Convert to screen coordinates
    const screenX = nodeX * viewport.zoom + viewport.x;
    const screenY = nodeY * viewport.zoom + viewport.y;
    
    return {
      x: screenX,
      y: screenY
    };
  }, [selectedNode, viewport, getNode]);

  // Handle selection changes
  useEffect(() => {
    if (!selectedNode) {
      setPanelPosition(null);
      return;
    }

    // Don't show panel during any drag operations
    const isDragging = propertiesPanel.isDragging || dragPosition || propertiesPanel.nodeDragging;
    if (isDragging) {
      setPanelPosition(null);
      return;
    }

    // Show panel immediately
    const newPosition = calculatePosition();
    if (newPosition) {
      setPanelPosition(newPosition);
    }
  }, [selectedNode, calculatePosition, setPanelPosition, propertiesPanel.isDragging, propertiesPanel.nodeDragging, dragPosition, getNode]);

  // Update position on viewport changes
  useEffect(() => {
    if (!selectedNode || propertiesPanel.isDragging || propertiesPanel.nodeDragging || dragPosition || !propertiesPanel.position) return;
    
    const rafId = requestAnimationFrame(() => {
      const newPosition = calculatePosition();
      if (newPosition) {
        setPanelPosition(newPosition);
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [viewport.zoom, viewport.x, viewport.y, calculatePosition, setPanelPosition, selectedNode, propertiesPanel.isDragging, propertiesPanel.nodeDragging, dragPosition, propertiesPanel.position]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selected.length > 0) {
        setSelected([]);
        setPanelPosition(null);
        setDragPosition(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selected, setSelected, setPanelPosition]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(e.target as Element) &&
        selected.length > 0 &&
        !propertiesPanel.isDragging &&
        !propertiesPanel.nodeDragging
      ) {
        setSelected([]);
        setPanelPosition(null);
        setDragPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selected, propertiesPanel.isDragging, propertiesPanel.nodeDragging, setSelected, setPanelPosition]);

  // Update handler
  const updateNodeData = useCallback(
    (data: Partial<BpmnNodeData>) => {
      if (!selectedNode) return;
      useStore.getState().updateNodeData(selectedNode.id, data);
    },
    [selectedNode]
  );

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected([]);
    setPanelPosition(null);
    setDragPosition(null);
  }, [setSelected, setPanelPosition]);

  // Convert node type to display name
  const displayName = selectedNode?.type
    ? selectedNode.type
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Node';

  // Use drag position if available, otherwise use store position
  const position = dragPosition || propertiesPanel.position || { x: 0, y: 0 };

  if (!selectedNode) return null;

  return (
    <Panel position="top-left" style={{ left: 0, top: 0 }}>
      <AnimatePresence>
        {selectedNode && propertiesPanel.position && (
          <motion.div
            ref={panelRef}
            style={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              cursor: 'move',
              touchAction: 'none',
              zIndex: 'var(--z-interactive)'
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
                setPanelPosition(newPosition);
                e.preventDefault();
              };
              
              const handlePointerUp = (e: PointerEvent) => {
                const finalPosition = {
                  x: e.clientX - startX,
                  y: e.clientY - startY
                };
                setPanelPosition(finalPosition);
                setPanelDragging(false);
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
            <Card className="w-[300px] shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur border border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {displayName} Properties
                </CardTitle>
                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors no-drag"
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </CardHeader>
              <CardContent>
                <Tabs.Root
                  defaultValue="general"
                  value={propertiesPanel.activeTab}
                  onValueChange={(value: string) => setPanelTab(value as PropertiesPanelState['activeTab'])}
                >
                  <Tabs.List className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 mb-4 px-1">
                    <Tabs.Trigger
                      value="general"
                      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition-colors no-drag"
                    >
                      General
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="advanced"
                      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition-colors no-drag"
                    >
                      Advanced
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="documentation"
                      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition-colors no-drag"
                    >
                      Docs
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="general" className="space-y-4">
                    {/* Common Properties */}
                    <div className="space-y-2">
                      <Label htmlFor="label" className="text-sm font-medium text-gray-700 dark:text-gray-300">Label</Label>
                      <div className="no-drag">
                        <Input
                          id="label"
                          value={selectedNode.data.label || ''}
                          onChange={(e) => updateNodeData({ label: e.target.value })}
                          placeholder="Enter label"
                          className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Event Properties */}
                    {selectedNode.type?.toLowerCase().includes('event') && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Configuration</Label>
                        <div className="no-drag space-y-2">
                          {selectedNode.type === 'timerEvent' && (
                            <>
                              <Label htmlFor="timerType">Timer Type</Label>
                              <select
                                id="timerType"
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={selectedNode.data.timerType || 'date'}
                                onChange={(e) => updateNodeData({ timerType: e.target.value as BpmnNodeData['timerType'] })}
                              >
                                <option value="date">Date</option>
                                <option value="duration">Duration</option>
                                <option value="cycle">Cycle</option>
                              </select>
                              <Input
                                value={selectedNode.data.timerExpression || ''}
                                onChange={(e) => updateNodeData({ timerExpression: e.target.value })}
                                placeholder="Timer Expression"
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                              />
                            </>
                          )}
                          {selectedNode.type === 'messageEvent' && (
                            <>
                              <Input
                                value={selectedNode.data.messageName || ''}
                                onChange={(e) => updateNodeData({ messageName: e.target.value })}
                                placeholder="Message Name"
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <Input
                                value={selectedNode.data.correlationKey || ''}
                                onChange={(e) => updateNodeData({ correlationKey: e.target.value })}
                                placeholder="Correlation Key"
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Task Properties */}
                    {selectedNode.type?.toLowerCase().includes('task') && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Task Configuration</Label>
                        <div className="no-drag space-y-2">
                          <Input
                            value={selectedNode.data.description || ''}
                            onChange={(e) => updateNodeData({ description: e.target.value })}
                            placeholder="Description"
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {selectedNode.type === 'userTask' && (
                            <>
                              <Input
                                value={selectedNode.data.assignee || ''}
                                onChange={(e) => updateNodeData({ assignee: e.target.value })}
                                placeholder="Assignee"
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <Input
                                value={selectedNode.data.dueDate || ''}
                                onChange={(e) => updateNodeData({ dueDate: e.target.value })}
                                placeholder="Due Date"
                                type="date"
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <select
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={selectedNode.data.priority || 'medium'}
                                onChange={(e) => updateNodeData({ priority: e.target.value as BpmnNodeData['priority'] })}
                              >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                              </select>
                            </>
                          )}
                          {selectedNode.type === 'serviceTask' && (
                            <>
                              <Input
                                value={selectedNode.data.implementation || ''}
                                onChange={(e) => updateNodeData({ implementation: e.target.value })}
                                placeholder="Implementation"
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <Input
                                value={selectedNode.data.operation || ''}
                                onChange={(e) => updateNodeData({ operation: e.target.value })}
                                placeholder="Operation"
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </>
                          )}
                          {selectedNode.type === 'scriptTask' && (
                            <>
                              <select
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={selectedNode.data.scriptFormat || 'javascript'}
                                onChange={(e) => updateNodeData({ scriptFormat: e.target.value })}
                              >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="groovy">Groovy</option>
                              </select>
                              <textarea
                                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                value={selectedNode.data.scriptContent || ''}
                                onChange={(e) => updateNodeData({ scriptContent: e.target.value })}
                                placeholder="Script Content"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Gateway Properties */}
                    {selectedNode.type?.toLowerCase().includes('gateway') && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gateway Configuration</Label>
                        <div className="no-drag space-y-2">
                          <Input
                            value={selectedNode.data.condition || ''}
                            onChange={(e) => updateNodeData({ condition: e.target.value })}
                            placeholder="Condition Expression"
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <select
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={selectedNode.data.gatewayDirection || 'diverging'}
                            onChange={(e) => updateNodeData({ gatewayDirection: e.target.value as BpmnNodeData['gatewayDirection'] })}
                          >
                            <option value="diverging">Diverging</option>
                            <option value="converging">Converging</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Data Object/Store Properties */}
                    {(selectedNode.type === 'dataObject' || selectedNode.type === 'dataStore') && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Configuration</Label>
                        <div className="no-drag space-y-2">
                          <Input
                            value={selectedNode.data.dataStructure || ''}
                            onChange={(e) => updateNodeData({ dataStructure: e.target.value })}
                            placeholder="Data Structure"
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <textarea
                            className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                            value={selectedNode.data.dataSchema || ''}
                            onChange={(e) => updateNodeData({ dataSchema: e.target.value })}
                            placeholder="Data Schema"
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
                          className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                          value={selectedNode.data.documentation || ''}
                          onChange={(e) => updateNodeData({ documentation: e.target.value })}
                          placeholder="Add documentation..."
                        />
                      </div>
                    </div>
                  </Tabs.Content>
                </Tabs.Root>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
}
