'use client';

import { useState, useCallback } from 'react';
import { groq } from './groq';
import { Module } from './types';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  thought?: string;
}

interface TutorContext {
  courseTitle?: string;
  curriculum?: Module[];
}

export function useTutorAgent(context?: TutorContext) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);

    try {
      const systemInstruction = `
        You are LearnOS Tutor, a minimalist cognitive guide for the course "${context?.courseTitle || 'General Knowledge'}".
        
        Curriculum Context:
        ${JSON.stringify(context?.curriculum || [], null, 2)}

        Guidelines:
        1. Help the user master the specific goals of the curriculum.
        2. Ask probing questions to verify structural understanding.
        3. Explain complex concepts simply using metaphors.
        4. If the user asks something outside the scope, gently redirect them back to the learning path.
        5. Wrap your internal reasoning in <thought> tags before responding.
      `;

      const groqMessages = [
        { role: 'system', content: systemInstruction },
        ...updatedMessages.map(m => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content
        }))
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages: groqMessages as any,
        model: "llama-3.3-70b-versatile",
      });

      const responseText = chatCompletion.choices[0]?.message?.content || "";
      
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
  }, [messages, context]);

  return { messages, loading, error, sendMessage };
}
