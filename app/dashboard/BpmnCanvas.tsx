import { useEffect, useRef } from 'react';
// @ts-ignore
const BpmnJS = require('bpmn-js/dist/bpmn-modeler.production.min.js');

export default function BpmnCanvas({ xml }: { xml: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bpmnViewerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize viewer
    bpmnViewerRef.current = new BpmnJS({
      container: containerRef.current,
      keyboard: { bindTo: document }
    });

    // Load initial diagram
    bpmnViewerRef.current.importXML(xml).catch((err: Error) => {
      console.error('Error rendering BPMN diagram:', err);
    });

    return () => {
      bpmnViewerRef.current?.destroy();
    };
  }, []);

  // Update diagram when XML changes
  useEffect(() => {
    if (xml && bpmnViewerRef.current) {
      bpmnViewerRef.current.importXML(xml).catch((err: Error) => {
        console.error('Error updating BPMN diagram:', err);
      });
    }
  }, [xml]);

  return <div ref={containerRef} className="h-full w-full" />;
}
