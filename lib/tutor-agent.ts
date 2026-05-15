'use client';

import { useState } from 'react';
import { ai } from './ai';

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
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        config: {
          systemInstruction: "You are LearnOS Tutor, a minimalist cognitive guide. Help the user build knowledge by asking probing questions and explaining complex concepts simply. Focus on structural understanding and semantic links. Wrap your internal reasoning in <thought> tags.",
        },
        history: history as any, // Cast as any if history starts with model or has other type mismatches
      });

      const result = await chat.sendMessage({ message: input });
      const responseText = result.text || "";
      
      // Extract thought if present (though gemini-2.0-flash doesn't natively use <thought> unless instructed)
      const thoughtMatch = responseText.match(/<thought>([\s\S]*?)<\/thought>/);
      const thought = thoughtMatch ? thoughtMatch[1].trim() : "";
      const content = responseText.replace(/<thought>[\s\S]*?<\/thought>/, "").trim();

      const assistantMessage: Message = {
        role: 'assistant',
        content: content || "I'm sorry, I couldn't generate a response.",
        thought: thought
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
