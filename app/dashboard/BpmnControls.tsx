'use client';

import React from 'react';
import Modeler from 'bpmn-js/lib/Modeler';
interface BpmnControlsProps {
  modelerRef: React.MutableRefObject<Modeler | null>;
}

interface ModelerWithContainer extends Modeler {
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

  const handleSetSize = (size: 'small' | 'medium' | 'large') => {
    const modeler = modelerRef.current as ModelerWithContainer;
    if (!modeler?._container) return;
    modeler._container.style.width = size === 'small' ? '400px' 
      : size === 'medium' ? '600px' 
      : '800px';
    modeler._container.style.height = size === 'small' ? '300px' 
      : size === 'medium' ? '500px' 
      : '700px';
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
    <div className="absolute bottom-2 right-2 p-2 bg-white shadow-md flex space-x-2">
      <button onClick={handleExportSvg} className="bg-blue-500 text-white px-3 py-1">
        Download as image
      </button>
      <button onClick={handleExportBpmn} className="bg-blue-500 text-white px-3 py-1">
        Export as .bpmn
      </button>
      <button onClick={handleFitToView} className="bg-blue-500 text-white px-3 py-1">
        Fit to view
      </button>
      <button onClick={() => handleSetSize('small')} className="bg-gray-200 px-2 py-1">
        Small
      </button>
      <button onClick={() => handleSetSize('medium')} className="bg-gray-200 px-2 py-1">
        Medium
      </button>
      <button onClick={() => handleSetSize('large')} className="bg-gray-200 px-2 py-1">
        Large
      </button>
    </div>
  );
}
