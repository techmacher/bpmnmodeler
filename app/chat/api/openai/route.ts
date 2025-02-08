"use server";
import { auth } from '@/app/(auth)/auth';
import { systemPrompt, createChatCompletion } from '@/lib/ai';
import { persistChatMessages } from '@/lib/db/queries';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { request } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest, res: NextResponse) { // Use Request from next/server
//   try{
//   const session = await auth(
//     req as unknown as NextApiRequest,
//     {
//       ...res,
//       getHeader: (name: string) => res.headers?.get(name),
//       setHeader: (name: string, value: string) => res.headers?.set(name, value),
//     } as unknown as NextApiResponse); // No response needed

//     if (!session?.user?.id) {
//       return new Response('Unauthorized', { status: 401 });
//     }

//     const json = await req.json();
//     const {  model, diagram, messages, chatId } = json;
//     if (!chatId) {
//       return new Response('Chat ID is required', { status: 400 });
//     }    
    

//     // Build the complete conversation state using the previous messages
//     // and appending the new user prompt.
//     const conversation = [
//       { role: 'system', content: systemPrompt },
//       ...messages, // existing conversation state
//       // { role: 'user', content: prompt }
//     ];

//     const aiResponse = await createChatCompletion({
//       model: model || 'gpt-3.5-turbo',
//       messages: conversation,
//       max_tokens: 1500,
//       stream: true,
//     });

//     // If streaming, process the body as a stream and forward tokens to the client
//   if (!aiResponse.body) {
//     throw new Error('No response body');
//   }

//   // Create a ReadableStream to transform delta events
//   const stream = new ReadableStream({
//     async start(controller) {
//       const reader = aiResponse.body!.getReader();
//       const decoder = new TextDecoder('utf-8');
//       let fullAssistantMessage = '';
//       let buffer = '';
  
//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;
//         // Append new chunk to buffer
//         buffer += decoder.decode(value, { stream: true });
//         // Split buffer into lines
//         const lines = buffer.split('\n');
//         // The last element might be incomplete so keep it in the buffer
//         buffer = lines.pop() || '';
  
//         for (const line of lines) {
//           const trimmedLine = line.trim();
//           if (!trimmedLine) continue;
//           if (trimmedLine === 'data: [DONE]') continue;
//           if (!trimmedLine.startsWith('data: ')) continue;
//           const jsonStr = trimmedLine.substring(6); // remove "data: " prefix
//           try {
//             const json = JSON.parse(jsonStr);
//             const delta = json.choices[0].delta;
//             const textChunk = delta.content || '';
//             fullAssistantMessage += textChunk;
//             // Forward the delta so that the DataStreamHandler client can update in realtime.
//             controller.enqueue(textChunk);
//           } catch (err) {
//             console.error('Failed to parse delta', err, trimmedLine);
//           }
//         }
//       }
  
//       // If any leftover exists in the buffer, try processing it.
//       if (buffer.trim() && buffer.startsWith('data: ')) {
//         try {
//           const json = JSON.parse(buffer.substring(6));
//           const delta = json.choices[0].delta;
//           const textChunk = delta.content || '';
//           fullAssistantMessage += textChunk;
//           controller.enqueue(textChunk);
//         } catch (err) {
//           console.error('Failed to parse leftover delta', err, buffer);
//         }
//       }
//       const lastMessage = messages[messages.length - 1];
//       fullAssistantMessage = fullAssistantMessage.trim();
//       console.log('lastMessage', lastMessage);
//       console.log('Full assistant message:', fullAssistantMessage);
//       controller.close();

//       // Once the stream has finished, persist the full assistant message along with the user prompt.
//       await persistChatMessages([
//         { chatId, role: 'user', content: lastMessage.content },
//         { chatId, role: 'assistant', content: fullAssistantMessage }
//       ]);
//     }
//   });

//   // Return a streaming response to the client so that the DataStreamHandler receives deltas in realtime
//   return new Response(stream);

//   } catch (error) {
//     console.error(error);
//     return new Response('Error fetching response from OpenAI', { status: 500 });
//   }
// }



export async function POST(req: NextRequest, res: NextResponse) { // Use Request from next/server
  try{
    const maxDuration = 30;
    const session = await auth(
    req as unknown as NextApiRequest,
    {
      ...res,
      getHeader: (name: string) => res.headers?.get(name),
      setHeader: (name: string, value: string) => res.headers?.set(name, value),
    } as unknown as NextApiResponse); // No response needed

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const {  model, diagram, messages, chatId } = json;
    if (!chatId) {
      return new Response('Chat ID is required', { status: 400 });
    }    
    
    const conversation = [
            { role: 'system', content: systemPrompt },
            ...messages, // existing conversation state
            // { role: 'user', content: prompt }
          ];

    const result = streamText({
      model: openai(model),
      messages: conversation,
    });

    return result.toDataStreamResponse();

  }
  catch (error) {
    console.error(error);
    return new Response('Error fetching response from OpenAI', { status: 500 });
  }
}
