import { NodeTypes, EdgeTypes } from 'reactflow';
import {
  StartEvent,
  EndEvent,
  IntermediateThrowEvent,
  IntermediateCatchEvent,
  TimerEvent,
  MessageEvent,
  SignalEvent,
  Task,
  UserTask,
  ServiceTask,
  ScriptTask,
  BusinessRuleTask,
  ManualTask,
  ReceiveTask,
  SendTask,
  ExclusiveGateway,
  ParallelGateway,
  InclusiveGateway,
  EventBasedGateway,
  ComplexGateway,
  DataObject,
  DataStore,
  Pool,
  Lane,
  MessageFlow,
  Association,
} from './BpmnNodes';

// Create a single frozen instance of node types that will be shared across the app
export const nodeTypes = Object.freeze<NodeTypes>({
  startEvent: StartEvent,
  endEvent: EndEvent,
  intermediateThrowEvent: IntermediateThrowEvent,
  intermediateCatchEvent: IntermediateCatchEvent,
  timerEvent: TimerEvent,
  messageEvent: MessageEvent,
  signalEvent: SignalEvent,
  task: Task,
  userTask: UserTask,
  serviceTask: ServiceTask,
  scriptTask: ScriptTask,
  businessRuleTask: BusinessRuleTask,
  manualTask: ManualTask,
  receiveTask: ReceiveTask,
  sendTask: SendTask,
  exclusiveGateway: ExclusiveGateway,
  parallelGateway: ParallelGateway,
  inclusiveGateway: InclusiveGateway,
  eventBasedGateway: EventBasedGateway,
  complexGateway: ComplexGateway,
  dataObject: DataObject,
  dataStore: DataStore,
  pool: Pool,
  lane: Lane,
});

// Create a single frozen instance of edge types that will be shared across the app
export const edgeTypes = Object.freeze<EdgeTypes>({
  messageFlow: MessageFlow,
  association: Association,
});

// Create a single frozen instance of node type mapping that will be shared across the app
export const nodeTypeMapping = Object.freeze<Record<string, string>>({
  'startEvent': 'StartEvent',
  'endEvent': 'EndEvent',
  'intermediateThrowEvent': 'IntermediateThrowEvent',
  'intermediateCatchEvent': 'IntermediateCatchEvent',
  'timerEvent': 'TimerEvent',
  'messageEvent': 'MessageEvent',
  'signalEvent': 'SignalEvent',
  'task': 'Task',
  'userTask': 'UserTask',
  'serviceTask': 'ServiceTask',
  'scriptTask': 'ScriptTask',
  'businessRuleTask': 'BusinessRuleTask',
  'manualTask': 'ManualTask',
  'receiveTask': 'ReceiveTask',
  'sendTask': 'SendTask',
  'exclusiveGateway': 'ExclusiveGateway',
  'parallelGateway': 'ParallelGateway',
  'inclusiveGateway': 'InclusiveGateway',
  'eventBasedGateway': 'EventBasedGateway',
  'complexGateway': 'ComplexGateway',
  'dataObject': 'DataObject',
  'dataStore': 'DataStore',
  'pool': 'Pool',
  'lane': 'Lane',
});

interface NodeDefault {
  label: string;
  width: number;
  height: number;
  description: string;
}

// Create a single frozen instance of node defaults that will be shared across the app
export const nodeDefaults = Object.freeze<Record<string, NodeDefault>>({
  startEvent: { label: 'Start Event', width: 36, height: 36, description: 'Indicates where a process begins' },
  endEvent: { label: 'End Event', width: 36, height: 36, description: 'Indicates where a process ends' },
  intermediateThrowEvent: { label: 'Intermediate Throw Event', width: 36, height: 36, description: 'Throws an intermediate event during process execution' },
  intermediateCatchEvent: { label: 'Intermediate Catch Event', width: 36, height: 36, description: 'Catches an intermediate event during process execution' },
  timerEvent: { label: 'Timer Event', width: 36, height: 36, description: 'Triggers based on a specific time or cycle' },
  messageEvent: { label: 'Message Event', width: 36, height: 36, description: 'Sends or receives messages between processes' },
  signalEvent: { label: 'Signal Event', width: 36, height: 36, description: 'Broadcasts or catches signals across processes' },
  task: { label: 'Task', width: 100, height: 80, description: 'Represents an atomic activity within a process' },
  userTask: { label: 'User Task', width: 100, height: 80, description: 'A task performed by a human' },
  serviceTask: { label: 'Service Task', width: 100, height: 80, description: 'A task performed by a system' },
  scriptTask: { label: 'Script Task', width: 100, height: 80, description: 'A task performed by a script' },
  businessRuleTask: { label: 'Business Rule Task', width: 100, height: 80, description: 'A task performed by a business rule' },
  manualTask: { label: 'Manual Task', width: 100, height: 80, description: 'A task performed manually' },
  receiveTask: { label: 'Receive Task', width: 100, height: 80, description: 'A task that receives a message' },
  sendTask: { label: 'Send Task', width: 100, height: 80, description: 'A task that sends a message' },
  exclusiveGateway: { label: 'Exclusive Gateway', width: 50, height: 50, description: 'Controls the flow of a process based on conditions' },
  parallelGateway: { label: 'Parallel Gateway', width: 50, height: 50, description: 'Splits the flow of a process into parallel paths' },
  inclusiveGateway: { label: 'Inclusive Gateway', width: 50, height: 50, description: 'Controls the flow of a process based on conditions' },
  eventBasedGateway: { label: 'Event-Based Gateway', width: 50, height: 50, description: 'Controls the flow of a process based on events' },
  complexGateway: { label: 'Complex Gateway', width: 50, height: 50, description: 'Controls the flow of a process based on complex conditions' },
  dataObject: { label: 'Data Object', width: 36, height: 50, description: 'Represents information flowing through the process' },
  dataStore: { label: 'Data Store', width: 50, height: 50, description: 'Represents a place where the process can read or write data' },
  pool: { label: 'Pool', width: 600, height: 200, description: 'Contains a process and represents a participant' },
  lane: { label: 'Lane', width: 600, height: 100, description: 'Subdivides a pool and organizes activities' },
});

// Create a single frozen instance of edge defaults that will be shared across the app
export const edgeDefaults = Object.freeze<Record<string, any>>({
  messageFlow: { label: 'Message Flow', description: 'Connects two flow objects that communicate by sending messages' },
  association: { label: 'Association', description: 'Connects an artifact to a flow object or another artifact' },
});

// Create a single frozen instance of node type groups that will be shared across the app
export const nodeTypeGroups = Object.freeze<Record<string, string>>({
  startEvents: 'Start Events',
  endEvents: 'End Events',
  intermediateEvents: 'Intermediate Events',
  boundaryEvents: 'Boundary Events',
  tasks: 'Tasks',
  gateways: 'Gateways',
  events: 'Events',
  activities: 'Activities',
  artifacts: 'Artifacts',
  data: 'Data',
  pools: 'Pools',
  lanes: 'Lanes',
});

// Create a single frozen instance of edge type mapping that will be shared across the app
export const edgeTypeMapping = Object.freeze<Record<string, string>>({
  'messageFlow': 'MessageFlow',
  'association': 'Association',
});
