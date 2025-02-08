import { and, asc, desc, eq, gt, gte, lt } from 'drizzle-orm';
import { db } from './index';
import { chat, diagram, message, user, vote } from './schema';
import type {
  Chat,
  ChatWithRelations,
  Diagram,
  Message,
  NewChat,
  NewDiagram,
  NewMessage,
  NewUser,
  NewVote,
  User,
  UserWithRelations,
  Vote,
  VoteWithState,
  UISuggestion
} from './schema';

// User queries
export async function getUserById(id: string): Promise<User | undefined> {
  const [result] = await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .limit(1);
  return result;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const [result] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function createUser(data: NewUser): Promise<User> {
  const [result] = await db
    .insert(user)
    .values(data)
    .returning();
  return result;
}

export async function updateUser(id: string, data: Partial<NewUser>): Promise<User | undefined> {
  const [result] = await db
    .update(user)
    .set(data)
    .where(eq(user.id, id))
    .returning();
  return result;
}

// Diagram queries
export async function getDiagramById(id: string): Promise<Diagram | undefined> {
  const [result] = await db
    .select()
    .from(diagram)
    .where(eq(diagram.id, id))
    .limit(1);
  return result;
}

export async function getDocumentsById({ id }: { id: string }): Promise<Diagram[]> {
  return db
    .select()
    .from(diagram)
    .where(eq(diagram.id, id))
    .orderBy(desc(diagram.createdAt));
}

export async function saveDocument({
  id,
  content,
  title,
  kind,
  userId,
}: {
  id: string;
  content: string;
  title: string;
  kind: string;
  userId: string;
}): Promise<Diagram> {
  const [result] = await db
    .insert(diagram)
    .values({
      id,
      xml: content,
      name: title,
      userId,
    })
    .onConflictDoUpdate({
      target: diagram.id,
      set: {
        xml: content,
        name: title,
      },
    })
    .returning();
  return result;
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}): Promise<void> {
  await db
    .delete(diagram)
    .where(
      and(
        eq(diagram.id, id),
        lt(diagram.createdAt, timestamp)
      )
    );
}

export async function getUserDiagrams(userId: string): Promise<Diagram[]> {
  return db
    .select()
    .from(diagram)
    .where(eq(diagram.userId, userId))
    .orderBy(desc(diagram.createdAt));
}

export async function createDiagram(data: NewDiagram): Promise<Diagram> {
  const [result] = await db
    .insert(diagram)
    .values(data)
    .returning();
  return result;
}

// Chat queries
export async function getChatById(id: string): Promise<ChatWithRelations | undefined> {
  const [result] = await db.query.chat.findMany({
    where: eq(chat.id, id),
    with: {
      user: true,
      diagram: true,
      messages: true,
    },
    limit: 1,
  }) as [ChatWithRelations];
  return result;
}

export async function getChatsByUserId(userId: string): Promise<Chat[]> {
  return db
    .select()
    .from(chat)
    .where(eq(chat.userId, userId))
    .orderBy(desc(chat.createdAt));
}

export async function createChat(data: NewChat): Promise<Chat> {
  const [result] = await db
    .insert(chat)
    .values({
      ...data,
      visibility: data.visibility as 'public' | 'private'
    })
    .returning();
  return result;
}

export async function updateChat(id: string, data: Partial<NewChat>): Promise<Chat | undefined> {
  const [result] = await db
    .update(chat)
    .set({
      ...data,
      visibility: data.visibility as 'public' | 'private'
    })
    .where(eq(chat.id, id))
    .returning();
  return result;
}

export async function deleteChat(id: string): Promise<void> {
  await db.delete(chat).where(eq(chat.id, id));
}

// Message queries
export async function getMessagesByChatId(chatId: string): Promise<Message[]> {
  return db
    .select()
    .from(message)
    .where(eq(message.chatId, chatId))
    .orderBy(asc(message.createdAt), desc(message.role));
}

export async function persistChatMessages(data: NewMessage[]): Promise<Message[]> {
  const results = await db
    .insert(message)
    .values(data.map(d => ({
      ...d,
      role: d.role as 'user' | 'assistant'
    })))
    .returning();
  return results;
}

export async function createMessage(data: NewMessage): Promise<Message> {
  const [result] = await db
    .insert(message)
    .values({
      ...data,
      role: data.role as 'user' | 'assistant'
    })
    .returning();
  return result;
}

export async function deleteMessagesByChatId(chatId: string): Promise<void> {
  await db.delete(message).where(eq(message.chatId, chatId));
}
//delete messages newer than and including the message with the given id
export async function deleteMessageAndBeyondByChatIdAndMessageId(chatId: string, messageId: string): Promise<void> {
  const [result] = await db
                      .select()
                      .from(message)
                      .where(and(eq(message.chatId, chatId), eq(message.id, messageId))).limit(1);
  if (result) {
    await db
            .delete(message)
            .where(
                  and(
                      eq(message.chatId, chatId), 
                      gte(message.createdAt, result.createdAt)
                    )
                  );
  }
}

// Vote queries
export async function getVotesByMessageId(messageId: string): Promise<VoteWithState[]> {
  const votes = await db
    .select()
    .from(vote)
    .where(eq(vote.messageId, messageId));
  
  return votes.map(vote => ({
    ...vote,
    isUpvoted: vote.value === 'up'
  }));
}

export async function createVote(data: NewVote): Promise<Vote> {
  const [result] = await db
    .insert(vote)
    .values({
      ...data,
      value: data.value as 'up' | 'down'
    })
    .returning();
  return result;
}

export async function updateVote(id: string, data: Partial<NewVote>): Promise<Vote | undefined> {
  const [result] = await db
    .update(vote)
    .set({
      ...data,
      value: data.value as 'up' | 'down'
    })
    .where(eq(vote.id, id))
    .returning();
  return result;
}

export async function deleteVote(id: string): Promise<void> {
  await db.delete(vote).where(eq(vote.id, id));
}

// Pagination helpers
export async function getMessagesByChat({
  chatId,
  cursor,
  limit = 10,
}: {
  chatId: string;
  cursor?: Date;
  limit?: number;
}): Promise<Message[]> {
  const conditions = [eq(message.chatId, chatId)];
  if (cursor) {
    conditions.push(lt(message.createdAt, cursor));
  }

  return db
    .select()
    .from(message)
    .where(and(...conditions))
    .orderBy(desc(message.createdAt))
    .limit(limit);
}

export async function getChats({
  userId,
  cursor,
  limit = 10,
}: {
  userId: string;
  cursor?: Date;
  limit?: number;
}): Promise<ChatWithRelations[]> {
  const conditions = [eq(chat.userId, userId)];
  if (cursor) {
    conditions.push(lt(chat.createdAt, cursor));
  }

  const results = await db.query.chat.findMany({
    where: and(...conditions),
    with: {
      user: true,
      diagram: true,
    },
    limit,
    orderBy: desc(chat.createdAt),
  }) as ChatWithRelations[];

  return results;
}

// Combined operations
export async function createChatWithDiagram({
  userId,
  title,
  initialXml,
}: {
  userId: string;
  title: string;
  initialXml: string;
}): Promise<{ chatId: string; diagramId: string }> {
  const [newDiagram] = await db
    .insert(diagram)
    .values({
      name: title,
      xml: initialXml,
      userId,
    })
    .returning();

  const [newChat] = await db
    .insert(chat)
    .values({
      title,
      userId,
      diagramId: newDiagram.id,
    })
    .returning();

  return {
    chatId: newChat.id,
    diagramId: newDiagram.id,
  };
}

export async function deleteChatAndDiagram({
  chatId,
}: {
  chatId: string;
}): Promise<void> {
  const [chatToDelete] = await db
    .select()
    .from(chat)
    .where(eq(chat.id, chatId))
    .limit(1);

  if (chatToDelete?.diagramId) {
    await db.delete(diagram).where(eq(diagram.id, chatToDelete.diagramId));
  }
  await deleteChat(chatId);
}

export async function renameChatAndDiagram({
  chatId,
  newTitle,
}: {
  chatId: string;
  newTitle: string;
}): Promise<Chat | undefined> {
  const [chatToUpdate] = await db
    .select()
    .from(chat)
    .where(eq(chat.id, chatId))
    .limit(1);

  if (!chatToUpdate) {
    return undefined;
  }

  if (chatToUpdate.diagramId) {
    await db
      .update(diagram)
      .set({ name: newTitle })
      .where(eq(diagram.id, chatToUpdate.diagramId));
  }

  return updateChat(chatId, { title: newTitle });
}

// Additional query functions
export async function getVotesByChatId(chatId: string): Promise<VoteWithState[]> {
  const votes = await db
    .select()
    .from(vote)
    .where(eq(vote.messageId, chatId));
  
  return votes.map(vote => ({
    ...vote,
    isUpvoted: vote.value === 'up'
  }));
}

export async function voteMessage(data: { chatId: string; messageId: string; value: 'up' | 'down' , userId: string;}): Promise<Vote> {
  const [result] = await db
    .insert(vote)
    .values({
      messageId: data.messageId,
      userId: data.userId, // Using chatId as userId for now
      value: data.value
    })
    .returning();
  return result;
}

export async function getSuggestionsByDocumentId(documentId: string): Promise<UISuggestion[]> {
  // This would typically query a suggestions table, but for now return empty array
  return [];
}

// Export schemas for validation
export {
  insertUserSchema,
  selectUserSchema,
  insertChatSchema,
  selectChatSchema,
  insertDiagramSchema,
  selectDiagramSchema,
  insertMessageSchema,
  selectMessageSchema,
  insertVoteSchema,
  selectVoteSchema,
} from './schema';
