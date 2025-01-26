import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations, type InferSelectModel } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// User Schema
export const user = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Diagram Schema
export const diagram = pgTable('diagrams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  xml: text('xml').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull()
});

// Chat Schema
export const chat = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  diagramId: uuid('diagram_id').references(() => diagram.id, { onDelete: 'cascade' }),
  visibility: text('visibility').$type<'public'|'private'>().notNull().default('private')
});

// Message Schema
export const message = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id').references(() => chat.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').$type<'user'|'assistant'>().notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Vote Schema
export const vote = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  messageId: uuid('message_id').references(() => message.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  value: text('value').$type<'up'|'down'>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  diagrams: many(diagram),
  chats: many(chat),
  votes: many(vote),
}));

export const diagramRelations = relations(diagram, ({ one, many }) => ({
  user: one(user, {
    fields: [diagram.userId],
    references: [user.id],
  }),
  chats: many(chat),
}));

export const chatRelations = relations(chat, ({ one, many }) => ({
  user: one(user, {
    fields: [chat.userId],
    references: [user.id],
  }),
  diagram: one(diagram, {
    fields: [chat.diagramId],
    references: [diagram.id],
  }),
  messages: many(message),
}));

export const messageRelations = relations(message, ({ one, many }) => ({
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.id],
  }),
  votes: many(vote),
}));

export const voteRelations = relations(vote, ({ one }) => ({
  user: one(user, {
    fields: [vote.userId],
    references: [user.id],
  }),
  message: one(message, {
    fields: [vote.messageId],
    references: [message.id],
  }),
}));

// Zod Schemas
export const insertUserSchema = createInsertSchema(user);
export const selectUserSchema = createSelectSchema(user);

export const insertDiagramSchema = createInsertSchema(diagram);
export const selectDiagramSchema = createSelectSchema(diagram);

export const insertChatSchema = createInsertSchema(chat);
export const selectChatSchema = createSelectSchema(chat);

export const insertMessageSchema = createInsertSchema(message);
export const selectMessageSchema = createSelectSchema(message);

export const insertVoteSchema = createInsertSchema(vote);
export const selectVoteSchema = createSelectSchema(vote);

// Base Types
export type User = InferSelectModel<typeof user>;
export type NewUser = z.infer<typeof insertUserSchema>;

export type Chat = InferSelectModel<typeof chat>;
export type NewChat = z.infer<typeof insertChatSchema>;

export type Diagram = InferSelectModel<typeof diagram>;
export type NewDiagram = z.infer<typeof insertDiagramSchema>;

export type Message = InferSelectModel<typeof message>;
export type NewMessage = z.infer<typeof insertMessageSchema>;

export type Vote = InferSelectModel<typeof vote>;
export type NewVote = z.infer<typeof insertVoteSchema>;

// Extended Types with Relations
export type UserWithRelations = User & {
  diagrams: Diagram[];
  chats: Chat[];
  votes: Vote[];
};

export type ChatWithRelations = Chat & {
  user: User;
  diagram?: Diagram;
  messages: Message[];
};

export type MessageWithRelations = Message & {
  chat: Chat;
  votes: Vote[];
};

// UI Types
export interface UISuggestion {
  id: string;
  suggestedText: string;
  description: string;
  type: 'code' | 'text';
}

// Document Types (for compatibility)
export type Document = Diagram;
export type NewDocument = NewDiagram;

// Vote Types with UI State
export interface VoteWithState extends Vote {
  isUpvoted: boolean;
}

export type UIVote = {
  id: string;
  messageId: string;
  chatId: string;
  isUpvoted: boolean;
};

// Suggestion Type (for compatibility)
export type Suggestion = UISuggestion;

// UUID Generator
export function generateUUID(): string {
  return crypto.randomUUID();
}
