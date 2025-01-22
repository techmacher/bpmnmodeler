import React, { createContext, useContext, useMemo } from 'react';
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

type BpmnContextType = {
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;
};

const BpmnContext = createContext<BpmnContextType | null>(null);

// Base node and edge types that will be memoized
const baseNodeTypes: NodeTypes = {
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
};

const baseEdgeTypes: EdgeTypes = {
  messageFlow: MessageFlow,
  association: Association,
};

export function BpmnProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => ({
    nodeTypes: baseNodeTypes,
    edgeTypes: baseEdgeTypes,
  }), []);

  return (
    <BpmnContext.Provider value={value}>
      {children}
    </BpmnContext.Provider>
  );
}

export function useBpmnTypes() {
  const context = useContext(BpmnContext);
  if (!context) {
    throw new Error('useBpmnTypes must be used within a BpmnProvider');
  }
  return context;
}
