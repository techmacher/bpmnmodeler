'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Message as OriginalMessage, useChat } from 'ai/react';

interface Message extends OriginalMessage {
  streaming?: boolean;
}
import { PureMessageActions } from './message-actions';
import { PreviewMessage } from './message';
import { Suggestion } from '@/lib/db/schema';
import { useUserMessageId } from '@/hooks/use-user-message-id';
import { PlainFormattedMessage } from './formatted-message';
import { LanguageModelV1FinishReason } from '@ai-sdk/provider';
import { LanguageModelUsage } from 'ai';
import { persistChatMessages } from '@/lib/db/queries';
import { useSession } from 'next-auth/react';


interface Diagram {
  id: string;
  name: string;
  xml: string;
  userId: string;
}

interface ChatProps {
  id?: string;
  className?: string;
  initialMessages?: Message[];
  selectedModelId?: string;
  selectedVisibilityType?: 'public' | 'private';
  isReadonly?: boolean;
  diagram?: Diagram;
}

export default function Chat({
  id,
  className,
  initialMessages = [],
  selectedModelId,
  selectedVisibilityType = 'private',
  diagram,
  isReadonly = false
}: ChatProps) {
  const inputRef = useRef('');  
  const {data:session} = useSession();
  const userId = session?.user?.id;
  console.log('chat session', userId);

  // useChat provides the messages state and updater functions.
  const { data: dataStream, messages, input, setInput, handleSubmit, isLoading, setMessages } =
    useChat({
      api: '/chat/api/openai',
      id: id,
      body: {
        model: selectedModelId,
        diagram,
        selectedModelId,
        chatId: id,
      },
      onFinish: useCallback((_message: OriginalMessage, _options: {
        usage: LanguageModelUsage;
        finishReason: LanguageModelV1FinishReason;
    }) => {
        const lastInput= inputRef.current;
        persistChatMessages([
          { chatId: id || '', role: 'user', content: lastInput },
          { chatId: id || '', role: 'assistant', content: _message.content },
        ]);
      }, []),
      initialMessages,
      experimental_throttle: 500,
   });

  return (
    <div className={className}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map(message =>
           (
              <div key={message.id} className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <PlainFormattedMessage content={message.content} />
                {/* {message.content} */}


                </div>
                <PureMessageActions
                  chatId={id || ''}
                  message={message}
                  isLoading={isLoading}
                  vote={undefined}
                  userId={userId || ''}
                />
              </div>
            )
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => {
                          setInput(e.target.value);
                          inputRef.current = e.target.value;
                        }}
              className="flex-1 p-2 border rounded"
              placeholder="Type your message..."
              disabled={isLoading || isReadonly}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              disabled={isLoading || isReadonly}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
        {/* These buttons simulate receiving a stream chunk and finishing the stream
        <div className="flex gap-2 p-4">
          <button onClick={simulateStreamChunk} className="px-4 py-2 bg-green-500 text-white rounded">
            Simulate Chunk
          </button>
          <button onClick={simulateStreamFinish} className="px-4 py-2 bg-red-500 text-white rounded">
            Simulate Finish
          </button>
        </div> */}
      </div>
    </div>
  );
}