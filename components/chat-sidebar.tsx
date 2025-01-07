'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Chat {
  chat: {
    id: string;
    title: string;
    createdAt: Date;
    userId: string;
    diagramId: string;
  };
  diagram: {
    id: string;
    name: string;
    xml: string;
    createdAt: Date;
    userId: string;
  };
}

const TEMPLATES = [
  { id: 'banking', name: 'Banking' },
  { id: 'insurance', name: 'Insurance' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'manufacturing', name: 'Manufacturing' },
  { id: 'retail', name: 'Retail' },
  { id: 'technology', name: 'Technology' },
];

export function ChatSidebar() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chat');
      if (!response.ok) throw new Error('Failed to fetch chats');
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' }),
      });

      if (!response.ok) throw new Error('Failed to create chat');
      const { chatId } = await response.json();
      router.push(`/chat/${chatId}`);
      fetchChats();
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleRename = async (chatId: string, newTitle: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, title: newTitle }),
      });

      if (!response.ok) throw new Error('Failed to rename chat');
      setEditingId(null);
      fetchChats();
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  };

  const handleDelete = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat?id=${chatId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete chat');
      fetchChats();
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const startEditing = (chat: Chat) => {
    setEditingId(chat.chat.id);
    setEditingTitle(chat.chat.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      handleRename(chatId, editingTitle);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-4">
        <Button 
          onClick={createNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Recent</h3>
          {chats.map((chat) => (
            <div key={chat.chat.id} className="group relative flex items-center mb-1">
              {editingId === chat.chat.id ? (
                <Input
                  autoFocus
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => handleRename(chat.chat.id, editingTitle)}
                  onKeyDown={(e) => handleKeyDown(e, chat.chat.id)}
                  className="bg-gray-800 text-white border-gray-700 text-sm py-1"
                />
              ) : (
                <Link 
                  href={`/chat/${chat.chat.id}`}
                  className="flex-1 py-2 px-2 text-sm rounded-md hover:bg-gray-800"
                >
                  {chat.chat.title}
                </Link>
              )}
              <div className="absolute right-2 hidden group-hover:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-white"
                  onClick={() => startEditing(chat)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-white hover:bg-red-900/50"
                  onClick={() => handleDelete(chat.chat.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 mt-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Templates</h3>
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => createNewChat()}
              className="w-full text-left py-2 px-2 text-sm rounded-md hover:bg-gray-800"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
