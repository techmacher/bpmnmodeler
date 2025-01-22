import { SVGProps } from 'react';

export const StartEventIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="16" cy="16" r="14" stroke="#52bd52" strokeWidth="2" fill="white" />
    <circle cx="16" cy="16" r="8" fill="#52bd52" />
  </svg>
);

export const EndEventIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="16" cy="16" r="14" stroke="#ff4d4d" strokeWidth="2" fill="white" />
    <circle cx="16" cy="16" r="8" fill="#ff4d4d" />
  </svg>
);

export const IntermediateThrowEventIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="white" />
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
  </svg>
);

export const IntermediateCatchEventIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="white" />
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" fill="white" strokeDasharray="4 2" />
  </svg>
);

export const TimerEventIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="white" />
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
    <path d="M16 10V16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="16" r="1" fill="currentColor" />
  </svg>
);

export const MessageEventIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="white" />
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
    <path d="M10 13L16 17L22 13M10 13V19H22V13H10Z" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const SignalEventIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="white" />
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
    <path d="M16 10L20 18H12L16 10Z" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const TaskIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="white" />
  </svg>
);

export const UserTaskIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="white" />
    <circle cx="16" cy="13" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M10 21C10 18.2386 12.2386 16 15 16H17C19.7614 16 22 18.2386 22 21" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const ServiceTaskIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="white" />
    <path d="M16 12L16 20M12 16L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ExclusiveGatewayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M16 2L30 16L16 30L2 16L16 2Z" stroke="currentColor" strokeWidth="2" fill="white" />
    <path d="M11 11L21 21M21 11L11 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ParallelGatewayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M16 2L30 16L16 30L2 16L16 2Z" stroke="currentColor" strokeWidth="2" fill="white" />
    <path d="M16 8L16 24M8 16L24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DataObjectIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8 4H20L24 8V28H8V4Z" stroke="currentColor" strokeWidth="2" fill="white" />
    <path d="M20 4L20 8H24" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const PoolIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="white" />
    <line x1="10" y1="8" x2="10" y2="24" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const LaneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="8" width="24" height="16" stroke="currentColor" strokeWidth="2" fill="white" />
    <line x1="10" y1="8" x2="10" y2="24" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Control icons
export const UndoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 10H17C19.2091 10 21 11.7909 21 14V14C21 16.2091 19.2091 18 17 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 6L3 10L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const RedoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 10H7C4.79086 10 3 11.7909 3 14V14C3 16.2091 4.79086 18 7 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 6L21 10L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SaveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const LoadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 21H20C20.5523 21 21 20.5523 21 20V6C21 5.44772 20.5523 5 20 5H11L9 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ZoomInIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ZoomOutIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FitViewIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21H3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 15V21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 9V3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
