import { GoogleGenAI } from "@google/genai";
import { db } from "@/lib/db";
import { learningPatterns } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export async function analyzeAndImprove(userId: string, content: string, context?: any) {
  // 1. Analizar patrones previos del usuario
  const patterns = await db
    .select()
    .from(learningPatterns)
    .where(eq(learningPatterns.userId, userId))
    .orderBy(desc(learningPatterns.createdAt))
    .limit(5);

  // 2. Prompt contextual para auto-mejora
  const prompt = `
    Eres un asistente de auto-mejora para un sistema educativo personal.
    
    CONTEXTO DEL USUARIO (últimas interacciones):
    ${patterns.map(p => `- ${p.actionType}: ${p.outcome}`).join('\n')}
    
    CONTENIDO A MEJORAR:
    "${content}"
    
    INSTRUCCIONES:
    1. Identifica áreas de mejora (claridad, estructura, profundidad)
    2. Sugiere 3 versiones mejoradas con diferentes enfoques
    3. Explica brevemente por qué cada versión es mejor
    4. Mantén el tono auténtico y creativo del usuario
    
    Formato de respuesta JSON:
    {
      "analysis": "...",
      "suggestions": [
        { "version": 1, "content": "...", "reason": "..." }
      ],
      "nextSteps": ["...", "..."]
    }
  `;

  // 3. Llamar a Gemini
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  let result;
  try {
    result = JSON.parse(response.text || "{}");
  } catch (parseError) {
    console.error('[self-improvement] JSON parse failed:', parseError);
    result = {
      analysis: "No se pudo generar análisis. Intenta de nuevo.",
      suggestions: [],
      nextSteps: ["Revisa la claridad de tu solicitud"]
    };
  }

  // 4. Registrar patrón de aprendizaje
  await db.insert(learningPatterns).values({
    userId,
    actionType: "content_improvement_request",
    context: { originalLength: content.length, ...context },
    outcome: "pending_review",
    aiFeedback: result.analysis
  });

  return result;
}
