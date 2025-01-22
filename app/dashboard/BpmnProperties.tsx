import { useCallback } from 'react';
import { Node } from 'reactflow';
import { nodeTypes } from './BpmnNodeTypes';

type BpmnNode = Node<{
  label?: string;
  description?: string;
  condition?: string;
}>;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';

export function BpmnProperties() {
  const nodes = useStore((state) => state.nodes);
  const selected = useStore((state) => state.selected);
  const setNodes = useStore((state) => state.setNodes);

  // Get the first selected node
  const selectedNode = nodes.find((node) => selected.includes(node.id)) as BpmnNode | undefined;

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

  if (!selectedNode) {
    return (
      <Card className="w-[300px] h-full">
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a node to view its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  // Convert node type to display name (e.g., "startEvent" -> "Start Event")
  const displayName = selectedNode.type
    ? selectedNode.type
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Node';

  return (
    <Card className="w-[300px] h-full">
      <CardHeader>
        <CardTitle>{displayName} Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={selectedNode.data.label || ''}
            onChange={(e) => updateNodeLabel(e.target.value)}
            placeholder="Enter label"
          />
        </div>

        {selectedNode.type === 'task' && (
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={selectedNode.data.description || ''}
              onChange={(e) => {
                const updatedNodes = nodes.map((node) =>
                  node.id === selectedNode.id
                    ? {
                        ...node,
                        data: { ...node.data, description: e.target.value },
                      }
                    : node
                );
                setNodes(updatedNodes);
              }}
              placeholder="Enter task description"
            />
          </div>
        )}

        {selectedNode.type === 'gateway' && (
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Input
              id="condition"
              value={selectedNode.data.condition || ''}
              onChange={(e) => {
                const updatedNodes = nodes.map((node) =>
                  node.id === selectedNode.id
                    ? {
                        ...node,
                        data: { ...node.data, condition: e.target.value },
                      }
                    : node
                );
                setNodes(updatedNodes);
              }}
              placeholder="Enter gateway condition"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
