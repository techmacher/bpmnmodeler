declare namespace BPMN {
  interface BaseElement {
    id: string;
    $type: string;
    name?: string;
    documentation?: string[];
  }

  interface FlowNode extends BaseElement {
    incoming: SequenceFlow[];
    outgoing: SequenceFlow[];
  }

  interface FlowElement extends BaseElement {}

  interface FlowConnection extends FlowElement {
    sourceRef: FlowNode;
    targetRef: FlowNode;
  }

  // Events
  interface Event extends FlowNode {
    eventDefinitions?: EventDefinition[];
  }

  interface StartEvent extends Event {
    $type: 'bpmn:StartEvent';
  }

  interface EndEvent extends Event {
    $type: 'bpmn:EndEvent';
  }

  interface IntermediateThrowEvent extends Event {
    $type: 'bpmn:IntermediateThrowEvent';
  }

  interface IntermediateCatchEvent extends Event {
    $type: 'bpmn:IntermediateCatchEvent';
  }

  // Tasks
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

  interface ScriptTask extends Task {
    $type: 'bpmn:ScriptTask';
    scriptFormat?: string;
    script?: string;
  }

  interface BusinessRuleTask extends Task {
    $type: 'bpmn:BusinessRuleTask';
    implementation?: string;
  }

  interface ManualTask extends Task {
    $type: 'bpmn:ManualTask';
  }

  interface ReceiveTask extends Task {
    $type: 'bpmn:ReceiveTask';
    messageRef?: Message;
  }

  interface SendTask extends Task {
    $type: 'bpmn:SendTask';
    messageRef?: Message;
  }

  // Gateways
  interface Gateway extends FlowNode {
    gatewayDirection?: 'Unspecified' | 'Converging' | 'Diverging' | 'Mixed';
  }

  interface ExclusiveGateway extends Gateway {
    $type: 'bpmn:ExclusiveGateway';
    default?: SequenceFlow;
  }

  interface ParallelGateway extends Gateway {
    $type: 'bpmn:ParallelGateway';
  }

  interface InclusiveGateway extends Gateway {
    $type: 'bpmn:InclusiveGateway';
    default?: SequenceFlow;
  }

  interface EventBasedGateway extends Gateway {
    $type: 'bpmn:EventBasedGateway';
    instantiate?: boolean;
    eventGatewayType?: 'Exclusive' | 'Parallel';
  }

  interface ComplexGateway extends Gateway {
    $type: 'bpmn:ComplexGateway';
    default?: SequenceFlow;
    activationCondition?: string;
  }

  // Data
  interface DataObject extends FlowElement {
    $type: 'bpmn:DataObject';
    isCollection?: boolean;
  }

  interface DataStore extends FlowElement {
    $type: 'bpmn:DataStore';
    capacity?: number;
    isUnlimited?: boolean;
  }

  // Containers
  interface Pool extends BaseElement {
    $type: 'bpmn:Pool';
    processRef?: Process;
    participant?: Participant;
  }

  interface Lane extends BaseElement {
    $type: 'bpmn:Lane';
    flowNodeRefs: FlowNode[];
    childLaneSet?: LaneSet;
  }

  interface LaneSet extends BaseElement {
    $type: 'bpmn:LaneSet';
    lanes: Lane[];
  }

  // Flows
  interface SequenceFlow extends FlowConnection {
    $type: 'bpmn:SequenceFlow';
    sourceRef: FlowNode;
    targetRef: FlowNode;
    conditionExpression?: string;
  }

  interface MessageFlow extends FlowElement {
    $type: 'bpmn:MessageFlow';
    sourceRef: BaseElement & { $type: string };
    targetRef: BaseElement & { $type: string };
    messageRef?: Message;
  }

  interface Association extends FlowElement {
    $type: 'bpmn:Association';
    sourceRef: BaseElement & { $type: string };
    targetRef: BaseElement & { $type: string };
    associationDirection?: 'None' | 'One' | 'Both';
  }

  // Supporting Types
  interface Process extends BaseElement {
    $type: 'bpmn:Process';
    isExecutable?: boolean;
    flowElements: FlowElement[];
  }

  interface Participant extends BaseElement {
    $type: 'bpmn:Participant';
    processRef?: Process;
  }

  interface Message extends BaseElement {
    $type: 'bpmn:Message';
  }

  interface EventDefinition extends BaseElement {
    $type: string;
  }

  interface Definitions extends BaseElement {
    $type: 'bpmn:Definitions';
    targetNamespace: string;
    process: Process[];
  }
}

export = BPMN;
