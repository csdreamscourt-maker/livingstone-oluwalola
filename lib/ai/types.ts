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
  /** Hosted URL (OpenAI-style providers return this — a fetchable, often temporary URL). */
  url?: string;
  /** Raw base64 image data (NVIDIA's genai endpoints return this instead of a URL). */
  base64?: string;
  /** MIME type of the image data — defaults to image/png when omitted. */
  contentType?: string;
  model: string;
  provider: string;
};

export type ConnectionTestResult = {
  ok: boolean;
  message: string;
};

export type EmbeddingResult = {
  embedding: number[];
  model: string;
  provider: string;
};

export interface ProviderClient {
  chatCompletion(model: string, params: ChatCompletionParams): Promise<ChatCompletionResult>;
  generateImage?(model: string, params: ImageGenerationParams): Promise<ImageGenerationResult>;
  createEmbedding?(model: string, text: string): Promise<EmbeddingResult>;
  testConnection(model: string): Promise<ConnectionTestResult>;
}
