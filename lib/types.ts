import type { Message } from 'ai';
import type { Chat, Diagram, Message as DbMessage, User, Vote } from './db/schema';

// Form Types
export interface FormState {
  error?: string;
  success?: boolean;
}

// Auth Types
export interface AuthUser extends User {
  id: string;
  email: string;
  name: string;
}

// UI Types
export interface UIMessage extends Message {
  id: string;
  createdAt?: Date;
  votes?: Vote[];
}

export interface UIChat extends Chat {
  messages: DbMessage[];
  diagram?: Diagram;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

// Pagination Types
export interface PaginationParams {
  cursor?: Date;
  limit?: number;
}

// Vote Types
export interface VoteRequest {
  messageId: string;
  value: 'up' | 'down';
}

// Chat Types
export interface ChatRequest {
  title: string;
  diagramId?: string;
  visibility?: 'public' | 'private';
}

// Document Types
export interface DocumentRequest {
  name: string;
  xml: string;
}

// Block Types
export type BlockKind = 'text' | 'code';

export interface Block {
  id: string;
  title: string;
  kind: BlockKind;
  content: string;
  createdAt: Date;
  userId: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';
