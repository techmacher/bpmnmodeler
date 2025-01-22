'use client';

import BpmnEditor from './BpmnEditor';
import Chat from 'components/chat';

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 relative h-full">
        <BpmnEditor />
      </div>
      <Chat className="w-96 border-l" />
    </div>
  );
}
