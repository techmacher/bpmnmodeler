'use client';

import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  modelerRef: React.MutableRefObject<any>;
  initialMessages?: Message[];
}

export function Chat({ modelerRef, initialMessages = [] }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to chat
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Send to API and get response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content
      };
      setMessages(prev => [...prev, aiMessage]);

      // Handle BPMN updates if needed
      if (modelerRef?.current && data.content) {
        if (data.content.includes('<?xml') && data.content.includes('<bpmn:definitions')) {
          try {
            await modelerRef.current.importXML(data.content);
          } catch (err) {
            console.error("Error importing AI BPMN:", err);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-50 ml-4' 
                : 'bg-gray-50 mr-4'
            }`}
          >
            <div className="text-sm font-medium mb-1">
              {message.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <div className="text-gray-700 whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="p-4 bg-gray-50 mr-4 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <button 
              type="button"
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Attach file"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-1 ${
                input.trim() && !isLoading
                  ? 'text-blue-500 hover:text-blue-600'
                  : 'text-gray-400'
              }`}
              title="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Drag and drop files to add them to your message</span>
          <button type="button" className="text-blue-500 hover:text-blue-600">
            View prompts
          </button>
        </div>
      </form>
    </div>
  );
}
