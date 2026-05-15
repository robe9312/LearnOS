'use client';

import { useState, useCallback } from 'react';
import { groq } from './groq';
import { Course, Module, UserProgress } from './types';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  thought?: string;
}

interface TutorContext {
  course?: Course;
  progress?: UserProgress | null;
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

    const activeModule = context?.course?.curriculum.find(m => m.id === context?.progress?.currentModuleId);
    const activeLesson = activeModule?.lessons.find(l => l.id === context?.progress?.currentLessonId);

    try {
      const systemInstruction = `
        You are LearnOS Tutor, an Adaptive Execution Engine guide.
        Course: "${context?.course?.title || 'General Knowledge'}"
        Current Progress:
        - Module: ${activeModule?.title || 'Unknown'}
        - Lesson: ${activeLesson?.title || 'Unknown'}
        - Mastery Score: ${context?.progress?.masteryScore || 0}%
        - Detected Gaps: ${JSON.stringify(context?.progress?.gapAreas || [])}

        Your Role:
        1. Be "State-Aware": Know exactly where the user is and what they haven't mastered yet.
        2. "Gap-Aware": If a user shows confusion in a specific area, focus deeply on that gap.
        3. "Execution-Oriented": Help them move from current state to "MASTERED".
        
        Guidelines:
        - Use metaphors to simplify complexity.
        - Verify understanding with probing questions.
        - If they are "BLOCKED" (many gaps), slow down and simplify.
        - Wrap your internal reasoning in <thought> tags.
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
