import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type Message, type CoreMessage } from 'ai';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function getMostRecentUserMessage(messages: CoreMessage[] | Message[]): Message | CoreMessage | undefined {
  return messages.length > 0 ? messages[messages.length - 1] : undefined;
}

export function sanitizeResponseMessages(messages: CoreMessage[] | Message[]): Message[] {
  return messages.filter((message) => {
    // Filter out messages that are tool calls without content
    if (message.role === 'assistant' && !message.content) {
      return false;
    }
    return true;
  }) as Message[];
}

// Helper function to convert CoreMessage to Message
export function convertCoreMessageToMessage(message: CoreMessage): Message {
  return {
    ...message,
    id: generateUUID(),
  };
}
