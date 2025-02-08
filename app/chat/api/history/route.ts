import { auth,authConfig } from '@/app/(auth)/auth';
import { getChatsByUserId } from '@/lib/db/queries';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) { // Use Request from next/server
  const session = await auth(
    req as unknown as NextApiRequest,
    {
      ...res,
      getHeader: (name: string) => res.headers?.get(name),
      setHeader: (name: string, value: string) => res.headers?.set(name, value),
    } as unknown as NextApiResponse); // No response needed


  if (!session || !session.user) {
    return new NextResponse('Unauthorized!', { status: 401 }); // Use NextResponse
  }

  try {
    const chats = await getChatsByUserId(session.user.id); // session.user.id is already a string
    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return new NextResponse('Error fetching chats', { status: 500 }); // Handle errors
  }
}
