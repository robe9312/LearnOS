import { useState } from 'react';

interface ImprovementResult {
  analysis: string;
  suggestions: { version: number; content: string; reason: string }[];
  nextSteps: string[];
}

export function useSelfImprovement() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const improve = async (content: string, context?: any, mode = 'improve'): Promise<ImprovementResult | null> => {
    setIsProcessing(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/self-improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, context, mode }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to improve content');
      }

      const { data } = await res.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return { improve, isProcessing, error };
}
