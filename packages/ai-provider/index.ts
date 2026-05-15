import { generateText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';

export type AIModelProvider = 'google' | 'groq';

export interface PromptOptions {
  provider?: AIModelProvider;
  model?: string;
  temperature?: number;
}

export class AIProvider {
  private defaultProvider: AIModelProvider = 'google';

  async chat(prompt: string, options: PromptOptions = {}) {
    const provider = options.provider || this.defaultProvider;
    const model = provider === 'google' 
      ? google('gemini-2.0-flash-exp') 
      : groq('llama-3.3-70b-specdec');

    const response = await generateText({
      model,
      prompt,
      temperature: options.temperature,
    });

    return response.text;
  }

  async getEmbedding(text: string) {
    const { embedding } = await embed({
      model: google.embedding('text-embedding-004'),
      value: text,
    });
    return embedding;
  }
}

export const aiProvider = new AIProvider();
