import { aiProvider } from '../ai-provider';
import { SkillNode } from '../ontology';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export class AssessmentEngine {
  async generateQuiz(node: SkillNode, count: number = 3): Promise<Question[]> {
    const prompt = `Genera un quiz de ${count} preguntas sobre "${node.title}" (${node.description}). 
    Formato JSON: [{ "id": "uuid", "text": "...", "options": ["...", "..."], "correctAnswer": 0, "explanation": "..." }]`;
    
    const response = await aiProvider.chat(prompt, { temperature: 0.2 });
    try {
      return JSON.parse(response);
    } catch {
      return []; // Fallback
    }
  }

  calculateMastery(previousLevel: number, score: number): number {
    // Basic moving average for mastery
    return (previousLevel * 0.4) + (score * 0.6);
  }
}

export const assessmentEngine = new AssessmentEngine();
