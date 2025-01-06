'use client';

import { useEffect, useRef } from 'react';
import Modeler from 'bpmn-js/lib/Modeler';
import { Chat } from '../components/chat';
import BpmnControls from './BpmnControls';

export default function DashboardPage() {
  const diagramContainerRef = useRef<HTMLDivElement | null>(null);
  const modelerRef = useRef<Modeler | null>(null);

  useEffect(() => {
    if (!diagramContainerRef.current) return;

    modelerRef.current = new Modeler({
      container: diagramContainerRef.current,
    });
    
    const initialBpmn = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
      xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
      xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
      xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
      xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
      id="Definitions_1">
      <bpmn:process id="Process_1" isExecutable="false">
        <bpmn:startEvent id="StartEvent_1" />
      </bpmn:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
      </bpmndi:BPMNDiagram>
    </bpmn:definitions>
    `;

    modelerRef.current.importXML(initialBpmn).catch(err => {
      console.error("Error importing initial diagram:", err);
    });

    return () => {
      modelerRef.current?.destroy();
    };
  }, []);

  return (
    <main className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <h2 className="text-lg mb-4">BA Copilot</h2>
        <nav className="flex-1">
          <div className="mb-2">
            <a href="/" className="block p-2 hover:bg-gray-700 rounded">
              New chat
            </a>
          </div>
          <div className="mb-2">
            <a href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
              Diagrams
            </a>
          </div>
        </nav>
      </aside>

      <section className="flex-1 flex flex-col">
        <div className="flex flex-row flex-1">
          <div className="w-1/2 border-r border-gray-300 p-4 overflow-auto">
            <Chat modelerRef={modelerRef} />
          </div>

          <div className="w-1/2 relative" ref={diagramContainerRef}>
            <BpmnControls modelerRef={modelerRef} />
          </div>
        </div>
      </section>
    </main>
  );
}
