
import { groq } from './groq';
import { Course, Module, Lesson } from './types';

/**
 * Stage 1: Decomposition Layer
 * Breaks down the topic into specific sub-skills and difficulty tiers.
 */
async function decomposeTopic(topic: string) {
  const prompt = `
    Analyze the topic: "${topic}".
    Perform a cognitive decomposition of this subject for a Learning Execution Engine.
    Identify:
    1. Core prerequisites.
    2. Primary sub-skills (Taxonomy).
    3. Structural dependencies (What must be learned before what).
    4. Ideal difficulty mapping (Beginner/Intermediate/Advanced targets).

    Return ONLY a JSON object:
    {
      "taxonomy": ["skill 1", "skill 2", ...],
      "dependencies": [{"from": "skill A", "to": "skill B"}],
      "difficulty_map": "Beginner | Intermediate | Advanced",
      "estimated_cycles": "Time in hours"
    }
  `;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0]?.message?.content || "{}");
}

/**
 * Stage 2: Structure Layer
 * Converts taxonomy into a sequenced pedagogical skeleton (Modules).
 */
async function structureCurriculum(topic: string, taxonomy: any) {
  const prompt = `
    Topic: ${topic}
    Taxonomy: ${JSON.stringify(taxonomy)}
    
    Design an executable pedagogical structure. 
    Sequencing must prioritize "Low Cognitive Load -> High Complexity".
    Create 3-5 Modules.
    
    Return ONLY a JSON object:
    {
      "title": "Clear Course Title",
      "description": "Short compelling overview",
      "modules": [
        {
          "id": "m1",
          "title": "Title",
          "objective": "Objective",
          "subskills": ["skill X", "skill Y"]
        }
      ]
    }
  `;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0]?.message?.content || "{}");
}

/**
 * Stage 3: Content & Reasoning Layer
 * Populates lessons, knowledge graph, and provides pedagogical reasoning for each segment.
 */
async function assembleFullCourse(topic: string, skeleton: any, taxonomy: any): Promise<Course> {
  const prompt = `
    Final assembly for course: "${topic}".
    Skeleton: ${JSON.stringify(skeleton)}
    Taxonomy Context: ${JSON.stringify(taxonomy)}

    Populate the following:
    1. For each module, generate 2-3 Lessons.
    2. For each lesson, provide "pedagogical_reasoning" (Why does this lesson exist in this order?).
    3. Construct a Knowledge Graph (nodes and edges) for the full course.

    Return ONLY a JSON object conforming to this schema:
    {
      "id": "guid",
      "topic": "${topic}",
      "title": "${skeleton.title}",
      "description": "${skeleton.description}",
      "difficulty": "${taxonomy.difficulty_map}",
      "duration": "${taxonomy.estimated_cycles}",
      "curriculum": [
        {
          "id": "module-id",
          "title": "Module Title",
          "description": "...",
          "objective": "...",
          "lessons": [
            {
              "id": "lesson-id",
              "title": "Lesson Title",
              "type": "concept | application | synthesis",
              "content_preview": "Summary",
              "pedagogical_reasoning": "This lesson exists because..."
            }
          ]
        }
      ],
      "knowledgeGraph": {
        "nodes": [{ "id": "n1", "label": "Concept", "type": "core" }],
        "edges": [{ "from": "n1", "to": "n2", "label": "prerequisite" }]
      }
    }
  `;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  const raw = JSON.parse(response.choices[0]?.message?.content || "{}");
  
  // Add metadata
  return {
    ...raw,
    metadata: {
      generated_at: new Date().toISOString(),
      pipeline_version: "2.0-compiler-architecture"
    }
  } as Course;
}

export async function generateCourse(topic: string): Promise<Course> {
  try {
    console.log("[Pipeline] Starting Decomposition Layer...");
    const taxonomy = await decomposeTopic(topic);
    
    console.log("[Pipeline] Starting Structure Layer...");
    const skeleton = await structureCurriculum(topic, taxonomy);
    
    console.log("[Pipeline] Starting Assembly Layer...");
    const course = await assembleFullCourse(topic, skeleton, taxonomy);
    
    return course;
  } catch (error) {
    console.error("Course Generation Pipeline Error:", error);
    throw new Error("Learning Compiler failed to synthesize your course. Please try a different topic.");
  }
}
