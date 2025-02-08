'use client';

import { useState, useEffect } from 'react';
import { ChatSidebar } from '@/components/chat-sidebar';
import Chat from '@/components/chat';
import { ChatHeader } from '@/components/chat-header';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { generateUUID } from '@/lib/utils';
import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models';
import { VisibilityType } from '@/components/visibility-selector';
import { Chat as ChatType } from '@/components/chat-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import BPMNEditor from './BpmnEditor';

export default function DashboardPage() {
  type Chat = ChatType;

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_NAME);

  useEffect(() => {
    const id = generateUUID();
    const modelIdFromCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('model-id='))
      ?.split('=')[1];
    const modelId = models.find((model) => model.id === modelIdFromCookie)?.id || DEFAULT_MODEL_NAME;
    setSelectedModelId(modelId);
  }, []);

  const handleChatSelect = (chat: Chat | null) => {
    if (chat && !isVisibilityType(chat.visibility)) {
      console.error(`Invalid visibility type: ${chat.visibility}`);
      return;
    }
    setSelectedChat(chat);
  };

  return (
    <SidebarProvider>
    <div className="flex h-screen overflow-hidden w-full">
      <div className="flex-1 h-full">
        <BPMNEditor />
      </div>
      <div className="flex-none w-2/8">
        <ChatSidebar onSelectChat={handleChatSelect} />
      </div>
      <div className="flex-none w-1/8 border-l">
        {selectedChat && (
          <>
            <ChatHeader
              chatId={selectedChat.id}
              selectedModelId={selectedModelId}
              selectedVisibilityType={selectedChat.visibility as VisibilityType}
              isReadonly={false}
            />
            <Chat
              key={selectedChat.id}
              id={selectedChat.id}
              initialMessages={selectedChat.messages}
              selectedModelId={selectedModelId}
              selectedVisibilityType={selectedChat.visibility as VisibilityType}
              isReadonly={false}
            />
            <DataStreamHandler id={selectedChat.id} />
          </>
        )}
      </div>
    </div>
  </SidebarProvider>
  );
}

function isVisibilityType(visibility: string | undefined): visibility is VisibilityType {
  return visibility === 'public' || visibility === 'private';
}