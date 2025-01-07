'use client';

import { useEffect, useRef, useState } from 'react';
import Modeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import { Chat } from 'components/chat';
import BpmnControls from './BpmnControls';
import { Button } from 'components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ChatSidebar } from 'components/chat-sidebar';

export default function DashboardPage() {
  const diagramContainerRef = useRef<HTMLDivElement | null>(null);
  const modelerRef = useRef<Modeler | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(true);

  useEffect(() => {
    const initializeBpmn = async () => {
      if (!diagramContainerRef.current) return;

      try {
        const container = diagramContainerRef.current;
        modelerRef.current = new Modeler({
          container,
          width: '100%',
          height: '100%'
        });

        const diagramXML = 
`<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js" exporterVersion="12.0.0">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="150" y="100" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

        await modelerRef.current.importXML(diagramXML);
        const canvas = modelerRef.current.get('canvas') as { zoom: (type: string) => void };
        canvas.zoom('fit-viewport');
      } catch (err) {
        console.error("Error creating diagram:", err);
        if (err instanceof Error) {
          console.error('Error details:', err.message);
          console.error('Error stack:', err.stack);
        }
      }
    };

    initializeBpmn();

    return () => {
      modelerRef.current?.destroy();
    };
  }, []);

  return (
    <main className="flex h-screen bg-gray-100">
      <ChatSidebar />
      
      <section className="flex-1 flex flex-col">
        <div className="flex-1 flex relative">
          <div className={`flex flex-col transition-all duration-300 ${isChatOpen ? 'w-2/3' : 'w-full'}`}>
            <div className="absolute inset-0 flex flex-col bg-white rounded-lg m-4 shadow-sm">
              <div className="flex-1" ref={diagramContainerRef} style={{ 
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div className="bjs-container flex-1" style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }} />
              </div>
              <BpmnControls modelerRef={modelerRef} />
            </div>
          </div>

          <div className={`relative transition-all duration-300 ${isChatOpen ? 'w-1/3' : 'w-0'}`}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-sm border border-gray-200"
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              {isChatOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <div className="absolute inset-0 m-4 ml-2 bg-white rounded-lg shadow-sm overflow-hidden">
              <Chat modelerRef={modelerRef} initialMessages={[
                { id: '1', role: 'assistant', content: 'Welcome to BPMN Modeler AI! I can help you create and modify BPMN diagrams. Try asking me to:\n\n- Create a new process\n- Add tasks or events\n- Connect elements with flows\n- Modify existing elements' },
              ]} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
