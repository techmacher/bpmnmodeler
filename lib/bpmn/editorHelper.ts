import { Node } from 'reactflow';
import BPMN from '../types/bpmn-types';
import { nodeDefaults, nodeTypeMapping } from '@/app/dashboard/BpmnNodeTypes';

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




// helper to compute endpoint coordinates from an edge
interface Point {
  x: number;
  y: number;
}

/**
 * Given a node and a handle type (e.g. "top", "bottom", "left", "right", "center"),
 * compute the coordinate for that handle using the nodeDefaults.
 */
function getHandleCoordinates(node: Node, handle?: string): Point {
  // Use nodeDefaults for width/height of the node type.
  const defaults = node.type ? nodeDefaults[node.type] : undefined;
  const width = node.width != null ? node.width : (defaults ? defaults.width : 150);
  const height = node.height != null ? node.height : (defaults ? defaults.height : 100);
  const { x, y } = node.position;

  switch (handle) {
    case 'top':
      return { x: x + width / 2, y: y };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x: x, y: y + height / 2 };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    default:
      // Defaults to center.
      return { x: x + width / 2, y: y + height / 2 };
  }
}

/**
 * Given an edge and the full list of nodes, return the computed source and target coordinates.
 * The edge object is assumed to have:
 *  - source (string, node id)
 *  - target (string, node id)
 *  - sourceHandle (optional string, e.g. "top", "bottom", "left", "right")
 *  - targetHandle (optional string, e.g. "top", "bottom", "left", "right")
 */
export function getEdgeCoordinates(
  edge: { source: string; target: string; sourceHandle: string; targetHandle: string },
  nodes: Array<Node>
): { sourceX: number; sourceY: number; targetX: number; targetY: number } | null {
  // Find the corresponding nodes by id.
  const sourceNode = nodes.find((node) => node.id === edge.source);
  const targetNode = nodes.find((node) => node.id === edge.target);

  if (!sourceNode || !targetNode) {
    console.warn(`Edge ${edge.source} -> ${edge.target} cannot be computed because one of the nodes is missing.`);
    return null;
  }

  const sourceCoords = getHandleCoordinates(sourceNode, edge.sourceHandle);
  const targetCoords = getHandleCoordinates(targetNode, edge.targetHandle);

  return {
    sourceX: sourceCoords.x,
    sourceY: sourceCoords.y,
    targetX: targetCoords.x,
    targetY: targetCoords.y,
  };
}



export function createProcessData(
  adjustedNodes: NodeData[],
  adjustedEdges: EdgeData[]
): BPMN.Process {
  // Build the FlowElements from nodes.
  const flowElements: BPMN.FlowNode[] = adjustedNodes.map(node => {
    const mappedType = nodeTypeMapping[node.type];
    if (!mappedType) {
      throw new Error(`No BPMN mapping found for node type: ${node.type}`);
    }
    return {
      id: node.id,
      $type: `bpmn:${mappedType}`,
      name: node.data.label,
      documentation: [],
      incoming: [],
      outgoing: [],
    } as BPMN.FlowNode;
  });

  // Create the Process object.
  const process: BPMN.Process = {
    id: 'Process_1',
    $type: 'bpmn:Process',
    isExecutable: true,
    flowElements,
    di: undefined, // temporarily undefined – will add DI after process is built.
  };

  // Map nodes to BPMNShapes.
  const BPMNShape: BPMN.BPMNShape[] = adjustedNodes.map(node => ({
    $type: 'bpmndi:BPMNShape',
    id: `BPMNShape_${node.id}`,
    bpmnElement: flowElements.find(el => el.id === node.id) as BPMN.FlowNode,
    Bounds: {
      id: `BPMNShape_${node.id}_bounds`,
      $type: 'dc:Bounds',
      x: node.position.x,
      y: node.position.y,
      width: node.width ?? (nodeDefaults[node.type]?.width ?? 150),
      height: node.height ?? (nodeDefaults[node.type]?.height ?? 100),
    },
  }));

  BPMNShape.forEach(shape => {
    // Remove any documentation or extension elements from the shape if present.
    delete (shape as any).documentation;
  });
  // Map edges to BPMNEdges.
  const BPMNEdge: BPMN.BPMNEdge[] = adjustedEdges.map(edge => ({
    $type: 'bpmndi:BPMNEdge',
    id: `BPMNEdge_${edge.id}`,
    // Create a basic SequenceFlow object for demonstration purposes.
    bpmnElement: {
      id: edge.id,
      $type: 'bpmn:SequenceFlow',
      // Optionally include additional SequenceFlow properties if needed.
      sourceRef: { id: edge.source, $type: 'bpmn:FlowNode' } as BPMN.FlowNode,
      targetRef: { id: edge.target, $type: 'bpmn:FlowNode' } as BPMN.FlowNode,
    } as BPMN.SequenceFlow,
    waypoint: [
      { id: `BPMNEdge_${edge.id}_waypoint0`, $type: 'dc:Point', x: edge.sourceX, y: edge.sourceY },
      { id: `BPMNEdge_${edge.id}_waypoint1`, $type: 'dc:Point', x: edge.targetX, y: edge.targetY },
    ],
  }));

  // Finally, assign the DI information to the process.
  process.di = {
    id: 'BPMNDiagram_1',
    $type: 'bpmndi:BPMNDiagram',
    BPMNPlane: {
      id: 'BPMNPlane_1',
      $type: 'bpmndi:BPMNPlane',
      // Pass the process itself instead of string id.
      bpmnElement: process,
      BPMNShape,
      BPMNEdge,
    },
  } as BPMN.BPMNDiagram;

  return process;
}

  export function downloadFile(data: string, filename: string, type: string) {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }