import {auth} from '@/app/(auth)/auth';
import { createChatWithDiagram, deleteChatAndDiagram, getChats, renameChatAndDiagram } from '../../../../lib/db/queries';
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';

const defaultBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js" exporterVersion="12.0.0">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="150" y="100" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const session = await auth(
      req as unknown as NextApiRequest,
      {
        ...res,
        getHeader: (name: string) => res.headers?.get(name),
        setHeader: (name: string, value: string) => res.headers?.set(name, value),
      } as unknown as NextApiResponse
    );

    console.log('session', session);
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const { title } = json;

    if (!title) {
      return new Response('Title is required', { status: 400 });
    }

    const { chatId, diagramId } = await createChatWithDiagram({
      userId: session.user.id,
      title,
      initialXml: defaultBpmnXml,
    });

    return NextResponse.json({ chatId, diagramId });
  } catch (error) {
    console.error(error);
    return new Response('Error creating chat and diagram', { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const session = await auth(
      req as unknown as NextApiRequest,
      {
        ...res,
        getHeader: (name: string) => res.headers?.get(name),
        setHeader: (name: string, value: string) => res.headers?.set(name, value),
      } as unknown as NextApiResponse
    );
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const limit = searchParams.get('limit');

    const chats = await getChats({
      userId: session.user.id,
      cursor: cursor ? new Date(cursor) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error(error);
    return new Response('Error fetching chats', { status: 500 });
  }
}

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const session = await auth(
      req as unknown as NextApiRequest,
      {
        ...res,
        getHeader: (name: string) => res.headers?.get(name),
        setHeader: (name: string, value: string) => res.headers?.set(name, value),
      } as unknown as NextApiResponse
    );
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const { chatId, title } = json;

    if (!chatId || !title) {
      return new Response('Chat ID and title are required', { status: 400 });
    }

    const result = await renameChatAndDiagram({
      chatId,
      newTitle: title,
    });

    if (!result) {
      return new Response('Chat not found', { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return new Response('Error renaming chat and diagram', { status: 500 });
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {

    const session = await auth(
      req as unknown as NextApiRequest,
      {
        ...res,
        getHeader: (name: string) => res.headers?.get(name),
        setHeader: (name: string, value: string) => res.headers?.set(name, value),
      } as unknown as NextApiResponse
    );

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('id');

    if (!chatId) {
      return new Response('Chat ID is required', { status: 400 });
    }

    await deleteChatAndDiagram({ chatId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return new Response('Error deleting chat and diagram', { status: 500 });
  }
}
