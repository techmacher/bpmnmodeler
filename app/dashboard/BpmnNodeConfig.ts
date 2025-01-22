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

// Singleton class to manage node and edge types
class BpmnConfig {
  private static instance: BpmnConfig;
  private readonly nodeTypes: NodeTypes;
  private readonly edgeTypes: EdgeTypes;
  private readonly defaultEdgeOptions: any;

  private constructor() {
    this.nodeTypes = {
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

    this.edgeTypes = {
      messageFlow: MessageFlow,
      association: Association,
    };

    this.defaultEdgeOptions = {
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#666', strokeWidth: 2 }
    };

    // Freeze all objects to prevent modifications
    Object.freeze(this.nodeTypes);
    Object.freeze(this.edgeTypes);
    Object.freeze(this.defaultEdgeOptions);
  }

  public static getInstance(): BpmnConfig {
    if (!BpmnConfig.instance) {
      BpmnConfig.instance = new BpmnConfig();
    }
    return BpmnConfig.instance;
  }

  public getNodeTypes(): NodeTypes {
    return this.nodeTypes;
  }

  public getEdgeTypes(): EdgeTypes {
    return this.edgeTypes;
  }

  public getDefaultEdgeOptions(): any {
    return this.defaultEdgeOptions;
  }
}

// Export singleton instance methods
export const getNodeTypes = () => BpmnConfig.getInstance().getNodeTypes();
export const getEdgeTypes = () => BpmnConfig.getInstance().getEdgeTypes();
export const getDefaultEdgeOptions = () => BpmnConfig.getInstance().getDefaultEdgeOptions();
