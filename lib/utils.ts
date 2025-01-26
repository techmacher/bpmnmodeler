import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Message } from "ai";
import type { Message as DbMessage } from "./db/schema";

// Tailwind class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// SWR fetcher
export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};

// Message conversion utilities
export function convertToUIMessages(messages: DbMessage[]): { id: string; role: 'user' | 'assistant'; content: string; createdAt?: Date }[] {
  return messages.map(msg => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
    createdAt: msg.createdAt
  }));
}

export function sanitizeUIMessages(messages: Message[]): Message[] {
  return messages.map(msg => ({
    id: msg.id,
    role: msg.role,
    content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
  }));
}

// Date formatting
export function formatDate(date: Date | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

// Message ID extraction from annotations
export function getMessageIdFromAnnotations(message: { id: string }): string {
  return message.id;
}

// Document timestamp utilities
export function getDocumentTimestampByIndex(documents: any[], index: number): Date | null {
  if (!documents || !documents[index]) return null;
  return documents[index].createdAt;
}

// Error handling
export function isErrorResponse(response: any): response is { error: string } {
  return response && typeof response.error === 'string';
}

// Type guards
export function isValidVisibility(value: unknown): value is 'public' | 'private' {
  return value === 'public' || value === 'private';
}

export function isValidRole(value: unknown): value is 'user' | 'assistant' {
  return value === 'user' || value === 'assistant';
}

export function isValidVoteValue(value: unknown): value is 'up' | 'down' {
  return value === 'up' || value === 'down';
}

// URL utilities
export function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

// Delay utility for animations/transitions
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mobile detection
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
}

// Safe JSON parse
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// UUID generation
export function generateUUID(): string {
  return crypto.randomUUID();
}
