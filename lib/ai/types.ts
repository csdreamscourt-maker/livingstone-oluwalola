export type ChatRole = 'system' | 'user' | 'assistant';

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatCompletionParams = {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'json_object';
};

export type ChatCompletionResult = {
  content: string;
  model: string;
  provider: string;
};

export type ImageGenerationParams = {
  prompt: string;
  size?: string;
};

export type ImageGenerationResult = {
  url: string;
  model: string;
  provider: string;
};

export type ConnectionTestResult = {
  ok: boolean;
  message: string;
};

export interface ProviderClient {
  chatCompletion(model: string, params: ChatCompletionParams): Promise<ChatCompletionResult>;
  generateImage?(model: string, params: ImageGenerationParams): Promise<ImageGenerationResult>;
  testConnection(model: string): Promise<ConnectionTestResult>;
}
