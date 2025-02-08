import { auth } from '@/app/(auth)/auth';
import { getVotesByChatId, voteMessage } from '@/lib/db/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return new Response('chatId is required', { status: 400 });
  }

  // For development, use a default session
  const votes = await getVotesByChatId(chatId);

  return Response.json(votes, { status: 200 });
}

export async function PATCH(request: Request) {
  const {
    chatId,
    messageId,
    type,
    userId
  }: { chatId: string; messageId: string; type: 'up' | 'down'; userId: string } =
    await request.json();

  if (!chatId || !messageId || !type) {
    return new Response('messageId and type are required', { status: 400 });
  }

  // For development, use a default session
  await voteMessage({
    chatId,
    messageId,
    value: type,
    userId
  });

  return new Response('Message voted', { status: 200 });
}
