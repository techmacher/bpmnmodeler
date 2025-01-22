import { memo } from 'react';
import { Handle, Position } from 'reactflow';

// BPMN specification styles

// BPMN 2.0 Specification Colors
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

const poolStyles = {
  padding: '0',
  backgroundColor: colors.container.background,
  width: '800px',
  minHeight: '200px',
  border: `1px solid ${colors.container.border}`,
  display: 'flex',
  flexDirection: 'column' as const,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const laneStyles = {
  padding: '0',
  backgroundColor: colors.container.background,
  width: '800px',
  minHeight: '100px',
  border: `1px solid ${colors.container.border}`,
  borderTop: 'none',
  display: 'flex',
};

const dataStyles = {
  backgroundColor: colors.data.background,
  border: `1px solid ${colors.data.border}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

export const StartEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.start}` }}>
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: colors.event.start }} />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const EndEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.end}` }}>
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: colors.event.end }} />
    </div>
  </>
));

export const IntermediateThrowEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px solid ${colors.event.intermediate}` }}>
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${colors.event.intermediate}` }} />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const IntermediateCatchEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px double ${colors.event.intermediate}` }}>
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${colors.event.intermediate}` }} />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const TimerEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px double ${colors.event.intermediate}` }}>
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.event.intermediate }}>
        ⏰
      </div>
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const MessageEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px double ${colors.event.intermediate}` }}>
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.event.intermediate }}>
        ✉️
      </div>
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const SignalEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: `2px double ${colors.event.intermediate}` }}>
      <div style={{ width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.event.intermediate }}>
        📡
      </div>
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const Task = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const UserTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <div className="absolute top-2 left-2">👤</div>
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const ServiceTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <div className="absolute top-2 left-2">⚙️</div>
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const ScriptTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <div className="absolute top-2 left-2">📜</div>
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const BusinessRuleTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <div className="absolute top-2 left-2">📋</div>
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const ManualTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <div className="absolute top-2 left-2">✋</div>
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const ReceiveTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <div className="absolute top-2 left-2">📥</div>
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const SendTask = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={taskStyles}>
      <div className="absolute top-2 left-2">📤</div>
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const ExclusiveGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <div style={{ transform: 'rotate(-45deg)' }}>✕</div>
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));

export const ParallelGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <div style={{ transform: 'rotate(-45deg)' }}>+</div>
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));

export const InclusiveGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <div style={{ transform: 'rotate(-45deg)' }}>O</div>
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));

export const EventBasedGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <div style={{ transform: 'rotate(-45deg)' }}>◇</div>
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));

export const ComplexGateway = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={gatewayStyles}>
      <div style={{ transform: 'rotate(-45deg)' }}>*</div>
    </div>
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
  </>
));

export const DataObject = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Top} />
    <div style={{ ...dataStyles, width: '36px', height: '48px', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: '-4px', 
        right: '-4px', 
        width: '12px', 
        height: '12px', 
        backgroundColor: colors.data.background, 
        borderTop: `1px solid ${colors.data.border}`, 
        borderRight: `1px solid ${colors.data.border}`, 
        transform: 'rotate(45deg)' 
      }} />
      <div style={{ padding: '8px', fontSize: '12px' }}>{data.label}</div>
    </div>
    <Handle type="source" position={Position.Bottom} />
  </>
));

export const DataStore = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Top} />
    <div style={{ ...dataStyles, width: '48px', height: '40px', position: 'relative' }}>
      <div style={{ 
        width: '100%', 
        height: '32px', 
        border: `1px solid ${colors.data.border}`, 
        borderRadius: '2px',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute', 
          bottom: '-8px', 
          left: 0, 
          right: 0, 
          height: '8px', 
          borderLeft: `1px solid ${colors.data.border}`,
          borderRight: `1px solid ${colors.data.border}`,
          borderBottom: `1px solid ${colors.data.border}`,
          borderBottomLeftRadius: '2px',
          borderBottomRightRadius: '2px'
        }} />
      </div>
      <div style={{ padding: '8px', fontSize: '12px' }}>{data.label}</div>
    </div>
    <Handle type="source" position={Position.Bottom} />
  </>
));

export const Pool = memo(({ data }: { data: { label: string } }) => (
  <div style={poolStyles}>
    <div className="border-b border-gray-300 p-2 font-semibold">{data.label}</div>
  </div>
));

export const Lane = memo(({ data }: { data: { label: string } }) => (
  <div style={laneStyles}>
    <div className="border-r border-gray-300 p-2">{data.label}</div>
  </div>
));

// Edge types for message flows and associations
import { EdgeProps } from 'reactflow';

export const MessageFlow = memo(({ id, source, target, ...props }: EdgeProps) => (
  <div className="flex items-center">
    <div className="w-3 h-3 border-2 border-gray-400 rounded-full" />
    <div className="flex-1 border-t-2 border-gray-400 border-dashed" />
    <div className="w-3 h-3 border-2 border-gray-400 rotate-45 transform origin-center" />
    {props.data?.label && (
      <div className="absolute w-full text-center -top-6 text-xs">
        {props.data.label}
      </div>
    )}
  </div>
));

export const Association = memo(({ id, source, target, ...props }: EdgeProps) => (
  <div className="flex items-center">
    <div className="flex-1 border-t-2 border-gray-400 border-dotted" />
    {props.data?.label && (
      <div className="absolute w-full text-center -top-6 text-xs">
        {props.data.label}
      </div>
    )}
  </div>
));

// Node type mapping for React Flow
export const nodeTypes = {
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

// Edge type mapping for React Flow
export const edgeTypes = {
  messageFlow: MessageFlow,
  association: Association,
};
