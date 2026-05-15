'use client';

import { useState } from 'react';
import { ai } from './ai';
import { GenerateContentResponse } from '@google/genai';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  thought?: string;
}

export function useTutorAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (input: string) => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          ...messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: "You are LearnOS Tutor, a minimalist cognitive guide. Help the user build knowledge by asking probing questions and explaining complex concepts simply. Focus on structural understanding and semantic links.",
        }
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.text || "I'm sorry, I couldn't generate a response.",
        thought: response.candidates?.[0]?.content?.parts?.find(p => p.thought)?.text || ""
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("TutorAgent Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, sendMessage };
}
