import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { db } from "../db";
import { quizzes, quizQuestions, userQuizAttempts, nodeMastery } from "../../src/db/schema";
import { eq } from "drizzle-orm";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });

export async function generateQuizForNode(skillNodeId: number, difficulty: number) {
  const prompt = `Generate a quiz of 5 questions for skill node ${skillNodeId} with difficulty ${difficulty}.
  Format: JSON { "questions": [{ "question": "...", "options": ["...", "..."], "correctAnswer": 0 }] }`;
  
  const { text } = await generateText({
    model: groq('llama-3.3-70b-versatile'),
    prompt: prompt,
  });
  
  const quizData = JSON.parse(text || "{}");
  
  // Guardar en DB
  const [newQuiz] = await db.insert(quizzes).values({ skillNodeId, difficultyLevel: difficulty }).returning();
  
  for (const q of quizData.questions) {
    await db.insert(quizQuestions).values({
      quizId: newQuiz.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    });
  }
  
  return { quizId: newQuiz.id, questions: quizData.questions };
}

export async function submitQuizAttempt(userId: string, quizId: number, score: number) {
  await db.insert(userQuizAttempts).values({ userId, quizId, score });
  
  // Actualizar maestría - heurística simple
  const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
  
  await db.insert(nodeMastery)
    .values({
      userId,
      nodeId: quiz.skillNodeId,
      masteryLevel: score,
    })
    .onConflictDoUpdate({
      target: [nodeMastery.userId, nodeMastery.nodeId],
      set: { masteryLevel: score, lastAssessment: new Date() }
    });
}
