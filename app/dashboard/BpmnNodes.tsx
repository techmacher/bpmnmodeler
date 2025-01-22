import { memo } from 'react';
import { Handle, Position } from 'reactflow';

// BPMN specification styles

const eventStyles = {
  padding: '8px',
  borderRadius: '50%',
  backgroundColor: '#fff',
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
};

const taskStyles = {
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: '#fff',
  width: '100px',
  height: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  border: '1px solid #888',
  position: 'relative' as const,
};

const gatewayStyles = {
  padding: '8px',
  backgroundColor: '#fff',
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'rotate(45deg)',
  border: '1px solid #888',
};

const poolStyles = {
  padding: '8px',
  backgroundColor: '#fff',
  width: '600px',
  height: '200px',
  border: '1px solid #888',
  display: 'flex',
  flexDirection: 'column' as const,
};

const laneStyles = {
  padding: '8px',
  backgroundColor: '#fff',
  width: '600px',
  height: '100px',
  border: '1px solid #888',
  borderTop: 'none',
};

export const StartEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <div style={{ ...eventStyles, border: '2px solid #52bd52' }}>
      <div className="w-4 h-4 rounded-full bg-green-500" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const EndEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: '2px solid #ff4d4d' }}>
      <div className="w-4 h-4 rounded-full bg-red-500" />
    </div>
  </>
));

export const IntermediateThrowEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: '2px solid #888' }}>
      <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const IntermediateCatchEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: '2px double #888' }}>
      <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const TimerEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: '2px double #888' }}>
      <div className="w-4 h-4 rounded-full flex items-center justify-center">
        ⏰
      </div>
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const MessageEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: '2px double #888' }}>
      <div className="w-4 h-4 rounded-full flex items-center justify-center">
        ✉️
      </div>
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));

export const SignalEvent = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div style={{ ...eventStyles, border: '2px double #888' }}>
      <div className="w-4 h-4 rounded-full flex items-center justify-center">
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

export const DataObject = memo(({ data }: { data: { label: string } }) => (
  <>
    <Handle type="target" position={Position.Top} />
    <div className="w-9 h-12 border border-gray-400 bg-white relative">
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-t border-r border-gray-400 transform rotate-45" />
      <div className="p-2 text-xs">{data.label}</div>
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
  exclusiveGateway: ExclusiveGateway,
  parallelGateway: ParallelGateway,
  dataObject: DataObject,
  pool: Pool,
  lane: Lane,
};
