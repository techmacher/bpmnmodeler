import { memo } from 'react';
import { Handle, Position, EdgeProps } from 'reactflow';
import * as Icons from './BpmnIcons';

// BPMN specification styles
const colors = {
  event: {
    start: '#52bd52',     // Green for start events
    end: '#ff4d4d',       // Red for end events
    intermediate: 'var(--event-intermediate, #888)',  // Gray for intermediate events
    border: 'var(--event-border, #666)',       // Darker gray for borders
    background: 'var(--event-background, #fff)',   // White background
  },
  task: {
    border: '#2196f3',    // Blue for task borders
    background: 'var(--task-background, #fff)',   // White background
    icon: 'var(--task-icon, #555)',         // Dark gray for icons
  },
  gateway: {
    border: '#ff9800',    // Orange for gateway borders
    background: 'var(--gateway-background, #fff)',   // White background
    symbol: 'var(--gateway-symbol, #666)',       // Dark gray for symbols
  },
  data: {
    border: '#9c27b0',    // Purple for data elements
    background: 'var(--data-background, #fff)',   // White background
  },
  container: {
    border: 'var(--container-border, #666)',       // Gray for pools/lanes
    background: 'var(--container-background, #fff)',   // White background
    header: 'var(--container-header, #f5f5f5)',    // Light gray for headers
  }
};

// BPMN 2.0 Specification Styles
const eventStyles = {
  padding: '8px',
  borderRadius: '50%',
  backgroundColor: colors.event.background,
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  boxShadow: 'var(--node-shadow, 0 2px 4px rgba(0,0,0,0.1))',
  position: 'relative' as const,
  zIndex: 'var(--z-event)',
};

const taskStyles = {
  padding: '12px',
  borderRadius: '4px',
  backgroundColor: colors.task.background,
  width: '120px',
  height: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  border: `2px solid ${colors.task.border}`,
  position: 'relative' as const,
  boxShadow: 'var(--node-shadow, 0 2px 4px rgba(0,0,0,0.1))',
  zIndex: 'var(--z-activity)',
};

const gatewayStyles = {
  padding: '8px',
  backgroundColor: colors.gateway.background,
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'rotate(45deg)',
  border: `2px solid ${colors.gateway.border}`,
  boxShadow: 'var(--node-shadow, 0 2px 4px rgba(0,0,0,0.1))',
  zIndex: 'var(--z-activity)',
};

const dataStyles = {
  padding: '8px',
  backgroundColor: colors.data.background,
  border: `2px solid ${colors.data.border}`,
  boxShadow: 'var(--node-shadow, 0 2px 4px rgba(0,0,0,0.1))',
  borderRadius: '4px',
  zIndex: 'var(--z-data)',
};

const containerStyles = {
  backgroundColor: colors.container.background,
  border: `1px solid ${colors.container.border}`,
  boxShadow: 'var(--node-shadow, 0 2px 4px rgba(0,0,0,0.1))',
  zIndex: 'var(--z-background)',
};

// Event Nodes
export const StartEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.start}` }}>
      <Icons.StartEventIcon className="size-5" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
StartEvent.displayName = 'StartEvent';

export const EndEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.end}` }}>
      <Icons.EndEventIcon className="size-5" />
    </div>
  </>
));
EndEvent.displayName = 'EndEvent';

export const IntermediateThrowEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.intermediate}` }}>
      <Icons.IntermediateThrowEventIcon className="size-5" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
IntermediateThrowEvent.displayName = 'IntermediateThrowEvent';

export const IntermediateCatchEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px double ${colors.event.intermediate}` }}>
      <Icons.IntermediateCatchEventIcon className="size-5" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
IntermediateCatchEvent.displayName = 'IntermediateCatchEvent';

export const TimerEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.intermediate}` }}>
      <Icons.TimerEventIcon className="size-5" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
TimerEvent.displayName = 'TimerEvent';

export const MessageEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.intermediate}` }}>
      <Icons.MessageEventIcon className="size-5" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
MessageEvent.displayName = 'MessageEvent';

export const SignalEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.intermediate}` }}>
      <Icons.SignalEventIcon className="size-5" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
SignalEvent.displayName = 'SignalEvent';

// Task Nodes
export const Task = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.TaskIcon className="absolute top-2 left-2 size-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
Task.displayName = 'Task';

export const UserTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.UserTaskIcon className="absolute top-2 left-2 size-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
UserTask.displayName = 'UserTask';

export const ServiceTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.ServiceTaskIcon className="absolute top-2 left-2 size-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
ServiceTask.displayName = 'ServiceTask';

export const ScriptTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.ScriptTaskIcon className="absolute top-2 left-2 size-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
ScriptTask.displayName = 'ScriptTask';

export const BusinessRuleTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.BusinessRuleTaskIcon className="absolute top-2 left-2 size-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
BusinessRuleTask.displayName = 'BusinessRuleTask';

export const ManualTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.UserTaskIcon className="absolute top-2 left-2 size-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
ManualTask.displayName = 'ManualTask';

export const ReceiveTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.MessageEventIcon className="absolute top-2 left-2 size-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
ReceiveTask.displayName = 'ReceiveTask';

export const SendTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.MessageEventIcon className="absolute top-2 left-2 size-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
SendTask.displayName = 'SendTask';

// Gateway Nodes
export const ExclusiveGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <Icons.ExclusiveGatewayIcon className="size-5 -rotate-45" />
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));
ExclusiveGateway.displayName = 'ExclusiveGateway';

export const ParallelGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <Icons.ParallelGatewayIcon className="size-5 -rotate-45" />
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));
ParallelGateway.displayName = 'ParallelGateway';

export const InclusiveGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <Icons.InclusiveGatewayIcon className="size-5 -rotate-45" />
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));
InclusiveGateway.displayName = 'InclusiveGateway';

export const EventBasedGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <Icons.EventBasedGatewayIcon className="size-5 -rotate-45" />
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));
EventBasedGateway.displayName = 'EventBasedGateway';

export const ComplexGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <Icons.ExclusiveGatewayIcon className="size-5 -rotate-45" />
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));
ComplexGateway.displayName = 'ComplexGateway';

// Data Nodes
export const DataObject = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Top} />
    <div style={{ ...dataStyles, width: '36px', height: '48px' }}>
      <Icons.DataObjectIcon className="size-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Bottom} />
  </>
));
DataObject.displayName = 'DataObject';

export const DataStore = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Top} />
    <div style={{ ...dataStyles, width: '48px', height: '40px' }}>
      <Icons.DataStoreIcon className="size-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Bottom} />
  </>
));
DataStore.displayName = 'DataStore';

// Container Nodes
export const Pool = memo(({ data }: { data: { label: string } }) => (
  <div style={{ ...containerStyles, width: '800px', minHeight: '200px' }}>
    <div className="border-b border-gray-300 p-2 font-semibold">{data.label}</div>
  </div>
));
Pool.displayName = 'Pool';

export const Lane = memo(({ data }: { data: { label: string } }) => (
  <div style={{ ...containerStyles, width: '800px', minHeight: '100px' }}>
    <div className="border-r border-gray-300 p-2">{data.label}</div>
  </div>
));
Lane.displayName = 'Lane';

// Edge Types
export const MessageFlow = memo(({ data }: EdgeProps) => (
  <div className="flex items-center">
    <Icons.ConnectIcon className="size-4" />
  </div>
));
MessageFlow.displayName = 'MessageFlow';

export const Association = memo(({ data }: EdgeProps) => (
  <div className="flex items-center">
    <Icons.ConnectIcon className="size-4" />
  </div>
));
Association.displayName = 'Association';
