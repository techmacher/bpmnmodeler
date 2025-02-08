// bpmnXmlConverter.ts
import { createCustomBpmnModdle } from './customBpmnModdle';
import type BPMN from '../types/bpmn-types';

export class BpmnXmlConverter {
  public moddle: ReturnType<typeof createCustomBpmnModdle>;

  constructor() {
    this.moddle = createCustomBpmnModdle();
  }

  async toXML30(process: BPMN.Process): Promise<string> {
    try {
      // Create a lookup map for BPMN.FlowNode objects by node ID
      const flowNodeMap = new Map<string, BPMN.FlowNode>();
      process.flowElements.forEach(element => {
        if (element.$type !== 'bpmn:SequenceFlow') {
          flowNodeMap.set(element.id, element as BPMN.FlowNode);
        }
      });
  
      // Convert each flowElement into a BPMN-moddle element
      const convertedFlowElements = process.flowElements.map(element => {
        // Handle sequence flows separately to ensure proper references
        if (element.$type === 'bpmn:SequenceFlow') {
          const sequenceFlow = element as BPMN.SequenceFlow;
          return this.moddle.create('bpmn:SequenceFlow', {
            id: sequenceFlow.id,
            sourceRef: flowNodeMap.get(sequenceFlow.sourceRef.id),
            targetRef: flowNodeMap.get(sequenceFlow.targetRef.id)
          });
        }
  
      // For other elements, create them normally
      const { $type, documentation, ...rest } = element;
        return this.moddle.create($type, {
          ...rest,
          documentation: documentation?.map(doc => ({
            $type: 'bpmn:Documentation',
            text: doc
          }))
        });
      });
  
      // Create the definitions element including the process and diagram
      const definitions = this.moddle.create('bpmn:Definitions', {
        targetNamespace: 'http://bpmn.io/schema/bpmn',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:bpmn': 'http://www.omg.org/spec/BPMN/20100524/MODEL',
        'xmlns:bpmndi': 'http://www.omg.org/spec/BPMN/20100524/DI',
        'xmlns:dc': 'http://www.omg.org/spec/DD/20100524/DC',
        'xmlns:di': 'http://www.omg.org/spec/DD/20100524/DI',
        'xmlns:bioc': 'http://bpmn.io/schema/bpmn/biocolor/1.0',
        id: `Definitions_${Date.now()}`,
        rootElements: [
          this.moddle.create('bpmn:Process', {
            id: process.id,
            isExecutable: process.isExecutable,
            flowElements: convertedFlowElements
          })
        ],
        diagrams: process.di ? [process.di] : []
      });
  
      const { xml } = await this.moddle.toXML(definitions);
      return xml;
    } catch (error) {
      throw new Error(`Failed to convert BPMN to XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  /* async toXML20(process: BPMN.Process): Promise<string> {
    try {
      // Convert each flowElement into a BPMN-moddle element.
      const convertedFlowElements = process.flowElements.map(element => {
        // Destructure to separate $type from the rest of the properties.
        const { $type, ...rest } = element;
        // Create the BPMN element using the proper type.
        return this.moddle.create($type, rest);
      });

      // Build the process data without an explicit $type property.
      const processData = {
        id: process.id,
        isExecutable: process.isExecutable,
        flowElements: convertedFlowElements,
      };

      // Create a BPMN Process element using moddle.create.
      const bpmnProcess = this.moddle.create('bpmn:Process', processData);

      // Create BPMNShape and BPMNEdge elements for DI.
      const BPMNShape = process.flowElements
        .filter(element => element.$type !== 'bpmn:SequenceFlow')
        .map(element => {
          //calculate bounds based on sh
          const bounds = element.bounds
          return this.moddle.create('bpmndi:BPMNShape', {
            id: `BPMNShape_${element.id}`,
            bpmnElement: element.id,
            Bounds: this.moddle.create('dc:Bounds', bounds),
          });
        });

      const BPMNEdge = process.flowElements
        .filter(element => element.$type === 'bpmn:SequenceFlow')
        .map(element => {
          const waypoints = element.waypoints || [];
          return this.moddle.create('bpmndi:BPMNEdge', {
            id: `BPMNEdge_${element.id}`,
            bpmnElement: element.id,
            waypoint: waypoints.map((point, index) =>
              this.moddle.create('dc:Point', { ...point, id: `waypoint_${element.id}_${index}` })
            ),
          });
        });

      // Create the BPMNPlane element.
      const BPMNPlane = this.moddle.create('bpmndi:BPMNPlane', {
        id: `BPMNPlane_${process.id}`,
        bpmnElement: process.id,
        BPMNShape,
        BPMNEdge,
      });

      // Create the BPMNDiagram element.
      const BPMNDiagram = this.moddle.create('bpmndi:BPMNDiagram', {
        id: `BPMNDiagram_${process.id}`,
        BPMNPlane,
      });

      // Create the Definitions element with proper namespaces and attach the process.
      const definitions = this.moddle.create('bpmn:Definitions', {
        targetNamespace: 'http://bpmn.io/schema/bpmn',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:bpmn': 'http://www.omg.org/spec/BPMN/20100524/MODEL',
        'xmlns:bpmndi': 'http://www.omg.org/spec/BPMN/20100524/DI',
        'xmlns:dc': 'http://www.omg.org/spec/DD/20100524/DC',
        'xmlns:di': 'http://www.omg.org/spec/DD/20100524/DI',
        id: `Definitions_${Date.now()}`,
        rootElements: [bpmnProcess],
      });

      // Convert the Definitions object to XML.
      const { xml } = await this.moddle.toXML(definitions);
      return xml;
    } catch (error) {
      throw new Error(`Failed to convert BPMN to XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } */


  /* async toXML(process: BPMN.Process): Promise<string> {
    try {
      // --- Convert flowElements (nodes and connectors) into BPMN-moddle elements ---
      const convertedFlowElements = process.flowElements.map(element => {
        const { $type, ...rest } = element;
        return this.moddle.create($type, rest);
      });

      // Build process data (include DI if available)
      const processData: any = { 
        id: process.id,
        isExecutable: process.isExecutable,
        flowElements: convertedFlowElements,
      };

      if (process.di) { 
        processData.di = process.di; 
      }

      // Create the BPMN Process element.
      const bpmnProcess = this.moddle.create('bpmn:Process', processData);

      // --- Create BPMN DI elements if not provided ---
      if (!process.di) {
        const BPMNShapes = convertedFlowElements
          .filter((element: any) => element.$type !== 'bpmn:SequenceFlow')
          .map((element: any) => {
            const boundsData = element.bounds || { x: 100, y: 100, width: 100, height: 80 };
            const bounds = this.moddle.create('dc:Bounds', boundsData);
            return this.moddle.create('bpmndi:BPMNShape', {
              id: `BPMNShape_${element.id}`,
              bpmnElement: element,
              Bounds: bounds,
            });
          });

        const BPMNEdges = convertedFlowElements
          .filter((element: any) => element.$type === 'bpmn:SequenceFlow')
          .map((element: any) => {
            const waypointsData = element.waypoints || [
              { x: 150, y: 150 },
              { x: 300, y: 300 }
            ];
            const waypoints = waypointsData.map((point: { x: number; y: number; }) =>
              this.moddle.create('dc:Point', point)
            );
            return this.moddle.create('bpmndi:BPMNEdge', {
              id: `BPMNEdge_${element.id}`,
              bpmnElement: element,
              waypoint: waypoints,
            });
          });

        // Create the BPMNPlane with shapes and edges
        const bpmnPlane = this.moddle.create('bpmndi:BPMNPlane', {
          id: 'BPMNPlane_1',
          bpmnElement: bpmnProcess,
          BPMNShape: BPMNShapes,
          BPMNEdge: BPMNEdges,
        });

        // Create the BPMNDiagram, wrapping the plane in an array.
        const bpmnDiagram = this.moddle.create('bpmndi:BPMNDiagram', {
          id: 'BPMNDiagram_1',
          BPMNPlane: bpmnPlane,
        });

        // Add the generated diagram to the process
        bpmnProcess.di = bpmnDiagram; 
      }

      // Create the Definitions element including the process and diagram.
      const definitions = this.moddle.create('bpmn:Definitions', {
        targetNamespace: 'http://bpmn.io/schema/bpmn',
        id: `Definitions_${Date.now()}`,
        rootElements: [bpmnProcess],
        diagrams: process.di ? [process.di] : [], // Include diagrams if they exist
      });

      const { xml } = await this.moddle.toXML(definitions);
      return xml;

    } catch (error) {
      throw new Error(
        `Failed to convert BPMN to XML: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  } */

  async fromXML(xml: string): Promise<BPMN.Process> {
    try {
      const { rootElement: definitions } = await this.moddle.fromXML(xml);
      const process = definitions.rootElements.find(
        (element: any) => element.$type === 'bpmn:Process'
      );
      if (!process) {
        throw new Error('No BPMN process found in XML');
      }
      return this.convertProcess(process);
    } catch (error) {
      throw new Error(
        `Failed to parse BPMN XML: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private convertProcess(moddleProcess: any): BPMN.Process {
    const process: BPMN.Process = {
      id: moddleProcess.id,
      $type: 'bpmn:Process',
      name: moddleProcess.name,
      isExecutable: moddleProcess.isExecutable,
      flowElements: [],
    };

    if (moddleProcess.flowElements) {
      process.flowElements = moddleProcess.flowElements.map((element: any) =>
        this.convertElement(element)
      );
    }
    return process;
  }

  private convertElement(moddleElement: any): BPMN.FlowElement {
    const baseElement = {
      id: moddleElement.id,
      $type: moddleElement.$type,
      name: moddleElement.name,
      documentation: moddleElement.documentation?.map((doc: any) => doc.text),
    };

    const flowNodeBase = {
      ...baseElement,
      incoming: (moddleElement.incoming || []).map((ref: any) => this.convertElement(ref)) as BPMN.SequenceFlow[],
      outgoing: (moddleElement.outgoing || []).map((ref: any) => this.convertElement(ref)) as BPMN.SequenceFlow[],
    };

    switch (moddleElement.$type) {
      case 'bpmn:StartEvent':
        return {
          ...flowNodeBase,
          $type: 'bpmn:StartEvent',
          eventDefinitions: moddleElement.eventDefinitions || [],
        } as BPMN.StartEvent;
      // Handle other element types similarly...
      default:
        return baseElement as BPMN.FlowElement;
    }
  }
}
