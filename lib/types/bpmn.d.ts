declare module 'bpmn-types' {
  export namespace BPMN {
    interface Definitions extends BaseElement {
      $type: 'bpmn:Definitions';
      targetNamespace: string;
      process: Process[];
    }
  
    interface BaseElement {
      id: string;
      $type: string;
      name?: string;
      documentation?: string[];
    }

    interface Process extends BaseElement {
      isExecutable: boolean;
      flowElements: FlowElement[];
    }

    type FlowElement = FlowNode | SequenceFlow;
    
    interface FlowNode extends BaseElement {
      incoming: SequenceFlow[];
      outgoing: SequenceFlow[];
    }

    interface SequenceFlow extends BaseElement {
      sourceRef: FlowNode;
      targetRef: FlowNode;
    }

    interface Task extends FlowNode {
      $type: 'bpmn:Task';
    }

    interface UserTask extends Task {
      $type: 'bpmn:UserTask';
      assignee?: string;
    }

    interface ServiceTask extends Task {
      $type: 'bpmn:ServiceTask';
      topic?: string;
    }

    interface Gateway extends FlowNode {
      gatewayDirection: 'Unspecified' | 'Converging' | 'Diverging' | 'Mixed';
    }

    interface Event extends FlowNode {
      eventDefinitions?: EventDefinition[];
    }

    type EventDefinition = MessageEventDefinition | TimerEventDefinition;

    interface MessageEventDefinition {
      $type: 'bpmn:MessageEventDefinition';
      messageRef?: string;
    }

    interface TimerEventDefinition {
      $type: 'bpmn:TimerEventDefinition';
      timeDuration?: string;
    }
  }
}

export as namespace BPMN;