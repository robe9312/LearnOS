import { GoogleGenAI } from "@google/genai";
import { db } from "../db";
import { quizzes, quizQuestions, userQuizAttempts, nodeMastery } from "../../src/db/schema";
import { eq, and } from "drizzle-orm";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

export async function generateQuizForNode(skillNodeId: number, difficulty: number) {
  // 1. Verificar si existen quizzes existentes para esta dificultad aproximada
  // 2. Si no, generar con Gemini
  
  const prompt = `Generate a quiz of 5 questions for skill node ${skillNodeId} with difficulty ${difficulty}.
  Format: JSON { "questions": [{ "question": "...", "options": ["...", "..."], "correctAnswer": 0 }] }`;
  
  const result = await ai.models.generateContent({ 
    model: "gemini-2.0-flash",
    contents: [{ parts: [{ text: prompt }] }] 
  });
  
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const quizData = JSON.parse(text);
  
  // 3. Guardar en DB
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
