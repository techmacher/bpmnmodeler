import { NodeTypes } from 'reactflow';
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
  ExclusiveGateway,
  ParallelGateway,
  DataObject,
  Pool,
  Lane,
} from './BpmnNodes';

// Export a static nodeTypes object that won't change between renders
export const nodeTypes: NodeTypes = {
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
  exclusiveGateway: ExclusiveGateway,
  parallelGateway: ParallelGateway,
  dataObject: DataObject,
  pool: Pool,
  lane: Lane,
} as const;
