import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const diagram = pgTable('diagrams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  xml: text('xml').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: text('user_id').notNull()
});

export const chat = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: text('user_id').notNull(),
  diagramId: uuid('diagram_id').references(() => diagram.id, { onDelete: 'cascade' })
});

export const message = pgTable('Message', {
  id: uuid('id').primaryKey(),
  chatId: uuid('chatId').references(() => chat.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});
