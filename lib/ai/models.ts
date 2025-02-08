import type { LanguageModelV1 as ProviderLanguageModelV1 } from '@ai-sdk/provider';

export interface LanguageModelV1 extends ProviderLanguageModelV1 {
  id: string;
  label: string;
  description?: string;
}

export const models: LanguageModelV1[] = [
  {
    id: 'gpt-4o-mini',
    specificationVersion: 'v1',
    provider: 'openai',
    modelId: 'gpt-4o-mini',
    defaultObjectGenerationMode: 'json',
    label: 'GPT-4o Mini',
    description: 'Optimized GPT-4 model variant with instruction-following capability.',
    doGenerate: async (options) => ({
      finishReason: 'stop',
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      rawCall: { rawPrompt: options.prompt, rawSettings: {} }
    }),
    doStream: async (options) => ({
      stream: new ReadableStream(),
      rawCall: { rawPrompt: options.prompt, rawSettings: {} }
    })
  },
  {
    id: 'gpt-3.5-turbo',
    specificationVersion: 'v1',
    provider: 'openai',
    modelId: 'gpt-3.5-turbo',
    defaultObjectGenerationMode: 'json',
    label: 'GPT-3.5 Turbo',
    description: 'A capable model, optimized for speed and cost efficiency.',
    doGenerate: async (options) => ({
      finishReason: 'stop',
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      rawCall: { rawPrompt: options.prompt, rawSettings: {} }
    }),
    doStream: async (options) => ({
      stream: new ReadableStream(),
      rawCall: { rawPrompt: options.prompt, rawSettings: {} }
    })
  },
  {
    id: 'text-embedding-3-small',
    specificationVersion: 'v1',
    provider: 'openai',
    modelId: 'text-embedding-3-small',
    defaultObjectGenerationMode: 'json',
    label: 'Text Embedding 3 Small',
    description: 'Optimized model for semantic embeddings, search, and recommendations.',
    doGenerate: async (options) => ({
      finishReason: 'stop',
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      rawCall: { rawPrompt: options.prompt, rawSettings: {} }
    }),
    doStream: async (options) => ({
      stream: new ReadableStream(),
      rawCall: { rawPrompt: options.prompt, rawSettings: {} }
    })
  }
];

export const DEFAULT_MODEL_NAME = 'gpt-3.5-turbo';

export function customModel(apiIdentifier: string): LanguageModelV1 {
  return {
    id: apiIdentifier,
    specificationVersion: 'v1',
    provider: 'custom',
    modelId: apiIdentifier,
    defaultObjectGenerationMode: 'json',
    label: `Custom (${apiIdentifier})`,
    description: 'Custom model configuration',
    doGenerate: async (options) => ({
      finishReason: 'stop',
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      rawCall: { rawPrompt: options.prompt, rawSettings: {} }
    }),
    doStream: async (options) => ({
      stream: new ReadableStream(),
      rawCall: { rawPrompt: options.prompt, rawSettings: {} }
    })
  };
}
