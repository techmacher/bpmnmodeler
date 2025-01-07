import { and, desc, eq, lt } from 'drizzle-orm';
import { db } from './index';
import { chat, diagram, message } from './schema';
import type { Message } from 'ai';

export async function getChatById({ id }: { id: string }) {
  const [result] = await db
    .select()
    .from(chat)
    .where(eq(chat.id, id))
    .limit(1)
    .execute();

  return result;
}

export async function getDiagramByChatId({ chatId }: { chatId: string }) {
  const [result] = await db
    .select({
      diagrams: diagram,
      chats: chat,
    })
    .from(diagram)
    .innerJoin(chat, eq(chat.diagramId, diagram.id))
    .where(eq(chat.id, chatId))
    .limit(1)
    .execute();

  return result.diagrams;
}

export async function createChatWithDiagram({
  userId,
  title,
  initialXml,
}: {
  userId: string;
  title: string;
  initialXml: string;
}) {
  const [newDiagram] = await db
    .insert(diagram)
    .values({
      name: title,
      xml: initialXml,
      userId,
    })
    .returning()
    .execute();

  const [newChat] = await db
    .insert(chat)
    .values({
      title,
      userId,
      diagramId: newDiagram.id,
    })
    .returning()
    .execute();

  return {
    chatId: newChat.id,
    diagramId: newDiagram.id,
  };
}

export async function updateDiagram({
  chatId,
  xml,
}: {
  chatId: string;
  xml: string;
}) {
  const chatResult = await db
    .select()
    .from(chat)
    .where(eq(chat.id, chatId))
    .limit(1)
    .execute();

  if (!chatResult[0]?.diagramId) return null;

  const [updatedDiagram] = await db
    .update(diagram)
    .set({ xml })
    .where(eq(diagram.id, chatResult[0].diagramId))
    .returning()
    .execute();

  return updatedDiagram;
}

export async function renameChatAndDiagram({
  chatId,
  newTitle,
}: {
  chatId: string;
  newTitle: string;
}) {
  const [chatResult] = await db
    .select({
      chat: chat,
      diagram: diagram,
    })
    .from(chat)
    .innerJoin(diagram, eq(chat.diagramId, diagram.id))
    .where(eq(chat.id, chatId))
    .limit(1)
    .execute();

  if (!chatResult) return null;

  await db.transaction(async (tx) => {
    await tx
      .update(chat)
      .set({ title: newTitle })
      .where(eq(chat.id, chatId))
      .execute();

    await tx
      .update(diagram)
      .set({ name: newTitle })
      .where(eq(diagram.id, chatResult.diagram.id))
      .execute();
  });

  return {
    chatId,
    title: newTitle,
  };
}

export async function saveMessages({
  messages: messagesToSave,
}: {
  messages: Array<Message & { chatId: string; createdAt: Date }>;
}) {
  const [savedMessage] = await db
    .insert(message)
    .values(messagesToSave)
    .returning()
    .execute();

  return savedMessage;
}

export async function deleteChatAndDiagram({ chatId }: { chatId: string }) {
  // Messages and diagram will be cascade deleted due to foreign key constraints
  await db.delete(chat).where(eq(chat.id, chatId)).execute();
}

export async function getMessagesByChat({
  chatId,
  cursor,
  limit = 10,
}: {
  chatId: string;
  cursor?: Date;
  limit?: number;
}) {
  const conditions = [eq(message.chatId, chatId)];
  if (cursor) {
    conditions.push(lt(message.createdAt, cursor));
  }

  return db
    .select()
    .from(message)
    .where(and(...conditions))
    .orderBy(desc(message.createdAt))
    .limit(limit)
    .execute();
}

export async function getChats({
  userId,
  cursor,
  limit = 10,
}: {
  userId: string;
  cursor?: Date;
  limit?: number;
}) {
  const conditions = [eq(chat.userId, userId)];
  if (cursor) {
    conditions.push(lt(chat.createdAt, cursor));
  }

  return db
    .select({
      chat: chat,
      diagram: diagram,
    })
    .from(chat)
    .innerJoin(diagram, eq(chat.diagramId, diagram.id))
    .where(and(...conditions))
    .orderBy(desc(chat.createdAt))
    .limit(limit)
    .execute();
}
