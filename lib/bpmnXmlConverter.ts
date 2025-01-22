import BpmnModdle from 'bpmn-moddle';
import type BPMN from './types/bpmn-types';

export class BpmnXmlConverter {
  private moddle: BpmnModdle;

  constructor() {
    this.moddle = new BpmnModdle();
  }

  async toXML(process: BPMN.Process): Promise<string> {
    try {
      const definitions = this.moddle.create('bpmn:Definitions', {
        targetNamespace: 'http://bpmn.io/schema/bpmn',
        id: `Definitions_${Date.now()}`,
        process: [process]
      });

      const { xml } = await this.moddle.toXML(definitions);
      return xml;
    } catch (error) {
      throw new Error(`Failed to convert BPMN to XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async fromXML(xml: string): Promise<BPMN.Process> {
    try {
      const { rootElement: definitions } = await this.moddle.fromXML(xml);
      
      // BPMN definitions can contain multiple processes, we'll take the first one
      const process = definitions.rootElements.find(
        (element: any) => element.$type === 'bpmn:Process'
      );

      if (!process) {
        throw new Error('No BPMN process found in XML');
      }

      // Convert moddle objects to our BPMN types
      return this.convertProcess(process);
    } catch (error) {
      throw new Error(`Failed to parse BPMN XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private convertProcess(moddleProcess: any): BPMN.Process {
    const process: BPMN.Process = {
      id: moddleProcess.id,
      $type: 'bpmn:Process',
      name: moddleProcess.name,
      isExecutable: moddleProcess.isExecutable,
      flowElements: []
    };

    // Convert flow elements
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
      documentation: moddleElement.documentation?.map((doc: any) => doc.text)
    };

    const flowNodeBase = {
      ...baseElement,
      incoming: (moddleElement.incoming || []).map((ref: any) => this.convertElement(ref)) as BPMN.SequenceFlow[],
      outgoing: (moddleElement.outgoing || []).map((ref: any) => this.convertElement(ref)) as BPMN.SequenceFlow[]
    };

    switch (moddleElement.$type) {
      case 'bpmn:StartEvent':
        return {
          ...flowNodeBase,
          $type: 'bpmn:StartEvent',
          eventDefinitions: moddleElement.eventDefinitions || []
        } as BPMN.StartEvent;

      case 'bpmn:EndEvent':
        return {
          ...flowNodeBase,
          $type: 'bpmn:EndEvent',
          eventDefinitions: moddleElement.eventDefinitions || []
        } as BPMN.EndEvent;

      case 'bpmn:IntermediateThrowEvent':
      case 'bpmn:IntermediateCatchEvent':
        return {
          ...flowNodeBase,
          eventDefinitions: moddleElement.eventDefinitions || []
        } as BPMN.Event;

      case 'bpmn:Task':
        return {
          ...flowNodeBase,
          $type: 'bpmn:Task'
        } as BPMN.Task;

      case 'bpmn:UserTask':
        return {
          ...flowNodeBase,
          $type: 'bpmn:UserTask',
          assignee: moddleElement.assignee
        } as BPMN.UserTask;

      case 'bpmn:ServiceTask':
        return {
          ...flowNodeBase,
          $type: 'bpmn:ServiceTask',
          topic: moddleElement.topic
        } as BPMN.ServiceTask;

      case 'bpmn:ScriptTask':
        return {
          ...flowNodeBase,
          $type: 'bpmn:ScriptTask',
          scriptFormat: moddleElement.scriptFormat,
          script: moddleElement.script
        } as BPMN.ScriptTask;

      case 'bpmn:BusinessRuleTask':
        return {
          ...flowNodeBase,
          $type: 'bpmn:BusinessRuleTask',
          implementation: moddleElement.implementation
        } as BPMN.BusinessRuleTask;

      case 'bpmn:ManualTask':
        return {
          ...flowNodeBase,
          $type: 'bpmn:ManualTask'
        } as BPMN.ManualTask;

      case 'bpmn:ReceiveTask':
        return {
          ...flowNodeBase,
          $type: 'bpmn:ReceiveTask',
          messageRef: moddleElement.messageRef ? this.convertElement(moddleElement.messageRef) : undefined
        } as BPMN.ReceiveTask;

      case 'bpmn:SendTask':
        return {
          ...flowNodeBase,
          $type: 'bpmn:SendTask',
          messageRef: moddleElement.messageRef ? this.convertElement(moddleElement.messageRef) : undefined
        } as BPMN.SendTask;

      case 'bpmn:ExclusiveGateway':
        return {
          ...flowNodeBase,
          $type: 'bpmn:ExclusiveGateway',
          gatewayDirection: moddleElement.gatewayDirection || 'Unspecified',
          default: moddleElement.default ? this.convertElement(moddleElement.default) : undefined
        } as BPMN.ExclusiveGateway;

      case 'bpmn:ParallelGateway':
        return {
          ...flowNodeBase,
          $type: 'bpmn:ParallelGateway',
          gatewayDirection: moddleElement.gatewayDirection || 'Unspecified'
        } as BPMN.ParallelGateway;

      case 'bpmn:InclusiveGateway':
        return {
          ...flowNodeBase,
          $type: 'bpmn:InclusiveGateway',
          gatewayDirection: moddleElement.gatewayDirection || 'Unspecified',
          default: moddleElement.default ? this.convertElement(moddleElement.default) : undefined
        } as BPMN.InclusiveGateway;

      case 'bpmn:EventBasedGateway':
        return {
          ...flowNodeBase,
          $type: 'bpmn:EventBasedGateway',
          gatewayDirection: moddleElement.gatewayDirection || 'Unspecified',
          instantiate: moddleElement.instantiate || false,
          eventGatewayType: moddleElement.eventGatewayType || 'Exclusive'
        } as BPMN.EventBasedGateway;

      case 'bpmn:ComplexGateway':
        return {
          ...flowNodeBase,
          $type: 'bpmn:ComplexGateway',
          gatewayDirection: moddleElement.gatewayDirection || 'Unspecified',
          default: moddleElement.default ? this.convertElement(moddleElement.default) : undefined,
          activationCondition: moddleElement.activationCondition
        } as BPMN.ComplexGateway;

      case 'bpmn:SequenceFlow':
        return {
          ...baseElement,
          $type: 'bpmn:SequenceFlow',
          sourceRef: this.convertElement(moddleElement.sourceRef) as BPMN.FlowNode,
          targetRef: this.convertElement(moddleElement.targetRef) as BPMN.FlowNode,
          conditionExpression: moddleElement.conditionExpression?.body
        } as BPMN.SequenceFlow;

      case 'bpmn:MessageFlow':
        return {
          ...baseElement,
          $type: 'bpmn:MessageFlow',
          sourceRef: this.convertElement(moddleElement.sourceRef),
          targetRef: this.convertElement(moddleElement.targetRef),
          messageRef: moddleElement.messageRef ? this.convertElement(moddleElement.messageRef) : undefined
        } as BPMN.MessageFlow;

      case 'bpmn:DataObject':
        return {
          ...baseElement,
          $type: 'bpmn:DataObject',
          isCollection: moddleElement.isCollection
        } as BPMN.DataObject;

      case 'bpmn:DataStore':
        return {
          ...baseElement,
          $type: 'bpmn:DataStore',
          capacity: moddleElement.capacity,
          isUnlimited: moddleElement.isUnlimited
        } as BPMN.DataStore;

      default:
        return baseElement as BPMN.FlowElement;
    }
  }
}
