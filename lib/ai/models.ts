import type { LanguageModelV1 as ProviderLanguageModelV1 } from '@ai-sdk/provider';

export interface LanguageModelV1 extends ProviderLanguageModelV1 {
  id: string;
  label: string;
  description?: string;
}

export const models: LanguageModelV1[] = [
  {
    id: 'gpt-4',
    specificationVersion: 'v1',
    provider: 'openai',
    modelId: 'gpt-4',
    defaultObjectGenerationMode: 'json',
    label: 'GPT-4',
    description: 'Most capable model, best at following instructions',
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

export const DEFAULT_MODEL_NAME = 'gpt-4';

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
