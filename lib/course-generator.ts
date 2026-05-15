
import { groq } from './groq';
import { Course } from './types';

export async function generateCourse(topic: string): Promise<Course> {
  const prompt = `
    Create a comprehensive learning course for the topic: "${topic}".
    Return a JSON object conforming exactly to this schema:
    {
      "id": "unique-id",
      "topic": "${topic}",
      "title": "Clear Course Title",
      "description": "Short compelling overview",
      "difficulty": "Beginner | Intermediate | Advanced",
      "duration": "Estimated time to complete (e.g. 4 hours)",
      "curriculum": [
        {
          "id": "mod-1",
          "title": "Module Title",
          "description": "Module description",
          "objective": "What learner will achieve",
          "lessons": [
            { "id": "lesson-1", "title": "Lesson Title", "type": "concept", "content_preview": "Quick summary" }
          ]
        }
      ],
      "knowledgeGraph": {
        "nodes": [ { "id": "node-1", "label": "Key Concept", "type": "core" } ],
        "edges": [ { "from": "node-1", "to": "node-2", "label": "leads to" } ]
      }
    }

    Requirements:
    - Structured for optimal cognitive retention.
    - At least 3-4 modules.
    - Knowledge graph should represent semantic connections.
    - Avoid jargon in descriptions.
    - Return ONLY the JSON object.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const text = chatCompletion.choices[0]?.message?.content || "{}";
    return JSON.parse(text) as Course;
  } catch (error) {
    console.error("Course Generation Error:", error);
    throw new Error("Failed to synthesize your course. Please check your topic and try again.");
  }
}
