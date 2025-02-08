import { CoreMessage, CoreSystemMessage, CoreUserMessage, LanguageModel, LanguageModelV1 } from 'ai';
import { customModel } from './models';

export * from './models';
export * from './prompts';
export * from './custom-middleware';

// lib/ai/index.ts
export async function createChatCompletion(payload: {
  model: LanguageModelV1;
  messages: CoreMessage[];
  max_tokens: number;
  stream: boolean;
}): Promise<any> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error: ${errText}`);
  }

  if (payload.stream) {
    // Return the raw response so that the streaming can be handled downstream
    return response;
  }
  
  return response.json();
}

//implement generateText({
//     model: customModel('gpt-4o-mini'),
//     system: `\n
//     - you will generate a short title based on the first message a user begins a conversation with
//     - ensure it is not more than 80 characters long
//     - the title should be a summary of the user's message
//     - do not use quotes or colons`,
//     prompt: JSON.stringify(message),
//   });
export async function generateText(payload: {
  model: LanguageModelV1;
  system: string;
  prompt: string;
}): Promise<any> {
 // Build the complete conversation state using the previous messages
    // and appending the new user prompt.
    const conversation = [
      { role: 'system', content: payload.system },
      { role: 'user', content: payload.prompt }
    ];

    const AiPayload = {
        model: payload.model|| 'gpt-3.5-turbo',
        messages: conversation,
        max_tokens: 1500,
    }
  const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(AiPayload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error: ${errText}`);
  }

  const data = await response.json();

  return data.choices[0].message.content;
}