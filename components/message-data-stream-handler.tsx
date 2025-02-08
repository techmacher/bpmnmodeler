'use client';
import { Message as OriginalMessage, useChat } from 'ai/react';

export interface Message extends OriginalMessage {
  streaming?: boolean;
}
import { useEffect, useRef } from 'react';

type MessageDataStreamDelta = {
  type: 'text-delta' | 'finish';
  content: string;
};

export function MessageDataStreamHandler({ id }: { id: string }) {
  const { data: dataStream, messages, setMessages } = useChat({ 
            id ,  
            streamProtocol: 'text',
  });
  console.log("dataStream#############", dataStream);
  const lastProcessedIndex = useRef(-1);
  useEffect(() => { console.log("Updated dataStream", dataStream); }, [dataStream]);
  useEffect(() => {
    if (!dataStream?.length) return;

    // Get new delta events from the stream
    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    (newDeltas as MessageDataStreamDelta[]).forEach((delta: MessageDataStreamDelta) => {
        if (delta.type === 'text-delta') {
        // Check if there is an existing streaming assistant message
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && (lastMessage as any).streaming) {
          // Append new content to the current streaming message
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + delta.content,
          };
          setMessages((prev) => [...prev.slice(0, prev.length - 1), updatedMessage]);
        } else {
          // If no streaming message exists, create a new one with a streaming flag
          const newMessage: Message = {
            id: String(Date.now()),
            role: 'assistant',
            content: delta.content,
            streaming: true, // custom flag to indicate ongoing stream
          };
          setMessages((prev) => [...prev, newMessage]);
        }
      } else if (delta.type === 'finish') {
        // Mark the last assistant message as complete by removing the streaming flag
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && (lastMessage as any).streaming) {
          const updatedMessage = { ...lastMessage };
          delete (updatedMessage as any).streaming;
          setMessages((prev) => [...prev.slice(0, prev.length - 1), updatedMessage]);
        }
      }
    });
  }, [dataStream, messages, setMessages]);

  // This component renders nothing. It only updates the chat's message state.
  return null;
}