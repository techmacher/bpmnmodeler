'use client';

import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  id?: string;
  className?: string;
  initialMessages?: Message[];
  selectedModelId?: string;
  selectedVisibilityType?: 'public' | 'private';
  isReadonly?: boolean;
}

export default function Chat({
  id,
  className,
  initialMessages = [],
  selectedModelId,
  selectedVisibilityType = 'private',
  isReadonly = false
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      // Simulated API call
      const response = await new Promise<Message>(resolve => 
        setTimeout(() => resolve({
          id: Date.now().toString(),
          role: 'assistant',
          content: 'This is a simulated response'
        }), 1000)
      );

      setMessages(prev => [...prev, response]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map(message => (
            <div key={message.id} className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
      </div>
    </div>
  );
}
