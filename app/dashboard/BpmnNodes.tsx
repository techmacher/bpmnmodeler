import { memo } from 'react';
import { Handle, Position, EdgeProps } from 'reactflow';
import * as Icons from './BpmnIcons';

// BPMN specification styles
const colors = {
  event: {
    start: '#52bd52',     // Green for start events
    end: '#ff4d4d',       // Red for end events
    intermediate: '#888',  // Gray for intermediate events
    border: '#666',       // Darker gray for borders
    background: '#fff',   // White background
  },
  task: {
    border: '#2196f3',    // Blue for task borders
    background: '#fff',   // White background
    icon: '#555',         // Dark gray for icons
  },
  gateway: {
    border: '#ff9800',    // Orange for gateway borders
    background: '#fff',   // White background
    symbol: '#666',       // Dark gray for symbols
  },
  data: {
    border: '#9c27b0',    // Purple for data elements
    background: '#fff',   // White background
  },
  container: {
    border: '#666',       // Gray for pools/lanes
    background: '#fff',   // White background
    header: '#f5f5f5',    // Light gray for headers
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
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'relative' as const,
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
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const dataStyles = {
  padding: '8px',
  backgroundColor: colors.data.background,
  border: `2px solid ${colors.data.border}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderRadius: '4px',
};

const containerStyles = {
  backgroundColor: colors.container.background,
  border: `1px solid ${colors.container.border}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

// Event Nodes
export const StartEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.start}` }}>
      <Icons.StartEventIcon className="w-5 h-5" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const EndEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.end}` }}>
      <Icons.EndEventIcon className="w-5 h-5" />
    </div>
  </>
));

export const IntermediateThrowEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.intermediate}` }}>
      <Icons.MessageEventIcon className="w-5 h-5" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const IntermediateCatchEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px double ${colors.event.intermediate}` }}>
      <Icons.MessageEventIcon className="w-5 h-5" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const TimerEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.intermediate}` }}>
      <Icons.TimerEventIcon className="w-5 h-5" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const MessageEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.intermediate}` }}>
      <Icons.MessageEventIcon className="w-5 h-5" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const SignalEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.intermediate}` }}>
      <Icons.MessageEventIcon className="w-5 h-5" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

// Task Nodes
export const Task = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.TaskIcon className="absolute top-2 left-2 w-5 h-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const UserTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.UserTaskIcon className="absolute top-2 left-2 w-5 h-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const ServiceTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.ServiceTaskIcon className="absolute top-2 left-2 w-5 h-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const ScriptTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.ServiceTaskIcon className="absolute top-2 left-2 w-5 h-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const BusinessRuleTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.ServiceTaskIcon className="absolute top-2 left-2 w-5 h-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const ManualTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.UserTaskIcon className="absolute top-2 left-2 w-5 h-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const ReceiveTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.MessageEventIcon className="absolute top-2 left-2 w-5 h-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const SendTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <Icons.MessageEventIcon className="absolute top-2 left-2 w-5 h-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

// Gateway Nodes
export const ExclusiveGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <Icons.ExclusiveGatewayIcon className="w-5 h-5 -rotate-45" />
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));

export const ParallelGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <Icons.ParallelGatewayIcon className="w-5 h-5 -rotate-45" />
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));

export const InclusiveGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <Icons.ParallelGatewayIcon className="w-5 h-5 -rotate-45" />
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));

export const EventBasedGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <Icons.ExclusiveGatewayIcon className="w-5 h-5 -rotate-45" />
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));

export const ComplexGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <Icons.ExclusiveGatewayIcon className="w-5 h-5 -rotate-45" />
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));

// Data Nodes
export const DataObject = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Top} />
    <div style={{ ...dataStyles, width: '36px', height: '48px' }}>
      <Icons.TaskIcon className="w-5 h-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Bottom} />
  </>
));

export const DataStore = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Top} />
    <div style={{ ...dataStyles, width: '48px', height: '40px' }}>
      <Icons.TaskIcon className="w-5 h-5" />
      {data.label}
    </div>
    <Handle type="source" position={Position.Bottom} />
  </>
));

// Container Nodes
export const Pool = memo(({ data }: { data: { label: string } }) => (
  <div style={{ ...containerStyles, width: '800px', minHeight: '200px' }}>
    <div className="border-b border-gray-300 p-2 font-semibold">{data.label}</div>
  </div>
));

export const Lane = memo(({ data }: { data: { label: string } }) => (
  <div style={{ ...containerStyles, width: '800px', minHeight: '100px' }}>
    <div className="border-r border-gray-300 p-2">{data.label}</div>
  </div>
));

// Edge Types
export const MessageFlow = memo(({ data }: EdgeProps) => (
  <div className="flex items-center">
    <Icons.ConnectIcon className="w-4 h-4" />
  </div>
));

export const Association = memo(({ data }: EdgeProps) => (
  <div className="flex items-center">
    <Icons.ConnectIcon className="w-4 h-4" />
  </div>
));
