'use client';

import { useEffect, useState } from 'react';
import { useReactFlow, type Node, useKeyPress, KeyCode } from 'reactflow';
import { Button } from 'components/ui/button';
import { 
  Maximize2, 
  Minimize2, 
  Download, 
  FileDown, 
  ZoomIn,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Command,
  Search
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { BpmnXmlConverter } from '@/lib/bpmnXmlConverter';
import type BPMN from '@/lib/types/bpmn-types';

interface NodeDefault {
  label: string;
  width: number;
  height: number;
  description: string;
}

const nodeDefaults: Record<string, NodeDefault> = {
  startEvent: { label: 'Start Event', width: 36, height: 36, description: 'Indicates where a process begins' },
  endEvent: { label: 'End Event', width: 36, height: 36, description: 'Indicates where a process ends' },
  intermediateThrowEvent: { label: 'Intermediate Throw Event', width: 36, height: 36, description: 'Throws an intermediate event during process execution' },
  intermediateCatchEvent: { label: 'Intermediate Catch Event', width: 36, height: 36, description: 'Catches an intermediate event during process execution' },
  timerEvent: { label: 'Timer Event', width: 36, height: 36, description: 'Triggers based on a specific time or cycle' },
  messageEvent: { label: 'Message Event', width: 36, height: 36, description: 'Sends or receives messages between processes' },
  signalEvent: { label: 'Signal Event', width: 36, height: 36, description: 'Broadcasts or catches signals across processes' },
  task: { label: 'Task', width: 100, height: 80, description: 'Represents an atomic activity within a process' },
  userTask: { label: 'User Task', width: 100, height: 80, description: 'A task performed by a human' },
  serviceTask: { label: 'Service Task', width: 100, height: 80, description: 'A task performed by a system' },
  scriptTask: { label: 'Script Task', width: 100, height: 80, description: 'A task executed by a business rule engine' },
  businessRuleTask: { label: 'Business Rule Task', width: 100, height: 80, description: 'A task that executes business rules' },
  exclusiveGateway: { label: 'Exclusive Gateway', width: 50, height: 50, description: 'Routes the sequence flow based on conditions' },
  parallelGateway: { label: 'Parallel Gateway', width: 50, height: 50, description: 'Creates parallel sequence flows' },
  inclusiveGateway: { label: 'Inclusive Gateway', width: 50, height: 50, description: 'Routes based on conditions, allows multiple paths' },
  eventBasedGateway: { label: 'Event Based Gateway', width: 50, height: 50, description: 'Routes based on events' },
  dataObject: { label: 'Data Object', width: 36, height: 50, description: 'Represents information flowing through the process' },
  dataStore: { label: 'Data Store', width: 50, height: 50, description: 'Represents a place where the process can read or write data' },
  pool: { label: 'Pool', width: 600, height: 200, description: 'Contains a process and represents a participant' },
  lane: { label: 'Lane', width: 600, height: 100, description: 'Subdivides a pool and organizes activities' },
};

export default function BpmnControls() {
  const { 
    nodes, 
    setNodes,
    showGrid,
    snapToGrid,
    setShowGrid,
    setSnapToGrid 
  } = useStore();
  const { fitView, getNodes, setCenter, project } = useReactFlow();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const xmlConverter = new BpmnXmlConverter();

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setShowCommandPalette(true);
      } else if (event.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExportBpmn = async () => {
    try {
      // Convert nodes to BPMN process
      const process: BPMN.Process = {
        id: 'Process_1',
        $type: 'bpmn:Process',
        isExecutable: true,
        flowElements: nodes.map(node => ({
          id: node.id,
          $type: `bpmn:${node.type}` as BPMN.FlowElement['$type'],
          name: node.data.label,
          documentation: [],
        }))
      };

      // Convert to XML
      const xml = await xmlConverter.toXML(process);
      downloadFile(xml, 'diagram.bpmn', 'application/xml');
    } catch (error) {
      console.error('Failed to export BPMN:', error);
    }
  };

  const handleExportSvg = () => {
    const svgContent = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      ${nodes.map(node => 
        `<rect x="${node.position.x}" y="${node.position.y}" width="100" height="80" fill="#fff" stroke="#000"/>
         <text x="${node.position.x + 10}" y="${node.position.y + 20}">${node.data?.label || ''}</text>`
      ).join('\n')}
    </svg>`;
    downloadFile(svgContent, 'diagram.svg', 'image/svg+xml');
  };

  const handleFitToView = () => fitView({ duration: 300, padding: 0.2 });
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    setTimeout(handleFitToView, 10);
  };

  const handleAlignHorizontal = () => {
    const selectedNodes = getNodes().filter(node => node.selected);
    if (selectedNodes.length < 2) return;

    const avgY = selectedNodes.reduce((sum, node) => sum + node.position.y, 0) / selectedNodes.length;
    const updatedNodes = nodes.map(node => {
      if (node.selected) {
        return {
          ...node,
          position: {
            ...node.position,
            y: avgY
          }
        };
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  const handleAlignVertical = () => {
    const selectedNodes = getNodes().filter(node => node.selected);
    if (selectedNodes.length < 2) return;

    const avgX = selectedNodes.reduce((sum, node) => sum + node.position.x, 0) / selectedNodes.length;
    const updatedNodes = nodes.map(node => {
      if (node.selected) {
        return {
          ...node,
          position: {
            ...node.position,
            x: avgX
          }
        };
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  const handleDistributeHorizontal = () => {
    const selectedNodes = getNodes().filter(node => node.selected).sort((a, b) => a.position.x - b.position.x);
    if (selectedNodes.length < 3) return;

    const start = selectedNodes[0].position.x;
    const end = selectedNodes[selectedNodes.length - 1].position.x;
    const step = (end - start) / (selectedNodes.length - 1);

    const updatedNodes = nodes.map(node => {
      if (node.selected) {
        const index = selectedNodes.findIndex(n => n.id === node.id);
        return {
          ...node,
          position: {
            ...node.position,
            x: start + step * index
          }
        };
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  const handleDistributeVertical = () => {
    const selectedNodes = getNodes().filter(node => node.selected).sort((a, b) => a.position.y - b.position.y);
    if (selectedNodes.length < 3) return;

    const start = selectedNodes[0].position.y;
    const end = selectedNodes[selectedNodes.length - 1].position.y;
    const step = (end - start) / (selectedNodes.length - 1);

    const updatedNodes = nodes.map(node => {
      if (node.selected) {
        const index = selectedNodes.findIndex(n => n.id === node.id);
        return {
          ...node,
          position: {
            ...node.position,
            y: start + step * index
          }
        };
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  function downloadFile(data: string, filename: string, type: string) {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <>
      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[20vh] z-[1000]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[600px] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search commands..."
                  className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">ESC</kbd>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {Object.entries(nodeDefaults)
                .filter(([key, value]: [string, NodeDefault]) => 
                  value.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  value.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(([key, value]) => (
                  <button
                    key={key}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3"
                    onClick={() => {
                      const position = project({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
                      const newNode = {
                        id: `${key}-${nodes.length + 1}`,
                        type: key,
                        position,
                        data: { label: value.label }
                      };
                      setNodes([...nodes, newNode]);
                      setShowCommandPalette(false);
                    }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      {/* Add icons based on node type */}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{value.label}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{value.description}</div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className={`${isExpanded ? 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[51]' : 'absolute bottom-4 left-1/2 transform -translate-x-1/2'} flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1`}>
        <div className="flex items-center gap-1">
          {/* View Controls */}
          <Button onClick={handleFitToView} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" title="Fit to View">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button onClick={handleExpand} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" title="Toggle Expand">
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Grid Controls */}
          <Button 
            onClick={() => setShowGrid(!showGrid)} 
            className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${showGrid ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
            title="Toggle Grid"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => setSnapToGrid(!snapToGrid)} 
            className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${snapToGrid ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
            title="Toggle Snap to Grid"
          >
            <Command className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Alignment Controls */}
          <Button onClick={handleAlignVertical} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" title="Align Vertical">
            <AlignJustify className="h-4 w-4 rotate-90" />
          </Button>
          <Button onClick={handleAlignHorizontal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" title="Align Horizontal">
            <AlignJustify className="h-4 w-4" />
          </Button>
          <Button onClick={handleDistributeVertical} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" title="Distribute Vertical">
            <AlignCenter className="h-4 w-4 rotate-90" />
          </Button>
          <Button onClick={handleDistributeHorizontal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" title="Distribute Horizontal">
            <AlignCenter className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Export Controls */}
          <Button onClick={handleExportSvg} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" title="Export as SVG">
            <Download className="h-4 w-4" />
          </Button>
          <Button onClick={handleExportBpmn} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" title="Export as BPMN">
            <FileDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
