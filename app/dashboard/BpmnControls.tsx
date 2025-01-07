'use client';

import React, { useState } from 'react';
import type NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import { Button } from 'components/ui/button';
import { Maximize2, Minimize2, Download, FileDown, ZoomIn } from 'lucide-react';

interface BpmnControlsProps {
  modelerRef: React.MutableRefObject<NavigatedViewer | null>;
}

interface ViewerWithContainer extends NavigatedViewer {
  _container?: HTMLElement;
  get: (service: string) => any;
}

export default function BpmnControls({ modelerRef }: BpmnControlsProps) {
  const handleExportBpmn = async () => {
    if (!modelerRef.current) return;
    const { xml } = await modelerRef.current.saveXML({ format: true });
    if (xml) {
      downloadFile(xml, 'diagram.bpmn', 'application/xml');
    }
  };

  const handleExportSvg = async () => {
    if (!modelerRef.current) return;
    const { svg } = await modelerRef.current.saveSVG();
    if (svg) {
      downloadFile(svg, 'diagram.svg', 'image/svg+xml');
    }
  };

  const handleFitToView = () => {
    if (!modelerRef.current) return;
    const canvas = modelerRef.current.get('canvas') as any;
    if (canvas && typeof canvas.zoom === 'function') {
      canvas.zoom('fit-viewport');
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    const modeler = modelerRef.current as ViewerWithContainer;
    if (!modeler?._container) return;

    const container = modeler._container;
    const parent = container.parentElement;
    if (!parent) return;

    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Create a full-screen white background
      const overlay = document.createElement('div');
      overlay.id = 'bpmn-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.backgroundColor = 'white';
      overlay.style.zIndex = '49';
      document.body.appendChild(overlay);

      // Position the modeler on top of the overlay
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.zIndex = '50';
      container.style.backgroundColor = 'white';

      // Add minimize button
      const minimizeBtn = document.createElement('button');
      minimizeBtn.id = 'bpmn-minimize';
      minimizeBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14h16M4 10h16" />
        </svg>
      `;
      minimizeBtn.style.position = 'fixed';
      minimizeBtn.style.top = '1rem';
      minimizeBtn.style.right = '1rem';
      minimizeBtn.style.zIndex = '51';
      minimizeBtn.style.padding = '0.5rem';
      minimizeBtn.style.backgroundColor = 'white';
      minimizeBtn.style.border = '1px solid #e5e7eb';
      minimizeBtn.style.borderRadius = '0.5rem';
      minimizeBtn.style.cursor = 'pointer';
      minimizeBtn.style.transition = 'all 0.2s';
      minimizeBtn.onmouseover = () => {
        minimizeBtn.style.backgroundColor = '#f3f4f6';
      };
      minimizeBtn.onmouseout = () => {
        minimizeBtn.style.backgroundColor = 'white';
      };
      minimizeBtn.onclick = handleExpand;
      document.body.appendChild(minimizeBtn);
    } else {
      // Remove the overlay and minimize button
      const overlay = document.getElementById('bpmn-overlay');
      const minimizeBtn = document.getElementById('bpmn-minimize');
      overlay?.remove();
      minimizeBtn?.remove();

      // Reset the modeler position
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.right = '0';
      container.style.bottom = '0';
      container.style.width = 'auto';
      container.style.height = 'auto';
      container.style.zIndex = 'auto';
    }
    handleFitToView();
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
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleFitToView} 
          className="text-gray-600 hover:text-gray-900"
          title="Fit to view"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleExpand}
          className="text-gray-600 hover:text-gray-900"
          title={isExpanded ? "Minimize" : "Maximize"}
        >
          {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <div className="h-6 w-px bg-gray-200 mx-1"></div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleExportSvg} 
          className="text-gray-600 hover:text-gray-900"
          title="Export as SVG"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleExportBpmn} 
          className="text-gray-600 hover:text-gray-900"
          title="Export as BPMN"
        >
          <FileDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
