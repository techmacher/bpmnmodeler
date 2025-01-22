import { useCallback, useRef, DragEvent, useState } from 'react';
import * as Icons from './BpmnIcons';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { BpmnProvider } from './BpmnContext';
import BpmnCanvas from './BpmnCanvas';
import BpmnToolbar from './BpmnToolbar';

export default function BpmnEditor() {
  return (
    <BpmnProvider>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Main editor area */}
        <div className="relative flex-1">
          <BpmnCanvas />
          <BpmnToolbar />
        </div>
      </div>
    </BpmnProvider>
  );
}
