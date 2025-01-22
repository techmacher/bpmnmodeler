'use client';

import React from 'react';
import { useReactFlow, type Node } from 'reactflow';
import { Button } from 'components/ui/button';
import { Maximize2, Minimize2, Download, FileDown, ZoomIn } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function BpmnControls() {
  const { nodes } = useStore();
  const { fitView } = useReactFlow();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleExportBpmn = () => {
    const diagramXml = `<?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">
        ${nodes.map(node => `<bpmn:${node.type} id="${node.id}" />`).join('\n')}
      </bpmn:definitions>`;
    downloadFile(diagramXml, 'diagram.bpmn', 'application/xml');
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
    <div className={`${isExpanded ? 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[51]' : 'absolute bottom-4 left-1/2 transform -translate-x-1/2'} flex items-center bg-white rounded-lg shadow-lg border border-gray-200 p-1`}>
      <div className="flex items-center gap-1">
        <Button onClick={handleFitToView} className="p-2 hover:bg-gray-100 text-gray-600">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button onClick={handleExpand} className="p-2 hover:bg-gray-100 text-gray-600">
          {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <div className="h-6 w-px bg-gray-200 mx-1"></div>
        <Button onClick={handleExportSvg} className="p-2 hover:bg-gray-100 text-gray-600">
          <Download className="h-4 w-4" />
        </Button>
        <Button onClick={handleExportBpmn} className="p-2 hover:bg-gray-100 text-gray-600">
          <FileDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
