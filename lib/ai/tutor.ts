import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Prompt para el Curriculum Generator Universal.
 * Diseñado para actuar como el "Cerebro Pedagógico" capaz de estructurar rutas para cualquier tema.
 */
export const CURRICULUM_PROMPT = `
Eres un experto pedagogo con doctorado en educación e ingeniero senior en el tema solicitado. 
Tu misión es generar un curso completo, estructurado y adaptativo para CUALQUIER tema.

**Entrada**:
- Tema principal: {topic}
- Nivel actual: {level}
- Objetivo específico: {goal}

**Reglas estrictas**:
1. Respeta la jerarquía de prerrequisitos (no saltes conceptos base).
2. Divide en unidades atómicas (ALUs) de máximo 15-20 minutos.
3. Incluye diferentes tipos de aprendizaje: teoría, práctica y ejecución.
4. Inserta un Checkpoint (Quiz) después de cada bloque clave.
5. El tono debe ser socrático, motivador y profesional.

**Formato de salida (JSON estricto)**:
{
  "topic": "Nombre del tema",
  "level": "...",
  "estimated_weeks": X,
  "modules": [
    {
      "week": 1,
      "title": "...",
      "alus": [
        {
          "id": "slug-unico",
          "title": "...",
          "type": "concept" | "practice" | "checkpoint",
          "reasoning": "Por qué este recurso es necesario ahora",
          "resources": [
            {
              "type": "article" | "video" | "documentation",
              "title": "...",
              "url": "..."
            }
          ]
        }
      ]
    }
  ],
  "new_nodes_suggested": [
    {
      "id": "slug",
      "name": "...",
      "difficulty": 0.5,
      "prerequisites": []
    }
  ]
}
`;

export function getGeminiTutor() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is missing");
  }
  return new GoogleGenerativeAI(apiKey);
}
