import { cookies } from 'next/headers';

import Chat from '@/components/chat';
import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { ChatHeader } from '@/components/chat-header';
import { BlockMessages } from '@/components/block-messages';
import { ChatRequestOptions, Message } from 'ai';
import { MessageDataStreamHandler } from '@/components/message-data-stream-handler';

type VisibilityType = 'public' | 'private';

export default async function Page() {
  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;
  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;
  return (
    <>
      <ChatHeader chatId={id} selectedModelId={selectedModelId} selectedVisibilityType={"private"} isReadonly={false} />
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedModelId={selectedModelId}
        selectedVisibilityType="private"
        isReadonly={false}
      />
      <MessageDataStreamHandler id={id} />
    </>
  );
}

function isVisibilityType(visibility: string | undefined): visibility is VisibilityType {
  return visibility === 'public' || visibility === 'private';
}