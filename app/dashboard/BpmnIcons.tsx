import { SVGProps } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  Unlock,
  Map,
  Circle,
  Square,
  Users,
  Cog,
  Diamond,
  ArrowRight,
} from 'lucide-react';

// Re-export Lucide icons for controls
export {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Maximize2 as FitViewIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Map as MapIcon,
};

// Custom BPMN icons following Lucide style
export const StartEventIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="8" className="fill-[#52bd52] stroke-[#52bd52]" />
  </svg>
);

export const EndEventIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="8" className="fill-[#ff4d4d] stroke-[#ff4d4d]" />
  </svg>
);

export const TimerEventIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="8" className="fill-white" />
    <path d="M12 8v4l2 2" />
    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </svg>
);

export const MessageEventIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="8" className="fill-white" />
    <path d="M8 10h8v6H8v-6z" />
    <path d="m8 10 4 3 4-3" />
  </svg>
);

export const TaskIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="6" width="16" height="12" rx="2" className="fill-white" />
  </svg>
);

export const UserTaskIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="6" width="16" height="12" rx="2" className="fill-white" />
    <circle cx="12" cy="10" r="2" />
    <path d="M8 15c0-1.5 1.6-3 4-3s4 1.5 4 3" />
  </svg>
);

export const ServiceTaskIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="6" width="16" height="12" rx="2" className="fill-white" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 9v-1" />
    <path d="M12 16v-1" />
    <path d="M15 12h1" />
    <path d="M8 12h1" />
    <path d="M14.1 9.9l.7-.7" />
    <path d="M9.2 14.8l.7-.7" />
    <path d="M14.1 14.1l.7.7" />
    <path d="M9.2 9.2l.7.7" />
  </svg>
);

export const ExclusiveGatewayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2l8.5 8.5-8.5 8.5L3.5 10.5z" className="fill-white" />
    <path d="m9 9 6 6" />
    <path d="m15 9-6 6" />
  </svg>
);

export const ParallelGatewayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2l8.5 8.5-8.5 8.5L3.5 10.5z" className="fill-white" />
    <path d="M12 6v12" />
    <path d="M6 12h12" />
  </svg>
);

export const ConnectIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 17 17 6" />
    <circle cx="6" cy="17" r="3" className="fill-white" />
    <circle cx="17" cy="6" r="3" className="fill-white" />
  </svg>
);
